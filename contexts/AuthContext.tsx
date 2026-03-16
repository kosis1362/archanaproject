import { useState, useEffect } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { User, UserRole } from '@/types';
import { useRouter } from 'expo-router';
import { authApi } from '@/lib/login';
import { apiClient } from '@/lib/apiClient';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string, role: UserRole) => Promise<User | null>;
    signUp: (email: string, password: string, name: string, role: UserRole, phone?: string, address?: string, businessName?: string) => Promise<{ success: boolean; message: string }>;
    logout: () => Promise<void>;
    switchRole: (role: UserRole) => void;
    resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
    refreshUser: () => Promise<void>;
    updatePassword: (password: string) => Promise<{ success: boolean; message: string }>;
}

const generateMockUserFromToken = (email: string, role: UserRole, name?: string): User => ({
    id: 'user-' + Date.now().toString(),
    email,
    name: name || email.split('@')[0] || 'User',
    role,
    isVerified: true,
    createdAt: new Date().toISOString(),
});

export const [AuthProvider, useAuth] = createContextHook<AuthState>(
    () => {
        const [user, setUser] = useState<User | null>(null);
        const [isLoading, setIsLoading] = useState(true);
        const router = useRouter();

        useEffect(() => {
            const loadStoredUser = async () => {
                try {
                    const token = await apiClient.getToken();
                    if (token) {
                        const storedRole = await apiClient.getRole();
                        const roleToRestore = (storedRole || 'customer') as UserRole;
                        setUser(generateMockUserFromToken('restored@example.com', roleToRestore));
                    }
                } catch (error) {
                    console.error("Error restoring session:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            loadStoredUser();
        }, []);

        const login = async (email: string, password: string, role: UserRole) => {
            setIsLoading(true);
            try {
                const response = await authApi.login(email, password, role);
                
                if (response.token) {
                    await apiClient.setToken(response.token);
                    await apiClient.setRole(role.toLowerCase());
                }

                // Construct user object (mocked ID for now if backend only returns token)
                const userData = generateMockUserFromToken(email, role);
                setUser(userData);
                return userData;
            } catch (error: any) {
                console.error("Login failed:", error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        };

        const signUp = async (email: string, password: string, name: string, role: UserRole, phone?: string, address?: string, businessName?: string) => {
            setIsLoading(true);
            try {
                const response = await authApi.register(name, email, password, role);

                if (response.token) {
                    await apiClient.setToken(response.token);
                    await apiClient.setRole(role.toLowerCase());
                }

                const userData: User = {
                    ...generateMockUserFromToken(email, role, name),
                    phone,
                    address,
                    businessName,
                };
                setUser(userData);
                return { success: true, message: response.message || 'Signup successful!' };
            } catch (error: any) {
                console.error("Signup failed:", error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        };

        const logout = async () => {
            await apiClient.removeToken();
            await apiClient.removeRole();
            setUser(null);
            router.replace('/');
        };

        const switchRole = async (role: UserRole) => {
            if (user) {
                setUser({ ...user, role });
            }
        };

        const resetPassword = async (email: string) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true, message: 'Reset link sent to your email.' };
        };

        const refreshUser = async () => {
            // No operation in mock
        };

        const updatePassword = async (password: string) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true, message: 'Password updated.' };
        };

        return {
            user,
            isLoading,
            isAuthenticated: !!user,
            login,
            signUp,
            logout,
            switchRole,
            resetPassword,
            refreshUser,
            updatePassword,
        };
    },
    {
        user: null,
        isLoading: true,
        isAuthenticated: false,
        login: async () => { return null; },
        signUp: async () => { return { success: false, message: '' }; },
        logout: async () => { },
        switchRole: () => { },
        resetPassword: async () => { return { success: false, message: '' }; },
        refreshUser: async () => { },
        updatePassword: async () => { return { success: false, message: '' }; },
    }
);
