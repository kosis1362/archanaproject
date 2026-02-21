import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { Platform } from 'react-native';
import { User, UserRole } from '@/types';
import { supabase } from '@/lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';

interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string, role: UserRole) => Promise<User | null>;
    signUp: (email: string, password: string, name: string, role: UserRole, phone?: string, address?: string, businessName?: string) => Promise<{ success: boolean; message: string; profileError?: string }>;
    resendVerification: (email: string) => Promise<{ success: boolean; message: string }>;
    logout: () => Promise<void>;
    switchRole: (role: UserRole) => void;
    resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
    refreshUser: () => Promise<void>;
    updatePassword: (password: string) => Promise<{ success: boolean; message: string }>;
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
        phone: supabaseUser.user_metadata?.phone || supabaseUser.phone,
        address: supabaseUser.user_metadata?.address,
        businessName: supabaseUser.user_metadata?.businessName,
    };
};

export const [AuthProvider, useAuth] = createContextHook<AuthState>(
    () => {
        const [user, setUser] = useState<User | null>(null);
        const [session, setSession] = useState<Session | null>(null);
        const [isLoading, setIsLoading] = useState(true);
        const [currentRole, setCurrentRole] = useState<UserRole>('customer');
        const router = useRouter();

        useEffect(() => {
            console.log('[Auth] Initializing auth state...');

            supabase.auth.getSession().then(({ data: { session } }) => {
                console.log('[Auth] Initial session:', session ? 'Found' : 'None');
                if (session) {
                    setSession(session);
                    loadUserRole(session);
                } else {
                    setIsLoading(false);
                }
            });

            // Log environment status for debugging (Web only)
            if (Platform.OS === 'web') {
                console.log('[Auth] Env Status:', {
                    hasUrl: !!process.env.EXPO_PUBLIC_SUPABASE_URL,
                    hasKey: !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
                    isStripeKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.startsWith('sb_publishable')
                });
            }

            const { data: { subscription } } = supabase.auth.onAuthStateChange(
                async (event, session) => {
                    console.log('[Auth] Auth state changed:', event, session?.user?.email || 'No user');
                    setSession(session);

                    if (session?.user) {
                        await loadUserRole(session);
                    } else if (event === 'SIGNED_OUT') {
                        setUser(null);
                        setSession(null);
                        setCurrentRole('customer');
                        await AsyncStorage.removeItem('bechbikhan_role');
                    }

                    if (event === 'PASSWORD_RECOVERY') {
                        router.push('/reset-password');
                    }

                    if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'USER_UPDATED') {
                        setIsLoading(false);
                    }
                }
            );

            return () => {
                subscription.unsubscribe();
            };
        }, []);

        const loadUserRole = async (session: Session | null) => {
            if (!session?.user) {
                setIsLoading(false);
                return;
            }

            try {
                const storedRole = await AsyncStorage.getItem('bechbikhan_role');
                const role = (storedRole as UserRole) || 'customer';
                setCurrentRole(role);

                // Fetch profile to get metadata and sync role
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                const userObj = mapSupabaseUser(session.user, profile?.role || role);
                if (userObj && profile) {
                    userObj.name = profile.name || userObj.name;
                    userObj.avatar = profile.avatar_url || userObj.avatar;
                    userObj.phone = profile.phone || userObj.phone;
                    userObj.address = profile.address || userObj.address;
                    userObj.businessName = profile.business_name || userObj.businessName;

                    if (profile.role && profile.role !== role) {
                        await AsyncStorage.setItem('bechbikhan_role', profile.role);
                        setCurrentRole(profile.role as UserRole);
                    }
                }
                setUser(userObj);
            } catch (error: any) {
                console.error('[Auth] Error loading user role:', error.message);
                // Fallback to basic user mapping
                if (session?.user) {
                    setUser(mapSupabaseUser(session.user, 'customer'));
                }
            } finally {
                setIsLoading(false);
            }
        };

        // Add periodic refresh for unverified users to catch external verification (e.g. from email link in another tab)
        useEffect(() => {
            let interval: NodeJS.Timeout;
            if (user && !user.isVerified && session) {
                console.log('[Auth] Starting verification watcher...');
                interval = setInterval(() => {
                    refreshUser();
                }, 10000); // Check every 10 seconds
            }
            return () => {
                if (interval) clearInterval(interval);
            };
        }, [user?.isVerified, !!session]);

        const login = async (email: string, password: string, role: UserRole) => {
            setIsLoading(true);
            try {
                console.log('[Auth] Attempting login for:', email, 'as', role);

                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    console.error('[Auth] Supabase login error:', error.message, '| Full error:', JSON.stringify(error));
                    throw new Error(error.message);
                }

                if (data.user) {
                    // Check if email is verified before allowing login
                    if (!data.user.email_confirmed_at) {
                        console.log('[Auth] Login attempt with unverified email');
                        throw new Error('Please verify your email before logging in.');
                    }

                    setSession(data.session); // Set session immediately
                    await AsyncStorage.setItem('bechbikhan_role', role);

                    // Fetch profile to get metadata
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', data.user.id)
                        .single();

                    const userWithProfile = mapSupabaseUser(data.user, role);
                    if (userWithProfile && profile) {
                        userWithProfile.name = profile.name || userWithProfile.name;
                        userWithProfile.avatar = profile.avatar_url || userWithProfile.avatar;
                        userWithProfile.phone = profile.phone || userWithProfile.phone;
                        userWithProfile.address = profile.address || userWithProfile.address;
                        userWithProfile.businessName = profile.business_name || userWithProfile.businessName;
                    }

                    setUser(userWithProfile);
                    setCurrentRole(role);
                    console.log('[Auth] Login successful');
                    return userWithProfile;
                }
                return null;
            } catch (error) {
                console.log('[Auth] Login failed:', error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        };

        const signUp = async (email: string, password: string, name: string, role: UserRole, phone?: string, address?: string, businessName?: string) => {
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
                            phone,
                            address,
                            businessName,
                        },
                        emailRedirectTo: Linking.createURL('/'),
                    },
                });

                if (error) {
                    console.error('[Auth] Supabase signup error:', error.message, '| Full error:', JSON.stringify(error));
                    throw new Error(error.message);
                }

                if (data.user) {
                    setSession(data.session); // Set session immediately to prevent race conditions in guards
                    await AsyncStorage.setItem('bechbikhan_role', role);
                    setCurrentRole(role);
                    setUser(mapSupabaseUser(data.user, role));

                    // Create profile entry asynchronously with retry logic
                    const createProfile = async (retries = 3) => {
                        let lastError: any;
                        for (let i = 0; i < retries; i++) {
                            const { error: profileError } = await supabase
                                .from('profiles')
                                .insert([
                                    {
                                        id: data.user.id,
                                        name,
                                        role,
                                        phone: phone || null,
                                        address: address || null,
                                        business_name: businessName || null,
                                        email: email,
                                        created_at: new Date().toISOString(),
                                        updated_at: new Date().toISOString(),
                                    }
                                ]);

                            if (!profileError) {
                                console.log('[Auth] Profile created successfully');
                                return { success: true };
                            }

                            lastError = profileError;
                            console.log(`[Auth] Profile creation attempt ${i + 1} failed:`, profileError.message);

                            // Wait before retrying
                            if (i < retries - 1) {
                                await new Promise(resolve => setTimeout(resolve, (i + 1) * 1000));
                            }
                        }

                        return { success: false, error: lastError };
                    };

                    const profileResult = await createProfile();

                    console.log('[Auth] Signup successful');

                    if (!profileResult.success) {
                        console.log('[Auth] Profile creation error:', profileResult.error?.message);
                        // Return structured response but mark as warning, not critical
                        return {
                            success: true,
                            message: 'Signup successful! Please verify your email to continue.',
                            profileError: profileResult.error?.message || 'Could not save full profile, but account created.'
                        };
                    }

                    // Informational message for caller
                    console.log('[Auth] Verification email sent to user.');
                    return { success: true, message: 'Signup successful. Verification email sent.' };
                }
                return { success: false, message: 'Signup failed to create user.' };
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
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: Linking.createURL('/reset-password'),
                });

                if (error) {
                    console.log('[Auth] Password reset error:', error.message);
                    throw new Error(error.message);
                }

                console.log('[Auth] Password reset email sent');
                return { success: true, message: 'Check your email for password reset instructions.' };
            } catch (error) {
                console.log('[Auth] Password reset failed:', error);
                throw error;
            }
        };

        const resendVerification = async (email: string) => {
            try {
                const { error } = await supabase.auth.resend({
                    type: 'signup',
                    email: email,
                });
                if (error) throw error;
                return { success: true, message: 'Verification email resent!' };
            } catch (error: any) {
                throw error;
            }
        };

        const refreshUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) throw error;
                if (user) {
                    const storedRole = await AsyncStorage.getItem('bechbikhan_role');
                    const role = (storedRole as UserRole) || 'customer';
                    setUser(mapSupabaseUser(user, role));
                }
            } catch (error) {
                console.log('[Auth] Refresh user failed:', error);
            }
        };

        const updatePassword = async (password: string) => {
            setIsLoading(true);
            try {
                const { error } = await supabase.auth.updateUser({ password });
                if (error) throw error;
                return { success: true, message: 'Your password has been updated.' };
            } catch (error: any) {
                throw error;
            } finally {
                setIsLoading(false);
            }
        };

        return {
            user,
            session,
            isLoading,
            isAuthenticated: !!user && !!session && (user.isVerified || false),
            login,
            signUp,
            resendVerification,
            logout,
            switchRole,
            resetPassword,
            refreshUser,
            updatePassword,
        };
    },
    {
        user: null,
        session: null,
        isLoading: true,
        isAuthenticated: false,
        login: async () => { return null; },
        signUp: async () => { return { success: false, message: '' }; },
        resendVerification: async () => { return { success: false, message: '' }; },
        logout: async () => { },
        switchRole: () => { },
        resetPassword: async () => { return { success: false, message: '' }; },
        refreshUser: async () => { },
        updatePassword: async () => { return { success: false, message: '' }; },
    }
);
