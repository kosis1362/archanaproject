export type UserRole = 'customer' | 'vendor';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    isVerified: boolean;
    createdAt: string;
    avatar?: string;
    phone?: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    vendorId: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}
