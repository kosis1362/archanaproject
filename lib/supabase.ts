import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = 'https://zjetvahmafiaisxzaauo.supabase.co';
const supabaseAnonKey = 'sb_publishable_Zu3-qT9VtfK6muLNz_4ETw_z-Xz4X7t';

const isBrowser = Platform.OS === 'web';

const customStorage = {
    getItem: (key: string) => {
        if (isBrowser) {
            if (typeof window !== 'undefined') {
                return localStorage.getItem(key);
            }
            return null;
        }
        return AsyncStorage.getItem(key);
    },
    setItem: (key: string, value: string) => {
        if (isBrowser) {
            if (typeof window !== 'undefined') {
                localStorage.setItem(key, value);
            }
        } else {
            AsyncStorage.setItem(key, value);
        }
    },
    removeItem: (key: string) => {
        if (isBrowser) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem(key);
            }
        } else {
            AsyncStorage.removeItem(key);
        }
    },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: customStorage as any,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: isBrowser,
    },
});

export type { User, Session } from '@supabase/supabase-js';
