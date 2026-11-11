import { test, expect } from '@playwright/test';

/**
 * Smoke E2E — vitrinaning asosiy yo'llari tirikligini tekshiradi.
 *
 * Checkout oqimini bu yerga QO'SHMANG: u haqiqiy buyurtma yaratadi va
 * qoldiqni kamaytiradi. Checkout uchun alohida test-environment (fake
 * Supabase) kerak.
 */

test.describe('vitrina smoke', () => {
  test('bosh sahifa ochiladi va JSON-LD WebSite mavjud', async ({ page }) => {
    await page.goto('/uz');

    await expect(page).toHaveTitle(/LUXECORE/i);

    const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(jsonLd).toContain('"@context"');
  });

  test('katalog sahifasida mahsulot havolalari bor', async ({ page }) => {
    await page.goto('/uz/catalog');

    const productLinks = page.locator('a[href*="/uz/product/"]');
    await expect(productLinks.first()).toBeVisible();
  });

  test('kategoriya sahifasi server tomonda render bo`ladi (SEO)', async ({ page }) => {
    const response = await page.goto('/uz/category/sovga-qutilari');
    expect(response?.status()).toBeLessThan(400);

    const body = await page.locator('body').innerText();
    expect(body.length).toBeGreaterThan(200);
  });

  test('tracking sahifasida qidiruv formasi mavjud', async ({ page }) => {
    await page.goto('/uz/tracking');

    await expect(page.locator('input[type="tel"]')).toBeVisible();
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
  });

  test('sitemap.xml to`g`ri javob beradi', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain('<urlset');
    expect(body).toContain('hreflang="ru"');
  });

  test('catalog.xml (Google Merchant feed) narxi 2 xonali kasr bilan', async ({ request }) => {
    const response = await request.get('/catalog.xml');
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toMatch(/\d+\.\d{2} UZS/);
  });

  test('robots.txt yagona manbadan keladi', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain('Sitemap:');
    expect(body).toContain('/api/');
  });

  test('debug endpoint o`chirilgan (/api/hello = 404)', async ({ request }) => {
    const response = await request.get('/api/hello');
    expect(response.status()).toBe(404);
  });
});
