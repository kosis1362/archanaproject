import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { colors } from '@/constants/colors';
import React from 'react';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 5 * 60 * 1000,
        },
    },
});

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.log('App Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={errorStyles.container}>
                    <Text style={errorStyles.title}>Something went wrong</Text>
                    <Text style={errorStyles.message}>{this.state.error?.message}</Text>
                </View>
            );
        }
        return this.props.children;
    }
}

const errorStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 20,
        fontWeight: '600' as const,
        color: colors.primary,
        marginBottom: 10,
    },
    message: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});

export default function RootLayout() {
    React.useEffect(() => {
        if (typeof window !== 'undefined' && 'addEventListener' in window) {
            const handler = (ev: PromiseRejectionEvent) => {
                console.error('Unhandled promise rejection (browser):', ev.reason);
            };
            window.addEventListener('unhandledrejection', handler as any);
            return () => window.removeEventListener('unhandledrejection', handler as any);
        }
    }, []);
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <LanguageProvider>
                    <AuthProvider>
                        <CartProvider>
                            <StatusBar style="light" />
                            <RootLayoutNav />
                        </CartProvider>
                    </AuthProvider>
                </LanguageProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    );
}

function RootLayoutNav() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="customer-login" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="vendor-login" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="customer" options={{ animation: 'fade' }} />
            <Stack.Screen name="vendor" options={{ animation: 'fade' }} />
            <Stack.Screen name="product/[id]" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="checkout" options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
        </Stack>
    );
}
