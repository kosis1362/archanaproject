import { Category, Product, Order } from '@/types';
import { api as axiosClient } from './apiClient';

// Mock data functions to replace Firebase backend

export const api = {
    // Dashboards
    async getCustomerDashboard(): Promise<any> {
        const response = await axiosClient.get('/customer/dashboard');
        return response.data;
    },

    async getVendorDashboard(): Promise<any> {
        const response = await axiosClient.get('/vendor/dashboard');
        return response.data;
    },

    // Categories
    async getCategories(): Promise<Category[]> {
        return [];
    },

    // Products
    async getProducts(limitCount = 20): Promise<Product[]> {
        return [];
    },

    async getProductById(id: string): Promise<Product | null> {
        return null;
    },

    async getProductsByVendor(vendorId: string): Promise<Product[]> {
        return [];
    },

    // Orders
    async getCustomerOrders(customerId: string): Promise<Order[]> {
        return [];
    },

    async getVendorOrders(vendorId: string): Promise<Order[]> {
        return [];
    },

    async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order | null> {
        return null;
    },

    // Vendors
    async getVendors(): Promise<any[]> {
        return [];
    }
};
