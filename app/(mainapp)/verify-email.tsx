import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/constants/colors';

export default function VerifyEmail() {
    const { resendVerification, refreshUser, user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const { email, role } = useLocalSearchParams<{ email?: string; role?: 'customer' | 'vendor' }>();
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [checkingVerification, setCheckingVerification] = useState(false);

    useEffect(() => {
        // If user is verified, redirect immediately
        if (user?.isVerified && isAuthenticated) {
            const redirectPath = user.role === 'vendor' ? '/vendor' : '/customer';
            console.log('[VerifyEmail] User verified, redirecting to', redirectPath);
            router.replace(redirectPath);
        }
    }, [user?.isVerified, isAuthenticated]);

    const handleResend = async () => {
        try {
            setLoading(true);
            setMessage(null);
            const result = await resendVerification(email as string);
            setMessage('✓ Verification email resent. Check your inbox.');
        } catch (err: any) {
            setMessage('✗ Failed to resend verification. ' + (err?.message || ''));
        } finally {
            setLoading(false);
        }
    };

    const handleCheck = async () => {
        try {
            setCheckingVerification(true);
            setMessage(null);
            await refreshUser();
            // User will auto-redirect if verified in useEffect above
            setMessage('Checking verification status...');
        } catch (err: any) {
            setMessage('✗ Failed to check status. ' + (err?.message || ''));
        } finally {
            setCheckingVerification(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Verify your email</Text>
                <Text style={styles.subtitle}>We sent a verification link to</Text>
                <Text style={styles.email}>{email || 'your email'}</Text>

                <Text style={styles.instructions}>
                    Click the link in the email to verify your account. Or use the buttons below to resend or check status.
                </Text>

                {message && (
                    <Text style={[styles.message, message.startsWith('✓') ? styles.successMessage : styles.errorMessage]}>
                        {message}
                    </Text>
                )}

                <TouchableOpacity
                    style={[styles.button, (loading || checkingVerification) && styles.buttonDisabled]}
                    onPress={handleResend}
                    disabled={loading || checkingVerification}
                >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Resend verification email</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.secondary, (loading || checkingVerification) && styles.secondaryDisabled]}
                    onPress={handleCheck}
                    disabled={loading || checkingVerification}
                >
                    {checkingVerification ? <ActivityIndicator color={colors.primary} /> : <Text style={styles.secondaryText}>Check verification status</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.link} onPress={() => router.replace(role === 'vendor' ? '/vendor-login' : '/customer-login')}>
                    <Text style={styles.linkText}>Back to login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 },
    card: { width: '100%', maxWidth: 520, backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center' },
    title: { fontSize: 22, fontWeight: '700', marginBottom: 8, color: colors.primary },
    subtitle: { fontSize: 14, color: '#374151' },
    email: { marginTop: 6, fontSize: 16, fontWeight: '600', color: '#111827' },
    instructions: { marginTop: 12, fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 20 },
    message: { marginTop: 12, padding: 10, borderRadius: 6, textAlign: 'center', fontWeight: '500' },
    successMessage: { backgroundColor: '#DBEAFE', color: '#0C4A6E' },
    errorMessage: { backgroundColor: '#FEE2E2', color: '#991B1B' },
    button: { marginTop: 18, width: '100%', backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: '600' },
    buttonDisabled: { opacity: 0.5 },
    secondary: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB' },
    secondaryText: { color: colors.primary, fontWeight: '600' },
    secondaryDisabled: { opacity: 0.5 },
    link: { marginTop: 12 },
    linkText: { color: colors.primary, fontWeight: '600' },
});
