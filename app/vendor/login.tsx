import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Store, Lock, ArrowLeft, Eye, EyeOff, Mail, Briefcase } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { AuthInput } from '@/components/AuthInput';
import { AuthButton } from '@/components/AuthButton';

export default function VendorLogin() {
    const router = useRouter();
    const { t } = useLanguage();
    const { login, signUp } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [businessName, setBusinessName] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        if (isSignUp && (!name || !confirmPassword || !businessName)) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        if (isSignUp && password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            if (isSignUp) {
                const result = await signUp(email, password, name, 'VENDOR' as any, '', '', businessName);
                Alert.alert('Success', result.message, [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/vendor/dashboard')
                    }
                ]);
            } else {
                await login(email, password, 'VENDOR' as any);
                router.replace('/vendor/dashboard');
            }
        } catch (error: any) {
            Alert.alert('Authentication Failed', error.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.replace('/')}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <ArrowLeft size={24} color={colors.text || '#111827'} />
                    </TouchableOpacity>

                    <View style={styles.headerSection}>
                        <View style={styles.iconCircle}>
                            <Store size={32} color="#B91C1C" />
                        </View>
                        <Text style={styles.title}>{isSignUp ? t('signUp') : t('signIn')}</Text>
                        <Text style={styles.subtitle}>{isSignUp ? 'Join our community today' : 'Sign in to continue shopping'}</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.formSection}>
                        {isSignUp && (
                            <>
                                <AuthInput
                                    icon={<Store size={20} color={colors.textSecondary} />}
                                    placeholder="Business Name"
                                    value={businessName}
                                    onChangeText={setBusinessName}
                                />
                                <AuthInput
                                    icon={<Briefcase size={20} color={colors.textSecondary} />}
                                    placeholder="Contact Person Name"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </>
                        )}
                        <AuthInput
                            icon={<Mail size={20} color={colors.textSecondary} />}
                            placeholder="Business Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <AuthInput
                            icon={<Lock size={20} color={colors.textSecondary} />}
                            placeholder={isSignUp ? "Confirm Password" : "Password"}
                            value={isSignUp ? confirmPassword : password}
                            onChangeText={isSignUp ? setConfirmPassword : setPassword}
                            secureTextEntry={true}
                            showPassword={showPassword}
                            onTogglePassword={() => setShowPassword(!showPassword)}
                        />

                        {isSignUp && (
                            <AuthInput
                                icon={<Lock size={20} color={colors.textSecondary} />}
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={true}
                                showPassword={showPassword}
                                onTogglePassword={() => setShowPassword(!showPassword)}
                            />
                        )}

                        {!isSignUp && (
                            <TouchableOpacity style={styles.forgotPassword}>
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        )}

                        <AuthButton
                            title={isSignUp ? 'Register Now' : 'Sign In as Seller'}
                            onPress={handleAuth}
                            isLoading={isLoading}
                        />
                    </View>

                    <View style={styles.infoSection}>
                        <View style={styles.infoCard}>
                            <Briefcase size={20} color="#B91C1C" />
                            <Text style={styles.infoText}>Access orders, products and analytics</Text>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>{isSignUp ? 'Already have an account? ' : 'Want to sell with us? '}</Text>
                        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                            <Text style={styles.signUpText}>{isSignUp ? 'Login' : 'Register Now'}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingHorizontal: 25,
        paddingBottom: 40,
    },
    backButton: {
        marginTop: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerSection: {
        marginTop: 40,
        marginBottom: 40,
        alignItems: 'center',
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FEE2E2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 8,
        textAlign: 'center',
    },
    formSection: {
        gap: 20,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
    },
    forgotPasswordText: {
        color: '#B91C1C',
        fontWeight: '600',
    },
    infoSection: {
        marginTop: 40,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 20,
        borderRadius: 15,
        gap: 15,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    infoText: {
        flex: 1,
        color: '#475569',
        fontSize: 14,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 60,
    },
    footerText: {
        color: '#6B7280',
        fontSize: 16,
    },
    signUpText: {
        color: '#B91C1C',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
