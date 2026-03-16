import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, Animated, Modal, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { ShoppingBag, Store, Globe, Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const { width, height } = Dimensions.get('window');

export default function LandingPage() {
    const router = useRouter();
    const { t, language, setLanguage } = useLanguage();
    const { isAuthenticated, user, isLoading: authLoading } = useAuth();
    const [isLangModalVisible, setIsLangModalVisible] = useState(false);

    const productImages = [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop', // Person
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=400&fit=crop', // Clothes
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', // Watch
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', // Headphones
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', // Shoe
        'https://images.unsplash.com/photo-1526170315870-ef68a6f3dd39?w=400&h=400&fit=crop', // Camera
    ];

    // Animation values for floating effect
    const floatAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Redirect logic: enforce login
        if (!authLoading && isAuthenticated && user) {
            // User is logged in
            if (user.role.toLowerCase() === 'vendor') {
                router.replace('/vendor/dashboard');
            } else {
                router.replace('/customer/dashboard');
            }
        }

        const startAnimation = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(floatAnim, {
                        toValue: 1,
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(floatAnim, {
                        toValue: 0,
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        const timeout = setTimeout(startAnimation, 100);
        return () => clearTimeout(timeout);
    }, [isAuthenticated, user, authLoading]);

    const changeLanguage = (lang: 'en' | 'ne') => {
        setLanguage(lang);
        setIsLangModalVisible(false);
    };

    if (authLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <StatusBar style="light" />
                <View style={styles.background} />
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Background Watermark Product Grid */}
            <View style={styles.backgroundContainer}>
                {productImages.map((uri, index) => {
                    const translateY = floatAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, index % 2 === 0 ? 30 : -30],
                    });
                    const translateX = floatAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, index % 3 === 0 ? 20 : -20],
                    });

                    return (
                        <Animated.View
                            key={index}
                            style={[
                                styles.bgItem,
                                {
                                    transform: [
                                        { rotate: '-15deg' },
                                        { translateY },
                                        { translateX }
                                    ],
                                    opacity: 0.15
                                }
                            ]}
                        >
                            <Image source={{ uri }} style={styles.bgImage} />
                            <View style={styles.imageOverlay} />
                        </Animated.View>
                    );
                })}
            </View>

            <View style={styles.overlay} />

            {/* Language Switcher */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.languageButton}
                    onPress={() => setIsLangModalVisible(true)}
                >
                    <Globe size={16} color="#fff" />
                    <Text style={styles.languageText}>{language === 'en' ? 'EN' : 'NE'}</Text>
                    <Text style={[styles.languageText, { fontSize: 10, marginLeft: 2 }]}>▼</Text>
                </TouchableOpacity>
            </View>

            {/* Language Selection Modal */}
            <Modal
                transparent={true}
                visible={isLangModalVisible}
                animationType="fade"
                onRequestClose={() => setIsLangModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setIsLangModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{t('language')}</Text>

                            <TouchableOpacity
                                style={styles.langOption}
                                onPress={() => changeLanguage('en')}
                            >
                                <Text style={[styles.langOptionText, language === 'en' && styles.activeLangText]}>English</Text>
                                {language === 'en' && <Check size={20} color="#B91C1C" />}
                            </TouchableOpacity>

                            <View style={styles.langDivider} />

                            <TouchableOpacity
                                style={styles.langOption}
                                onPress={() => changeLanguage('ne')}
                            >
                                <Text style={[styles.langOptionText, language === 'ne' && styles.activeLangText]}>नेपाली (Nepali)</Text>
                                {language === 'ne' && <Check size={20} color="#B91C1C" />}
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Main Content Card */}
            <View style={styles.cardContainer}>
                <View style={styles.card}>
                    {/* Logo */}
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoText}>B</Text>
                    </View>

                    <Text style={styles.welcomeText}>{t('welcome')}</Text>
                    <Text style={styles.title}>{t('appName')}</Text>

                    <Text style={styles.subtitle}>{t('discover')}</Text>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={() => router.push('/customer/login')}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#B91C1C', '#EA580C']}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.customerButton}
                            >
                                <ShoppingBag size={20} color="#fff" style={styles.buttonIcon} />
                                <Text style={styles.buttonText}>{t('loginCustomer')}</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.vendorButton}
                            onPress={() => {
                                router.push('/vendor/login');
                            }}
                            activeOpacity={0.7}
                        >
                            <Store size={20} color="#B91C1C" style={styles.buttonIcon} />
                            <Text style={styles.vendorButtonText}>{t('registerSeller')}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Pagination Dots */}
                    <View style={styles.pagination}>
                        <View style={[styles.dot, styles.activeDot]} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                    </View>
                </View>
            </View>
        </View>
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
    backgroundContainer: {
        position: 'absolute',
        top: -100,
        left: -50,
        right: -50,
        bottom: 0,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    bgItem: {
        width: width * 0.4,
        height: width * 0.4,
        margin: 15,
        borderRadius: 20,
        overflow: 'hidden',
    },
    bgImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(69, 10, 10, 0.4)',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    header: {
        position: 'absolute',
        top: 60,
        right: 20,
        zIndex: 10,
    },
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    languageText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 6,
        fontSize: 14,
    },
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 25,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 40,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#B91C1C',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoText: {
        color: '#fff',
        fontSize: 40,
        fontWeight: 'bold',
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#F59E0B',
        marginBottom: 5,
    },
    title: {
        fontSize: 38,
        fontWeight: 'bold',
        color: '#F59E0B',
        marginBottom: 20,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 22,
    },
    buttonContainer: {
        width: '100%',
        gap: 15,
    },
    customerButton: {
        flexDirection: 'row',
        height: 60,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    vendorButton: {
        flexDirection: 'row',
        height: 60,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: '#B91C1C',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    vendorButtonText: {
        color: '#B91C1C',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonIcon: {
        marginRight: 10,
    },
    pagination: {
        flexDirection: 'row',
        marginTop: 40,
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E5E7EB',
    },
    activeDot: {
        backgroundColor: '#B91C1C',
        width: 20,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        width: '80%',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    langOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    langOptionText: {
        fontSize: 16,
        color: '#666',
    },
    activeLangText: {
        color: '#B91C1C',
        fontWeight: 'bold',
    },
    langDivider: {
        width: '100%',
        height: 1,
        backgroundColor: '#EEE',
    },
});
