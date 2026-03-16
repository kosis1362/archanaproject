import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
    User,
    Package,
    MapPin,
    CreditCard,
    Bell,
    HelpCircle,
    Settings,
    LogOut,
    ChevronRight,
    Globe,
    Camera,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const menuItems = [
    { icon: Package, label: 'My Orders', route: '/orders' },
    { icon: MapPin, label: 'Delivery Addresses', route: '/addresses' },
    { icon: CreditCard, label: 'Payment Methods', route: '/payments' },
    { icon: Bell, label: 'Notifications', route: '/notifications' },
    { icon: HelpCircle, label: 'Help & Support', route: '/help' },
    { icon: Settings, label: 'Settings', route: '/settings' },
];

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const { language, setLanguage, t } = useLanguage();

    const handleLogout = async () => {
        await logout();
        router.replace('/');
    };

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ne' : 'en');
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            // In a real app, you would upload this to Supabase storage
            // For now, we'll just demonstrate it works
            console.log('Image picked:', result.assets[0].uri);
            alert('Photo selected! (Upload logic would go here)');
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
                                <User size={40} color={colors.white} />
                            </View>
                        )}
                        <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                            <Camera size={16} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
                        <Text style={styles.userEmail}>{user?.email || 'guest@example.com'}</Text>
                    </View>
                    <TouchableOpacity style={styles.editButton}>
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.languageToggle} onPress={toggleLanguage}>
                    <View style={styles.menuItemLeft}>
                        <View style={[styles.menuIconContainer, { backgroundColor: colors.cherryLight }]}>
                            <Globe size={20} color={colors.primary} />
                        </View>
                        <Text style={styles.menuItemLabel}>Language</Text>
                    </View>
                    <View style={styles.languageBadge}>
                        <Text style={styles.languageText}>{language === 'en' ? 'English' : 'नेपाली'}</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.menuSection}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem}>
                            <View style={styles.menuItemLeft}>
                                <View style={styles.menuIconContainer}>
                                    <item.icon size={20} color={colors.primary} />
                                </View>
                                <Text style={styles.menuItemLabel}>{item.label}</Text>
                            </View>
                            <ChevronRight size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    ))}
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
        padding: 16,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
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
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    avatarPlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
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
    editButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: colors.cherryLight,
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: colors.primary,
    },
    languageToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 16,
    },
    languageBadge: {
        backgroundColor: colors.cherryLight,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    languageText: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: colors.primary,
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
});
