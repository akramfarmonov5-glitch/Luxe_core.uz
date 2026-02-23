
const env = import.meta.env || {};
export const FB_PIXEL_ID = env.VITE_FACEBOOK_PIXEL_ID;

declare global {
  interface Window {
    fbq: any;
  }
}

export const pageview = () => {
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
};

export const event = (name: string, options = {}) => {
  if (window.fbq) {
    window.fbq('track', name, options);
  }
};

export const trackViewContent = (product: { id: number; name: string; price: number; category: string }) => {
  event('ViewContent', {
    content_name: product.name,
    content_category: product.category,
    content_ids: [product.id.toString()],
    content_type: 'product',
    value: product.price,
    currency: 'UZS',
  });
};

export const trackAddToCart = (product: { id: number; name: string; price: number; category: string }) => {
  event('AddToCart', {
    content_name: product.name,
    content_category: product.category,
    content_ids: [product.id.toString()],
    content_type: 'product',
    value: product.price,
    currency: 'UZS',
  });
};

export const trackInitiateCheckout = (items: { id: number; name: string; price: number; quantity: number }[], total: number) => {
  event('InitiateCheckout', {
    content_ids: items.map(i => i.id.toString()),
    contents: items.map(i => ({ id: i.id.toString(), quantity: i.quantity })),
    content_type: 'product',
    num_items: items.reduce((sum, i) => sum + i.quantity, 0),
    value: total,
    currency: 'UZS',
  });
};

export const trackSearch = (searchQuery: string, resultsCount: number) => {
  event('Search', {
    search_string: searchQuery,
    content_type: 'product',
    contents: [],
    value: 0,
    currency: 'UZS',
  });
};

export const trackPurchase = (orderId: string, value: number, currency: string = 'UZS', items?: { id: number; quantity: number }[]) => {
  const params: any = {
    order_id: orderId,
    value: value,
    currency: currency,
  };
  if (items && items.length > 0) {
    params.content_ids = items.map(i => i.id.toString());
    params.contents = items.map(i => ({ id: i.id.toString(), quantity: i.quantity }));
    params.content_type = 'product';
    params.num_items = items.reduce((sum, i) => sum + i.quantity, 0);
  }
  event('Purchase', params);
};
