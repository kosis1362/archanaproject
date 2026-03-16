import { UserRole } from '@/types';
import { api } from '@/lib/apiClient';

export interface AuthResponse {
    token?: string;
    role?: string;
    user?: any; 
    message?: string;
    error?: string;
}

export const authApi = {
    async register(name: string, email: string, password: string, role: UserRole): Promise<AuthResponse> {
        try {
            const response = await api.post('/auth/register', {
                name,
                email,
                password,
                role: role.toUpperCase(),
            });

            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Registration failed';
            console.error('Register API Error:', message);
            throw new Error(message);
        }
    },

    async login(email: string, password: string, requestedRole: string): Promise<AuthResponse> {
        try {
            // Note: the backend should validate requestedRole against the DB or return the DB role.
            const response = await api.post('/auth/login', {
                email,
                password,
                role: requestedRole.toUpperCase() 
            });

            return response.data;
        } catch (error: any) {
             const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Login failed';
            console.error('Login API Error:', message);
            throw new Error(message);
        }
    }
};
