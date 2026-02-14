import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { User, UserRole } from '@/types';
import { supabase } from '@/lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string, role: UserRole) => Promise<void>;
    signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
    logout: () => Promise<void>;
    switchRole: (role: UserRole) => void;
    resetPassword: (email: string) => Promise<void>;
}

const mapSupabaseUser = (supabaseUser: SupabaseUser | null, role: UserRole): User | null => {
    if (!supabaseUser) return null;

    return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
        role: role,
        isVerified: supabaseUser.email_confirmed_at !== null,
        createdAt: supabaseUser.created_at || new Date().toISOString(),
        avatar: supabaseUser.user_metadata?.avatar_url,
        phone: supabaseUser.phone,
    };
};

export const [AuthProvider, useAuth] = createContextHook<AuthState>(
    () => {
        const [user, setUser] = useState<User | null>(null);
        const [session, setSession] = useState<Session | null>(null);
        const [isLoading, setIsLoading] = useState(true);
        const [currentRole, setCurrentRole] = useState<UserRole>('customer');

        useEffect(() => {
            console.log('[Auth] Initializing auth state...');

            supabase.auth.getSession().then(({ data: { session } }) => {
                console.log('[Auth] Initial session:', session ? 'Found' : 'None');
                setSession(session);
                loadUserRole(session);
            });

            const { data: { subscription } } = supabase.auth.onAuthStateChange(
                async (event, session) => {
                    console.log('[Auth] Auth state changed:', event);
                    setSession(session);

                    if (event === 'SIGNED_IN' && session) {
                        const storedRole = await AsyncStorage.getItem('bechbikhan_role');
                        const role = (storedRole as UserRole) || 'customer';
                        setCurrentRole(role);
                        setUser(mapSupabaseUser(session.user, role));
                    } else if (event === 'SIGNED_OUT') {
                        setUser(null);
                        setCurrentRole('customer');
                    }

                    setIsLoading(false);
                }
            );

            return () => {
                subscription.unsubscribe();
            };
        }, []);

        const loadUserRole = async (session: Session | null) => {
            try {
                if (session?.user) {
                    const storedRole = await AsyncStorage.getItem('bechbikhan_role');
                    const role = (storedRole as UserRole) || 'customer';
                    setCurrentRole(role);
                    setUser(mapSupabaseUser(session.user, role));
                }
            } catch (error) {
                console.log('[Auth] Error loading user role:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const login = async (email: string, password: string, role: UserRole) => {
            setIsLoading(true);
            try {
                console.log('[Auth] Attempting login for:', email, 'as', role);

                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    console.log('[Auth] Login error:', error.message);
                    throw new Error(error.message);
                }

                if (data.user) {
                    await AsyncStorage.setItem('bechbikhan_role', role);
                    setCurrentRole(role);
                    setUser(mapSupabaseUser(data.user, role));
                    console.log('[Auth] Login successful');
                }
            } catch (error) {
                console.log('[Auth] Login failed:', error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        };

        const signUp = async (email: string, password: string, name: string, role: UserRole) => {
            setIsLoading(true);
            try {
                console.log('[Auth] Attempting signup for:', email, 'as', role);

                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            name,
                            role,
                        },
                    },
                });

                if (error) {
                    console.log('[Auth] Signup error:', error.message);
                    throw new Error(error.message);
                }

                if (data.user) {
                    await AsyncStorage.setItem('bechbikhan_role', role);
                    setCurrentRole(role);
                    setUser(mapSupabaseUser(data.user, role));
                    console.log('[Auth] Signup successful');
                }
            } catch (error) {
                console.log('[Auth] Signup failed:', error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        };

        const logout = async () => {
            try {
                console.log('[Auth] Logging out...');
                const { error } = await supabase.auth.signOut();

                if (error) {
                    console.log('[Auth] Logout error:', error.message);
                    throw new Error(error.message);
                }

                await AsyncStorage.removeItem('bechbikhan_role');
                setUser(null);
                setSession(null);
                setCurrentRole('customer');
                console.log('[Auth] Logout successful');
            } catch (error) {
                console.log('[Auth] Logout error:', error);
                throw error;
            }
        };

        const switchRole = async (role: UserRole) => {
            if (user) {
                console.log('[Auth] Switching role to:', role);
                const updatedUser = { ...user, role };
                setUser(updatedUser);
                setCurrentRole(role);
                await AsyncStorage.setItem('bechbikhan_role', role);
            }
        };

        const resetPassword = async (email: string) => {
            try {
                console.log('[Auth] Sending password reset to:', email);
                const { error } = await supabase.auth.resetPasswordForEmail(email);

                if (error) {
                    console.log('[Auth] Password reset error:', error.message);
                    throw new Error(error.message);
                }

                console.log('[Auth] Password reset email sent');
            } catch (error) {
                console.log('[Auth] Password reset failed:', error);
                throw error;
            }
        };

        return {
            user,
            session,
            isLoading,
            isAuthenticated: !!user && !!session,
            login,
            signUp,
            logout,
            switchRole,
            resetPassword,
        };
    },
    {
        user: null,
        session: null,
        isLoading: true,
        isAuthenticated: false,
        login: async () => { },
        signUp: async () => { },
        logout: async () => { },
        switchRole: () => { },
        resetPassword: async () => { },
    }
);
