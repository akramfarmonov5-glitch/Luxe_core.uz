export interface Product {
    id: number;
    name: string;
    price: number;
    formattedPrice: string;
    category: string;
    image: string;
    images?: string[];
    shortDescription: string;
    specs: { label: string; value: string }[];
    stock?: number;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    image: string;
    description?: string;
}

export interface Order {
    id: string;
    customerName: string;
    phone: string;
    total: number;
    status: string;
    date: string;
    paymentMethod: string;
    items?: CartItem[];
}

export interface CartItem {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface PromoCode {
    id: number;
    code: string;
    discount_percent: number;
    active: boolean;
    expires_at?: string;
}

export type Lang = 'uz' | 'ru';
