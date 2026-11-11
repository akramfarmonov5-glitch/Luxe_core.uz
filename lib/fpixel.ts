/**
 * Meta (Facebook) Pixel.
 *
 * Eslatma: avval bu qiymat Vite uslubidagi `import.meta.env.VITE_...` dan
 * o'qilardi — Next.js'da u doim `undefined` bo'lgani uchun pixel umuman
 * yuklanmasdi va barcha `track*` chaqiruvlari jim o'tib ketardi.
 */
export const FB_PIXEL_ID: string | undefined =
  process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || undefined;

type FbqFunction = ((...args: unknown[]) => void) & {
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
  }
}

export type PixelProduct = {
  id: number | string;
  name: string;
  price: number;
  category?: string;
};

export const pageview = () => {
  window.fbq?.('track', 'PageView');
};

export const event = (name: string, options: Record<string, unknown> = {}) => {
  window.fbq?.('track', name, options);
};

export const trackViewContent = (product: PixelProduct) => {
  event('ViewContent', {
    content_name: product.name,
    content_category: product.category,
    content_ids: [String(product.id)],
    content_type: 'product',
    value: product.price,
    currency: 'UZS',
  });
};

export const trackAddToCart = (product: PixelProduct) => {
  event('AddToCart', {
    content_name: product.name,
    content_category: product.category,
    content_ids: [String(product.id)],
    content_type: 'product',
    value: product.price,
    currency: 'UZS',
  });
};

export const trackPurchase = (
  orderId: string,
  value: number,
  productIds: string[] = [],
  currency: string = 'UZS',
) => {
  event('Purchase', {
    order_id: orderId,
    content_ids: productIds,
    content_type: 'product',
    value,
    currency,
  });
};

export const trackInitiateCheckout = (
  value: number,
  productIds: string[] = [],
  currency: string = 'UZS',
) => {
  event('InitiateCheckout', {
    content_ids: productIds,
    content_type: 'product',
    value,
    currency,
  });
};

export const trackSearch = (searchString: string) => {
  event('Search', {
    search_string: searchString,
  });
};

export const trackViewCategory = (categoryName: string) => {
  event('ViewCategory', {
    content_name: categoryName,
    content_category: categoryName,
  });
};
