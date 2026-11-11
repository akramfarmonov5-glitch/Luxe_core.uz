import json
import os
import io
import math
import glob
import requests
from PIL import Image, ImageChops, ImageFilter

PNG_DIR = r"C:\Users\pc\Desktop\yangi yil\png"
PRODUCTS_JSON = "scripts/optombazar_all_51.json"
CACHE_DIR = "scripts/.r2_cache"
os.makedirs(CACHE_DIR, exist_ok=True)


def crop_rgba_png(path):
    im = Image.open(path).convert("RGBA")
    alpha = im.split()[3]
    bbox = alpha.point(lambda p: 255 if p > 25 else 0).getbbox()
    if bbox:
        im = im.crop(bbox)
    bg = Image.new("RGB", im.size, (255, 255, 255))
    bg.paste(im, mask=im.split()[3])
    return bg


def crop_webp_fg(im_bytes):
    im = Image.open(io.BytesIO(im_bytes)).convert("RGB")
    w, h = im.size
    # Sample corners to estimate background color
    corners = [
        im.getpixel((2, 2)),
        im.getpixel((w - 3, 2)),
        im.getpixel((2, h - 3)),
        im.getpixel((w - 3, h - 3)),
    ]
    bg_r = sum(c[0] for c in corners) // 4
    bg_g = sum(c[1] for c in corners) // 4
    bg_b = sum(c[2] for c in corners) // 4
    bg = Image.new("RGB", (w, h), (bg_r, bg_g, bg_b))
    diff = ImageChops.difference(im, bg).convert("L")
    mask = diff.point(lambda p: 255 if p > 18 else 0)
    bbox = mask.getbbox()
    if bbox:
        # Ensure bbox isn't tiny noise
        bw = bbox[2] - bbox[0]
        bh = bbox[3] - bbox[1]
        if bw > w * 0.15 and bh > h * 0.15:
            im = im.crop(bbox)
    return im


def extract_features(rgb_im):
    w, h = rgb_im.size
    aspect = math.log(max(w, 1) / max(h, 1))
    # Resize to 24x24 RGB and 24x24 edges
    small = rgb_im.resize((24, 24), Image.Resampling.LANCZOS)
    pixels = list(small.getdata())
    # Normalize per-channel mean/std slightly or keep absolute + mean-centered
    vec = []
    for r, g, b in pixels:
        vec.extend([r / 255.0, g / 255.0, b / 255.0])
    # Edge signature
    edges = rgb_im.convert("L").filter(ImageFilter.FIND_EDGES).resize((24, 24), Image.Resampling.LANCZOS)
    e_vec = [p / 255.0 for p in edges.getdata()]
    return vec, e_vec, aspect


def dist(f1, f2):
    v1, e1, a1 = f1
    v2, e2, a2 = f2
    # Color L1
    c_diff = sum(abs(x - y) for x, y in zip(v1, v2)) / len(v1)
    # Edge L1
    e_diff = sum(abs(x - y) for x, y in zip(e1, e2)) / len(e1)
    # Aspect ratio diff
    a_diff = abs(a1 - a2)
    return c_diff + 0.5 * e_diff + 0.15 * a_diff


def main():
    with open(PRODUCTS_JSON, "r", encoding="utf-8") as f:
        products = json.load(f)

    # Collect all local PNG features
    png_paths = sorted(glob.glob(os.path.join(PNG_DIR, "*.png")))
    print(f"Loading {len(png_paths)} local PNGs...")
    png_feats = {}
    for p in png_paths:
        fn = os.path.basename(p)
        im = crop_rgba_png(p)
        png_feats[fn] = extract_features(im)

    # Collect all unique R2 URLs across products
    r2_urls = []
    for prod in products:
        for u in prod["r2Images"]:
            if u not in r2_urls:
                r2_urls.append(u)

    print(f"Fetching & extracting features for {len(r2_urls)} R2 product images...")
    r2_feats = {}
    for idx, url in enumerate(r2_urls):
        cache_name = url.split("/")[-1].replace("?", "_")
        cache_path = os.path.join(CACHE_DIR, cache_name)
        if os.path.exists(cache_path):
            with open(cache_path, "rb") as cf:
                raw = cf.read()
        else:
            r = requests.get(url, timeout=15)
            raw = r.content
            with open(cache_path, "wb") as cf:
                cf.write(raw)
        im = crop_webp_fg(raw)
        r2_feats[url] = extract_features(im)

    # Global optimal greedy-first + swap refinement bipartite matching
    # First rank every (r2_url, png_fn) pair by distance
    pairs = []
    for url in r2_urls:
        for fn in png_feats:
            d = dist(r2_feats[url], png_feats[fn])
            pairs.append((d, url, fn))
    pairs.sort(key=lambda x: x[0])

    assigned_r2 = {}
    used_png = set()
    for d, url, fn in pairs:
        if url not in assigned_r2 and fn not in used_png:
            assigned_r2[url] = (fn, d)
            used_png.add(fn)
        if len(assigned_r2) == len(r2_urls):
            break

    # 2-opt local swap refinement to minimize total distance
    r2_list = list(assigned_r2.keys())
    improved = True
    while improved:
        improved = False
        for i in range(len(r2_list)):
            for j in range(i + 1, len(r2_list)):
                u1, u2 = r2_list[i], r2_list[j]
                p1, d1 = assigned_r2[u1]
                p2, d2 = assigned_r2[u2]
                nd1 = dist(r2_feats[u1], png_feats[p2])
                nd2 = dist(r2_feats[u2], png_feats[p1])
                if nd1 + nd2 + 1e-6 < d1 + d2:
                    assigned_r2[u1] = (p2, nd1)
                    assigned_r2[u2] = (p1, nd2)
                    improved = True

    unused_pngs = sorted([os.path.basename(p) for p in png_paths if os.path.basename(p) not in used_png])
    print(f"\nMatched {len(assigned_r2)} R2 images to unique PNGs. Remaining unused PNGs: {len(unused_pngs)}")
    print("Unused PNGs:", unused_pngs)

    # Map normalized filenames in public/products/yangi-yil/
    def to_public_name(orig_fn):
        if orig_fn == "yangi  yil karobkalar optom.png":
            return "yangi-yil-karobkalar-optom.png"
        # "yangi  yil karobkalar optom 12.png" -> "yangi-yil-karobkalar-optom-12.png"
        parts = orig_fn.replace("yangi  yil karobkalar optom", "yangi-yil-karobkalar-optom").split()
        return "-".join(parts)

    matched_products = []
    print("\nSample matches (first 15 + worst distances):")
    for prod in products:
        local_imgs = []
        dists = []
        for u in prod["r2Images"]:
            orig_fn, d = assigned_r2[u]
            pub_fn = to_public_name(orig_fn)
            local_imgs.append(f"/products/yangi-yil/{pub_fn}")
            dists.append((orig_fn, round(d, 4)))
        prod_copy = dict(prod)
        prod_copy["matchedLocalImages"] = local_imgs
        prod_copy["matchDetails"] = dists
        matched_products.append(prod_copy)

    for mp in matched_products[:15]:
        print(f"[{mp['index']}] {mp['nameUz'][:45]} -> {mp['matchDetails']}")

    print("\nMatches with highest distances (check quality):")
    by_dist = sorted(matched_products, key=lambda x: x["matchDetails"][0][1] if x["matchDetails"] else 999, reverse=True)
    for mp in by_dist[:10]:
        print(f"[{mp['index']}] {mp['nameUz'][:45]} -> {mp['matchDetails']}")

    with open("scripts/optombazar_51_matched.json", "w", encoding="utf-8") as f:
        json.dump({"products": matched_products, "unusedPngs": [to_public_name(u) for u in unused_pngs]}, f, ensure_ascii=False, indent=2)

    print("\nSaved matched results to scripts/optombazar_51_matched.json")


if __name__ == "__main__":
    main()
