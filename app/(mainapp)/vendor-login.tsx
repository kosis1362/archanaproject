import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff, ArrowLeft, Store } from 'lucide-react-native';

export default function VendorLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [enterpriseName, setEnterpriseName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showResend, setShowResend] = useState(false);

    const { login, signUp, resendVerification, resetPassword, refreshUser, isLoading } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated && user) {
            router.replace('/vendor');
        }
    }, [isAuthenticated, user]);

    const handleForgotPassword = async () => {
        if (!email) {
            setErrorMessage('Please enter your email first.');
            return;
        }
        try {
            setErrorMessage(null);
            const res: any = await resetPassword(email);
            if (res?.success) setSuccessMessage(res.message);
        } catch (error: any) {
            setErrorMessage(error.message);
        }
    };

    const handleAuth = async () => {
        if (!email || !password) {
            setErrorMessage(t('fillAllFields'));
            return;
        }

        try {
            if (isSignUp) {
                if (!name || !enterpriseName || !phone || !address) {
                    setErrorMessage(t('fillAllFields'));
                    return;
                }
                const res: any = await signUp(email, password, name, 'vendor', phone, address, enterpriseName);
                setIsSignUp(false); // Switch to login form after signup
                if (res?.profileError) {
                    setErrorMessage(`Signup succeeded but profile save failed: ${res.profileError}`);
                    return;
                }
                router.push(`/verify-email?email=${encodeURIComponent(email)}&role=vendor`);
                return;
            } else {
                const loggedInUser = await login(email, password, 'vendor');
                if (loggedInUser && !loggedInUser.isVerified) {
                    setShowResend(true);
                    router.push(`/verify-email?email=${encodeURIComponent(email)}&role=vendor`);
                    return;
                }
                router.replace('/vendor');
            }
        } catch (error: any) {
            setErrorMessage(error.message || t('authFailed'));
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setErrorMessage(null);
            setSuccessMessage(null);
            const res = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: Linking.createURL('/') } });
            if (res.error) {
                setErrorMessage(res.error.message);
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'Google sign-in failed');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.background} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <ArrowLeft size={24} color="#fff" />
                </TouchableOpacity>

                <View style={styles.headerContainer}>
                    <View style={styles.iconCircle}>
                        <Store size={40} color="#fff" />
                    </View>
                    <Text style={styles.portalTitle}>{t('sellerPortal')}</Text>
                    <Text style={styles.subtitle}>{t('signinManageStore')}</Text>
                </View>

                <View style={styles.card}>
                    {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
                    {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
                    {isSignUp && (
                        <>
                            <View style={styles.inputWrapper}>
                                <Store size={20} color="#6B7280" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('enterpriseName')}
                                    value={enterpriseName}
                                    onChangeText={setEnterpriseName}
                                    autoCapitalize="words"
                                />
                            </View>

                            <View style={styles.inputWrapper}>
                                <User size={20} color="#6B7280" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('vendorFullName')}
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                />
                            </View>
                        </>
                    )}

                    <View style={styles.inputWrapper}>
                        <Mail size={20} color="#6B7280" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('email')}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {isSignUp && (
                        <>
                            <View style={styles.inputWrapper}>
                                <Phone size={20} color="#6B7280" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('phone')}
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                />
                            </View>

                            <View style={styles.inputWrapper}>
                                <MapPin size={20} color="#6B7280" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('address')}
                                    value={address}
                                    onChangeText={setAddress}
                                    autoCapitalize="sentences"
                                />
                            </View>
                        </>
                    )}

                    <View style={styles.inputWrapper}>
                        <Lock size={20} color="#6B7280" style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder={t('password')}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                        </TouchableOpacity>
                    </View>

                    {!isSignUp && (
                        <TouchableOpacity style={styles.forgotContainer} onPress={handleForgotPassword}>
                            <Text style={styles.forgotText}>{t('forgotPassword')}</Text>
                        </TouchableOpacity>
                    )}

                    {showResend && !isSignUp && (
                        <TouchableOpacity
                            style={styles.resendButton}
                            onPress={() => resendVerification(email)}
                        >
                            <Text style={styles.resendText}>Didn't receive email? Resend link</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        onPress={handleAuth}
                        disabled={isLoading}
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
                                <Text style={styles.actionButtonText}>{isSignUp ? t('registerStoreButton') : t('signIn')}</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>{t('continueWith')}</Text>
                        <View style={styles.divider} />
                    </View>

                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn}>
                            <Text style={styles.socialButtonText}>Continue with Google</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>
                            {isSignUp ? t('alreadyHaveStore') : t('newSeller')}
                        </Text>
                        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                            <Text style={styles.switchText}>{isSignUp ? t('signIn') : t('registerStore')}</Text>
                        </TouchableOpacity>
                    </View>
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
        padding: 16,
        paddingTop: 30,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    portalTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 18,
        // Use boxShadow on web; keep native shadow props for mobile
        ...(Platform.OS === 'web'
            ? { boxShadow: '0px 6px 10px rgba(0,0,0,0.10)' }
            : { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 }
        ),
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
        marginBottom: 10,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },
    forgotContainer: {
        alignSelf: 'flex-end',
        marginBottom: 25,
    },
    forgotText: {
        color: '#B91C1C',
        fontSize: 14,
        fontWeight: '600',
    },
    actionButton: {
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    switchLabel: {
        color: '#6B7280',
        fontSize: 15,
    },
    switchText: {
        color: '#B91C1C',
        fontSize: 15,
        fontWeight: 'bold',
    },
    resendButton: {
        alignItems: 'center',
        marginBottom: 20,
    },
    resendText: {
        color: '#6B7280',
        fontSize: 14,
        textDecorationLine: 'underline',
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
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        marginHorizontal: 12,
        color: '#6B7280',
        fontSize: 14,
    },
    socialContainer: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 20,
    },
    socialButton: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    socialButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
});
