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
}

// Session data for user state
export interface SessionData {
    step?: 'idle' | 'search' | 'order_phone' | 'order_name' | 'ai_chat';
    cart: CartItem[];
    orderPhone?: string;
    aiHistory: { role: 'user' | 'model'; text: string }[];
}

export interface CartItem {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}
