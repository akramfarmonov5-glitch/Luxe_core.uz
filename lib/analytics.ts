import type { CartItem, Product } from '../types';
import { getLocalizedText } from './i18nUtils';

type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_category?: string;
  price: number;
  quantity?: number;
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

function event(name: string, params: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
}

function productToItem(product: Product, lang = 'uz', quantity?: number): AnalyticsItem {
  return {
    item_id: String(product.id),
    item_name: getLocalizedText(product.name, lang),
    item_category: getLocalizedText(product.category, lang),
    price: Number(product.price || 0),
    ...(quantity ? { quantity } : {}),
  };
}

function cartToItems(cart: CartItem[], lang = 'uz'): AnalyticsItem[] {
  return cart.map((item) => productToItem(item, lang, item.quantity));
}

export function trackViewItem(product: Product, lang = 'uz') {
  event('view_item', {
    currency: 'UZS',
    value: Number(product.price || 0),
    items: [productToItem(product, lang)],
  });
}

export function trackAddToCart(product: Product, lang = 'uz', quantity = product.itemsPerPackage || 1) {
  event('add_to_cart', {
    currency: 'UZS',
    value: Number(product.price || 0) * quantity,
    items: [productToItem(product, lang, quantity)],
  });
}

export function trackBeginCheckout(cart: CartItem[], total: number, lang = 'uz') {
  event('begin_checkout', {
    currency: 'UZS',
    value: total,
    items: cartToItems(cart, lang),
  });
}

export function trackPurchase(orderId: string, cart: CartItem[], total: number, lang = 'uz') {
  event('purchase', {
    transaction_id: orderId,
    currency: 'UZS',
    value: total,
    items: cartToItems(cart, lang),
  });
}

export function trackQuickPurchase(orderId: string, product: Product, quantity: number, total: number, lang = 'uz') {
  event('purchase', {
    transaction_id: orderId,
    currency: 'UZS',
    value: total,
    items: [productToItem(product, lang, quantity)],
  });
}

export function trackSearch(searchTerm: string) {
  event('search', { search_term: searchTerm });
}
