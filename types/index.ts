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
    address?: string;
    businessName?: string;
}

export interface Vendor extends User {
    storeName?: string;
    storeDescription?: string;
    kycStatus?: 'pending' | 'approved' | 'rejected';
    rating?: number;
    totalReviews?: number;
    totalProducts?: number;
    totalOrders?: number;
    isLive?: boolean;
}

export interface Category {
    id: string;
    name: string;
    nameNe: string;
    icon: string;
    image: string;
}

export interface Product {
    id: string;
    vendorId: string;
    vendorName?: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    images: string[];
    category: string;
    stock: number;
    rating: number;
    totalReviews: number;
    isFlashDeal?: boolean;
    flashDealEndsAt?: string;
    createdAt: string;
}

export interface CartItem {
    id: string;
    product: Product;
    quantity: number;
}

export interface OrderItem {
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    customerId: string;
    customerName: string;
    customerLocation: string;
    vendorId: string;
    items: OrderItem[];
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    totalAmount: number;
    paymentMethod: 'esewa' | 'khalti' | 'cod' | 'card';
    paymentStatus: 'pending' | 'paid' | 'failed';
    shippingAddress: string;
    createdAt: string;
    updatedAt: string;
}

export interface LiveSession {
    id: string;
    vendorId: string;
    vendorName: string;
    vendorAvatar: string;
    title: string;
    thumbnail: string;
    viewerCount: number;
    isLive: boolean;
    pinnedProducts?: Product[];
    startedAt: string;
    duration?: number;
}

export interface DashboardStats {
    todayRevenue: number;
    revenueChange: number;
    totalOrders: number;
    ordersChange: number;
    activeProducts: number;
    productsChange: number;
    storeVisitors: number;
    visitorsChange: number;
}

export interface SalesData {
    day: string;
    amount: number;
}

export interface ChatMessage {
    id: string;
    userId: string;
    userName: string;
    message: string;
    createdAt: string;
}
