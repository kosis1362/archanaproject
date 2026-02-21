import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://zjetvahmafiaisxzaauo.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Zu3-qT9VtfK6muLNz_4ETw_z-Xz4X7t';

const isBrowser = Platform.OS === 'web';

const customStorage = {
    getItem: (key: string) => {
        if (isBrowser) {
            if (typeof window !== 'undefined') {
                return Promise.resolve(localStorage.getItem(key));
            }
            return Promise.resolve(null);
        }
        return AsyncStorage.getItem(key);
    },
    setItem: (key: string, value: string) => {
        if (isBrowser) {
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem(key, value);
                    return Promise.resolve();
                } catch (e) {
                    return Promise.reject(e);
                }
            }
            return Promise.resolve();
        }
        return AsyncStorage.setItem(key, value);
    },
    removeItem: (key: string) => {
        if (isBrowser) {
            if (typeof window !== 'undefined') {
                try {
                    localStorage.removeItem(key);
                    return Promise.resolve();
                } catch (e) {
                    return Promise.reject(e);
                }
            }
            return Promise.resolve();
        }
        return AsyncStorage.removeItem(key);
    },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: customStorage as any,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
});

export type { User, Session } from '@supabase/supabase-js';
