import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import * as Linking from 'expo-linking';
import { useLanguage } from '@/contexts/LanguageContext';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, Eye, EyeOff } from 'lucide-react-native';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { updatePassword, isLoading } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [hasSession, setHasSession] = useState<boolean>(false);

    const checkSession = async () => {
        try {
            const { data } = await supabase.auth.getSession();
            if (data?.session?.user) {
                setHasSession(true);
                return true;
            }

            if (Platform.OS === 'web') {
                const url = typeof window !== 'undefined' ? window.location.href : '';
                if (url.includes('access_token') || url.includes('refresh_token')) {
                    // Let Supabase detect session in URL — give it a moment then re-check
                    await new Promise((r) => setTimeout(r, 500));
                    const { data: d2 } = await supabase.auth.getSession();
                    if (d2?.session?.user) {
                        setHasSession(true);
                        return true;
                    }
                }
            }
        } catch (err) {
            console.log('Failed to get session', err);
        }
        setHasSession(false);
        return false;
    };

    useEffect(() => {
        checkSession();
    }, []);

    const handleReset = async () => {
        if (!password || !confirmPassword) {
            setErrorMessage('Please fill all fields.');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setErrorMessage('Password must be at least 6 characters.');
            return;
        }

        try {
            setErrorMessage(null);
            const res: any = await updatePassword(password);
            if (res?.success) {
                setSuccessMessage(res.message);
                // Redirect after short delay to let user read message
                setTimeout(() => router.replace('/'), 900);
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'Failed to update password.');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.background} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.headerContainer}>
                    <Text style={styles.welcomeText}>New Password</Text>
                    <Text style={styles.subtitle}>Create a strong password to secure your account</Text>
                </View>

                <View style={styles.card}>
                    {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
                    {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
                    <View style={styles.inputWrapper}>
                        <Lock size={20} color="#6B7280" style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder="New Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputWrapper}>
                        <Lock size={20} color="#6B7280" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showPassword}
                        />
                    </View>

                    {!hasSession && (
                        <View style={{ marginBottom: 12 }}>
                            <Text style={{ color: '#374151', textAlign: 'center' }}>
                                We couldn't detect a valid session from the reset link. Please open the password reset link in the same browser or tap Retry.
                            </Text>
                            <TouchableOpacity onPress={checkSession} style={{ marginTop: 10, alignSelf: 'center' }}>
                                <Text style={{ color: '#B91C1C' }}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <TouchableOpacity
                        onPress={handleReset}
                        disabled={isLoading || !hasSession}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#B91C1C', '#EA580C']}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.actionButton}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.actionButtonText}>Update Password</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#450a0a',
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#7f1d1d',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 16,
        paddingTop: 80,
    },
    headerContainer: {
        marginBottom: 40,
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 50,
        marginBottom: 15,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },
    errorText: {
        color: '#b91c1c',
        marginBottom: 8,
        textAlign: 'center',
        fontWeight: '600',
    },
    successText: {
        color: '#065f46',
        marginBottom: 8,
        textAlign: 'center',
        fontWeight: '600',
    },
    actionButton: {
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
