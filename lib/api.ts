import { supabase } from './supabase';
import { Category, Product, Order } from '@/types';

export const api = {
    // Categories
    async getCategories(): Promise<Category[]> {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        return data.map(cat => ({
            id: cat.id,
            name: cat.name,
            nameNe: cat.name_ne,
            icon: cat.icon,
            image: cat.image_url
        }));
    },

    // Products
    async getProducts(limit = 20): Promise<Product[]> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .limit(limit)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Product[];
    },

    async getProductById(id: string): Promise<Product | null> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Product;
    },

    async getProductsByVendor(vendorId: string): Promise<Product[]> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('vendor_id', vendorId);

        if (error) throw error;
        return data as Product[];
    },

    // Orders
    async getCustomerOrders(customerId: string): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .eq('customer_id', customerId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Order[];
    },

    async getVendorOrders(vendorId: string): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .eq('vendor_id', vendorId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Order[];
    },

    async updateOrderStatus(orderId: string, status: string): Promise<void> {
        const { error } = await supabase
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', orderId);

        if (error) throw error;
    }
};
