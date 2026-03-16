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
import { Mail, Lock, ArrowLeft, Eye, EyeOff, Github, Chrome as Google } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { AuthInput } from '@/components/AuthInput';
import { AuthButton } from '@/components/AuthButton';

export default function CustomerLogin() {
    const router = useRouter();
    const { t } = useLanguage();
    const { login, signUp } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');

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

        if (isSignUp && (!name || !confirmPassword)) {
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
                const result = await signUp(email, password, name, 'CUSTOMER' as any);
                Alert.alert('Success', result.message, [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/customer/dashboard')
                    }
                ]);
            } else {
                await login(email, password, 'CUSTOMER' as any);
                router.replace('/customer/dashboard');
            }
        } catch (error: any) {
            Alert.alert('Authentication Failed', error.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = () => {
        Alert.alert('Social Login', 'Social login is currently simulated. Logging in as guest customer...');
        login('guest@example.com', 'password123', 'CUSTOMER' as any).then(() => {
            router.replace('/customer');
        });
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
                        <Text style={styles.title}>{isSignUp ? t('signUp') : t('signIn')}</Text>
                        <Text style={styles.subtitle}>{isSignUp ? 'Join our community today' : 'Sign in to continue shopping'}</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.formSection}>
                        {isSignUp && (
                            <AuthInput
                                icon={<Mail size={20} color={colors.textSecondary} />}
                                placeholder="Full Name"
                                value={name}
                                onChangeText={setName}
                            />
                        )}
                        <AuthInput
                            icon={<Mail size={20} color={colors.textSecondary} />}
                            placeholder="Email Address"
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
                            title={isSignUp ? 'Sign Up' : 'Login'}
                            onPress={handleAuth}
                            isLoading={isLoading}
                        />
                    </View>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.divider} />
                    </View>

                    {/* Social Login */}
                    <View style={styles.socialButtons}>
                        <TouchableOpacity style={styles.socialButton} onPress={handleSocialLogin}>
                            <Google size={24} color="#DB4437" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton} onPress={handleSocialLogin}>
                            <Github size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>{isSignUp ? 'Already have an account? ' : "Don't have an account? "}</Text>
                        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                            <Text style={styles.signUpText}>{isSignUp ? 'Login' : 'Sign Up'}</Text>
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
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111827',
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 8,
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
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 40,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        marginHorizontal: 15,
        color: '#9CA3AF',
        fontWeight: '600',
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    socialButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 100,
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
