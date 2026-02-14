import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    Dimensions,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Search,
    Bell,
    MapPin,
    Zap,
    Radio,
    ChevronRight,
    Star,
    Heart,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { products, categories, liveSessions } from '@/mocks/data';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product } from '@/types';

const { width } = Dimensions.get('window');

function LiveSessionCard({ session }: { session: typeof liveSessions[0] }) {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <TouchableOpacity style={styles.liveCard} activeOpacity={0.9}>
            <Image source={{ uri: session.thumbnail }} style={styles.liveThumbnail} />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.liveGradient}
            />
            <View style={styles.liveBadge}>
                <Animated.View style={[styles.liveDot, { transform: [{ scale: pulseAnim }] }]} />
                <Text style={styles.liveText}>LIVE</Text>
            </View>
            <View style={styles.liveViewers}>
                <Text style={styles.viewerCount}>{session.viewerCount} watching</Text>
            </View>
            <View style={styles.liveInfo}>
                <Image source={{ uri: session.vendorAvatar }} style={styles.vendorAvatar} />
                <View style={styles.liveDetails}>
                    <Text style={styles.liveTitle} numberOfLines={1}>{session.title}</Text>
                    <Text style={styles.vendorName}>{session.vendorName}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

function ProductCard({ product }: { product: Product }) {
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <TouchableOpacity
            style={styles.productCard}
            activeOpacity={0.9}
            onPress={() => router.push(`/product/${product.id}`)}
        >
            <View style={styles.productImageContainer}>
                <Image source={{ uri: product.images[0] }} style={styles.productImage} />
                <TouchableOpacity style={styles.wishlistButton}>
                    <Heart size={18} color={colors.textSecondary} />
                </TouchableOpacity>
                {discount > 0 && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{discount}% OFF</Text>
                    </View>
                )}
                {product.isFlashDeal && (
                    <View style={styles.flashBadge}>
                        <Zap size={12} color={colors.white} fill={colors.white} />
                    </View>
                )}
            </View>
            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                <View style={styles.ratingRow}>
                    <Star size={12} color={colors.secondary} fill={colors.secondary} />
                    <Text style={styles.rating}>{product.rating}</Text>
                    <Text style={styles.reviews}>({product.totalReviews})</Text>
                </View>
                <View style={styles.priceRow}>
                    <Text style={styles.price}>रू{product.price.toLocaleString()}</Text>
                    {product.originalPrice && (
                        <Text style={styles.originalPrice}>रू{product.originalPrice.toLocaleString()}</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

function CategoryCard({ category }: { category: typeof categories[0] }) {
    return (
        <TouchableOpacity style={styles.categoryCard} activeOpacity={0.8}>
            <View style={styles.categoryImageContainer}>
                <Image source={{ uri: category.image }} style={styles.categoryImage} />
            </View>
            <Text style={styles.categoryName} numberOfLines={1}>{category.name}</Text>
        </TouchableOpacity>
    );
}

export default function CustomerHomeScreen() {
    const { t } = useLanguage();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View style={styles.locationRow}>
                    <MapPin size={18} color={colors.primary} />
                    <Text style={styles.locationText}>Kathmandu, Nepal</Text>
                    <ChevronRight size={16} color={colors.textSecondary} />
                </View>
                <TouchableOpacity style={styles.notificationButton}>
                    <Bell size={22} color={colors.text} />
                    <View style={styles.notificationDot} />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <Search size={20} color={colors.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search products, vendors..."
                        placeholderTextColor={colors.textSecondary}
                    />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <Radio size={20} color={colors.primary} />
                            <Text style={styles.sectionTitle}>{t('liveNow')}</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.viewAllText}>{t('viewAll')}</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.liveScroll}>
                        {liveSessions.map(session => (
                            <LiveSessionCard key={session.id} session={session} />
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{t('categories')}</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAllText}>{t('viewAll')}</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {categories.map(category => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <Zap size={20} color={colors.secondary} fill={colors.secondary} />
                            <Text style={styles.sectionTitle}>{t('flashDeals')}</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.viewAllText}>{t('viewAll')}</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {products.filter(p => p.isFlashDeal || p.originalPrice).map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{t('forYou')}</Text>
                    </View>
                    <View style={styles.productsGrid}>
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </View>
                </View>

                <View style={styles.bottomPadding} />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationText: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: colors.text,
    },
    notificationButton: {
        position: 'relative',
        padding: 8,
    },
    notificationDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
    },
    searchContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 48,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: colors.text,
        marginLeft: 12,
    },
    content: {
        flex: 1,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: colors.text,
    },
    viewAllText: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '500' as const,
    },
    liveScroll: {
        paddingLeft: 16,
    },
    liveCard: {
        width: width * 0.7,
        height: 180,
        borderRadius: 16,
        overflow: 'hidden',
        marginRight: 12,
        backgroundColor: colors.black,
    },
    liveThumbnail: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    liveGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    liveBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        gap: 4,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.white,
    },
    liveText: {
        fontSize: 10,
        fontWeight: '700' as const,
        color: colors.white,
    },
    liveViewers: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    viewerCount: {
        fontSize: 11,
        color: colors.white,
        fontWeight: '500' as const,
    },
    liveInfo: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    vendorAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: colors.white,
    },
    liveDetails: {
        marginLeft: 10,
        flex: 1,
    },
    liveTitle: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.white,
    },
    vendorName: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    categoryCard: {
        alignItems: 'center',
        marginLeft: 16,
        width: 72,
    },
    categoryImageContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.white,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    categoryImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    categoryName: {
        fontSize: 12,
        color: colors.text,
        marginTop: 8,
        textAlign: 'center',
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
    },
    productCard: {
        width: (width - 48) / 2,
        backgroundColor: colors.white,
        borderRadius: 16,
        marginHorizontal: 4,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    productImageContainer: {
        position: 'relative',
        height: 140,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    wishlistButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    discountBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: colors.primary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    discountText: {
        fontSize: 10,
        fontWeight: '700' as const,
        color: colors.white,
    },
    flashBadge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: colors.secondary,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productInfo: {
        padding: 12,
    },
    productName: {
        fontSize: 13,
        fontWeight: '500' as const,
        color: colors.text,
        height: 36,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 4,
    },
    rating: {
        fontSize: 12,
        fontWeight: '600' as const,
        color: colors.text,
    },
    reviews: {
        fontSize: 11,
        color: colors.textSecondary,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        gap: 6,
    },
    price: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: colors.primary,
    },
    originalPrice: {
        fontSize: 12,
        color: colors.textSecondary,
        textDecorationLine: 'line-through',
    },
    bottomPadding: {
        height: 20,
    },
});
