import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
    User,
    Store,
    MapPin,
    Phone,
    Bell,
    Settings,
    LogOut,
    ChevronRight,
    Camera,
    ArrowLeft,
    Tag,
    Palette,
    Layers,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/colors';
import { products } from '@/mocks/data';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const demoProducts = products.slice(0, 3).map(p => ({
    ...p,
    colors: ['Deep Red', 'Golden', 'Ivory'],
    material: 'Authentic Nepali Silk / Brass',
    features: ['Hand-carved', 'Eco-friendly dyes', 'Lifetime warranty']
}));

export default function VendorProfileScreen() {
    const { user, logout } = useAuth();
    const { t } = useLanguage();

    const handleLogout = async () => {
        await logout();
        router.replace('/');
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            console.log('Image picked:', result.assets[0].uri);
            Alert.alert('Success', 'Profile photo updated!');
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t('profile')}</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        {user?.avatar ? (
                            <Image source={{ uri: user.avatar }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Store size={40} color={colors.white} />
                            </View>
                        )}
                        <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                            <Camera size={16} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.userName}>{user?.businessName || user?.name || 'Store Name'}</Text>
                        <Text style={styles.userEmail}>{user?.email || 'vendor@example.com'}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Business Details</Text>
                    <View style={styles.detailRow}>
                        <Store size={20} color={colors.primary} />
                        <View style={styles.detailTextContainer}>
                            <Text style={styles.detailLabel}>{t('enterpriseName')}</Text>
                            <Text style={styles.detailValue}>{user?.businessName || 'N/A'}</Text>
                        </View>
                    </View>
                    <View style={styles.detailRow}>
                        <User size={20} color={colors.primary} />
                        <View style={styles.detailTextContainer}>
                            <Text style={styles.detailLabel}>{t('fullName')}</Text>
                            <Text style={styles.detailValue}>{user?.name || 'N/A'}</Text>
                        </View>
                    </View>
                    <View style={styles.detailRow}>
                        <MapPin size={20} color={colors.primary} />
                        <View style={styles.detailTextContainer}>
                            <Text style={styles.detailLabel}>{t('address')}</Text>
                            <Text style={styles.detailValue}>{user?.address || 'N/A'}</Text>
                        </View>
                    </View>
                    <View style={styles.detailRow}>
                        <Phone size={20} color={colors.primary} />
                        <View style={styles.detailTextContainer}>
                            <Text style={styles.detailLabel}>{t('phone')}</Text>
                            <Text style={styles.detailValue}>{user?.phone || 'N/A'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>My Product Showcase</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.showcaseScroll}>
                        {demoProducts.map((product, index) => (
                            <View key={index} style={styles.showcaseCard}>
                                <Image source={{ uri: product.images[0] }} style={styles.showcaseImage} />
                                <View style={styles.showcaseDetails}>
                                    <Text style={styles.showcaseName}>{product.name}</Text>
                                    <Text style={styles.showcasePrice}>रू{product.price.toLocaleString()}</Text>

                                    <View style={styles.featureRow}>
                                        <Palette size={14} color={colors.textSecondary} />
                                        <Text style={styles.featureLabel}>Colors: {product.colors.join(', ')}</Text>
                                    </View>

                                    <View style={styles.featureRow}>
                                        <Layers size={14} color={colors.textSecondary} />
                                        <Text style={styles.featureLabel}>Material: {product.material}</Text>
                                    </View>

                                    <View style={styles.featuresList}>
                                        {product.features.map((f, i) => (
                                            <View key={i} style={styles.featureBadge}>
                                                <Tag size={10} color={colors.primary} />
                                                <Text style={styles.featureBadgeText}>{f}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.menuSection}>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <View style={styles.menuIconContainer}>
                                <Bell size={20} color={colors.primary} />
                            </View>
                            <Text style={styles.menuItemLabel}>Store Notifications</Text>
                        </View>
                        <ChevronRight size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <View style={styles.menuIconContainer}>
                                <Settings size={20} color={colors.primary} />
                            </View>
                            <Text style={styles.menuItemLabel}>Store Settings</Text>
                        </View>
                        <ChevronRight size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <LogOut size={20} color={colors.error} />
                    <Text style={styles.logoutText}>{t('logout')}</Text>
                </TouchableOpacity>

                <Text style={styles.version}>Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700' as const,
        color: colors.text,
    },
    content: {
        flex: 1,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        margin: 16,
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    avatarContainer: {
        marginRight: 16,
        position: 'relative',
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    avatarPlaceholder: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.white,
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: '600' as const,
        color: colors.text,
    },
    userEmail: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
    },
    section: {
        backgroundColor: colors.white,
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: colors.text,
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    detailTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    detailValue: {
        fontSize: 15,
        color: colors.text,
        fontWeight: '500' as const,
    },
    menuSection: {
        backgroundColor: colors.white,
        marginHorizontal: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: colors.cherryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuItemLabel: {
        fontSize: 15,
        fontWeight: '500' as const,
        color: colors.text,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        margin: 16,
        padding: 16,
        borderRadius: 16,
        gap: 8,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: colors.error,
    },
    version: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
    },
    showcaseScroll: {
        marginHorizontal: -5,
    },
    showcaseCard: {
        width: 280,
        backgroundColor: colors.white,
        borderRadius: 16,
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: colors.borderLight,
        overflow: 'hidden',
    },
    showcaseImage: {
        width: '100%',
        height: 160,
    },
    showcaseDetails: {
        padding: 12,
    },
    showcaseName: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: colors.text,
        marginBottom: 4,
    },
    showcasePrice: {
        fontSize: 15,
        fontWeight: '600' as const,
        color: colors.primary,
        marginBottom: 10,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    featureLabel: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    featuresList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 8,
    },
    featureBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.cherryLight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    featureBadgeText: {
        fontSize: 10,
        color: colors.primary,
        fontWeight: '600' as const,
    },
});
