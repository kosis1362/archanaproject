import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';
const ROLE_KEY = '@user_role';
const API_BASE_URL = 'http://localhost:8080';

// Global API instance
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        if (config.data) {
            console.log(`[API Payload]`, config.data);
        }
        return config;
    },
    (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.baseURL}${response.config.url}:`, response.status, response.data);
        return response;
    },
    (error) => {
        console.error(`[API Error]`, error.response?.status, error.message);
        return Promise.reject(error);
    }
);

export const apiClient = {
    async getToken(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(TOKEN_KEY);
        } catch (error) {
            console.error('Error getting auth token:', error);
            return null;
        }
    },

    async setToken(token: string): Promise<void> {
        try {
            await AsyncStorage.setItem(TOKEN_KEY, token);
        } catch (error) {
            console.error('Error saving auth token:', error);
        }
    },

    async removeToken(): Promise<void> {
        try {
            await AsyncStorage.removeItem(TOKEN_KEY);
        } catch (error) {
            console.error('Error removing auth token:', error);
        }
    },

    async getRole(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(ROLE_KEY);
        } catch (error) {
            console.error('Error getting user role:', error);
            return null;
        }
    },

    async setRole(role: string): Promise<void> {
        try {
            await AsyncStorage.setItem(ROLE_KEY, role);
        } catch (error) {
            console.error('Error saving user role:', error);
        }
    },

    async removeRole(): Promise<void> {
        try {
            await AsyncStorage.removeItem(ROLE_KEY);
        } catch (error) {
            console.error('Error removing user role:', error);
        }
    }
};
