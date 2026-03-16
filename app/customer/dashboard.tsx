import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator,
    FlatList,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Search,
    Bell,
    Zap,
    Radio,
    ChevronDown,
    Menu,
    Star
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Category } from '@/types';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { LiveSessionCard } from '@/app/customer/_components/LiveSessionCard';
import { ProductCard } from '@/app/customer/_components/ProductCard';
import { DesignerCard } from '@/app/customer/_components/DesignerCard';

const { width } = Dimensions.get('window');

const BANNERS = [
    {
        id: '1',
        title: 'Festival mega sale',
        subtitle: 'Up to 50% Off on Electronics',
        tag: 'SPECIAL OFFER',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop',
        colors: [colors.primary, '#9f1239'] as const,
    },
    {
        id: '2',
        title: 'Live Shopping',
        subtitle: 'Watch vendors live & get exclusive deals',
        tag: 'LIVE SESSIONS',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
        colors: ['#4338CA', '#312E81'] as const,
    },
    {
        id: '3',
        title: 'New Arrivals',
        subtitle: 'Explore the latest fashion trends',
        tag: 'JUST DROPPED',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
        colors: ['#D97706', '#92400E'] as const,
    }
];

const DESIGNERS = [
    { id: '1', name: 'Prabal Gurung', role: 'Luxury Fashion', image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=400&h=600&fit=crop' },
    { id: '2', name: 'Anita Dongre', role: 'Bridal & Ethnic', image: 'https://images.unsplash.com/photo-1550614000-4b95d4ed7dd6?w=400&h=600&fit=crop' },
    { id: '3', name: 'Manish Malhotra', role: 'Celebrity Styling', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop' },
    { id: '4', name: 'Sabyasachi', role: 'Heritage Couture', image: 'https://images.unsplash.com/photo-1611042553365-9b101441c135?w=400&h=600&fit=crop' },
];

export default function CustomerHomeScreen() {
    const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [liveSessions, setLiveSessions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated) {
            router.replace('/');
            return;
        }

        fetchData();
        setLiveSessions([]); // Mocking live sessions array initialization
    }, [isAuthenticated, authLoading]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [prods, cats] = await Promise.all([
                api.getProducts(10),
                api.getCategories()
            ]);
            setProducts(prods);
            setCategories(cats);
        } catch (error: any) {
            if (error?.response?.status === 403 || error?.response?.status === 401) {
                await logout();
                router.replace('/');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderBanner = ({ item }: { item: typeof BANNERS[0] }) => (
        <View style={styles.bannerWrapper}>
            <LinearGradient
                colors={item.colors}
                style={styles.heroBanner}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.heroContent}>
                    <Text style={styles.heroTag}>{item.tag}</Text>
                    <Text style={styles.heroTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.heroSub}>{item.subtitle}</Text>
                    <TouchableOpacity style={styles.heroButton}>
                        <Text style={styles.heroButtonText}>Shop Now</Text>
                    </TouchableOpacity>
                </View>
                <Image source={{ uri: item.image }} style={styles.heroImage} />
            </LinearGradient>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Modern E-commerce Navbar */}
            <View style={styles.navbar}>
                <View style={styles.navTop}>
                    <View style={styles.navLeft}>
                        <TouchableOpacity style={styles.menuButton}>
                            <Menu size={24} color={colors.text} />
                        </TouchableOpacity>
                        <View style={styles.locationContainer}>
                            <Text style={styles.deliverToText}>Deliver to</Text>
                            <View style={styles.locationRow}>
                                <Text style={styles.locationText} numberOfLines={1}>Kathmandu, Nepal</Text>
                                <ChevronDown size={16} color={colors.text} />
                            </View>
                        </View>
                    </View>
                    <View style={styles.navRight}>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Bell size={22} color={colors.text} />
                            <View style={styles.badge} />
                        </TouchableOpacity>
                    </View>
                </View>
                
                {/* Search Bar inside Navbar */}
                <TouchableOpacity 
                    style={styles.searchContainer} 
                    activeOpacity={0.9} 
                    onPress={() => router.push('/customer/search')}
                >
                    <Search size={20} color={colors.textSecondary} />
                    <Text style={styles.searchPlaceholder}>Search for products, brands and more</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                
                {/* Categories Row (Circular) directly below navbar */}
                <View style={styles.categoriesSection}>
                    {isLoading && categories.length === 0 ? (
                         <ActivityIndicator color={colors.primary} style={{ margin: 20 }} />
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={Platform.OS === 'web'} contentContainerStyle={styles.categoryScroll}>
                            {categories.map((cat, index) => (
                                <TouchableOpacity key={cat.id || index} style={styles.circleCategory} onPress={() => router.push(`/customer/search?category=${cat.id}`)}>
                                    <View style={styles.circleImageContainer}>
                                        <Image source={{ uri: cat.image || 'https://via.placeholder.com/100' }} style={styles.circleImage} />
                                    </View>
                                    <Text style={styles.circleCategoryName} numberOfLines={2}>{cat.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>

                {/* Promotional Banners Carousel */}
                <View style={styles.carouselSection}>
                    <FlatList
                        data={BANNERS}
                        renderItem={renderBanner}
                        keyExtractor={item => item.id}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={Platform.OS === 'web'}
                        snapToInterval={width - 32 + 16} // width of item + gap (if any)
                        decelerationRate="fast"
                        contentContainerStyle={{ paddingHorizontal: 16 }}
                        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                    />
                </View>

                {/* Live Deals Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
                                <Radio size={16} color={colors.primary} />
                            </View>
                            <Text style={styles.sectionTitle}>Live Deals</Text>
                        </View>
                        <TouchableOpacity onPress={() => router.push('/customer/live-marketplace')}>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={Platform.OS === 'web'} contentContainerStyle={styles.horizontalScrollPadding}>
                        {isLoading ? (
                            <ActivityIndicator color={colors.primary} />
                        ) : liveSessions.length === 0 ? (
                            <Text style={styles.emptyTextSub}>No active live deals currently.</Text>
                        ) : (
                            liveSessions.map(session => (
                                <LiveSessionCard key={session.id} session={session} />
                            ))
                        )}
                    </ScrollView>
                </View>

                {/* Flash Deals / Sales */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <View style={[styles.iconBox, { backgroundColor: '#FFFBEB' }]}>
                                <Zap size={16} color="#D97706" fill="#D97706" />
                            </View>
                            <Text style={styles.sectionTitle}>Flash Deals</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={Platform.OS === 'web'} contentContainerStyle={styles.horizontalScrollPadding}>
                        {isLoading ? (
                            <ActivityIndicator color={colors.primary} />
                        ) : products.filter(p => p.is_flash_deal || p.original_price).length === 0 ? (
                            <Text style={styles.emptyTextSub}>No flash deals today.</Text>
                        ) : (
                            products.filter(p => p.is_flash_deal || p.original_price).map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        )}
                    </ScrollView>
                </View>

                {/* Top Fashion Designers */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}>
                                <Star size={16} color="#9333EA" fill="#9333EA" />
                            </View>
                            <Text style={styles.sectionTitle}>Fashion Designers</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.viewAllText}>Explore</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={Platform.OS === 'web'} contentContainerStyle={styles.horizontalScrollPadding}>
                        {DESIGNERS.map(designer => (
                            <DesignerCard key={designer.id} designer={designer} />
                        ))}
                    </ScrollView>
                </View>

                {/* Recommended For You */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recommended For You</Text>
                    </View>
                    <View style={styles.productsGrid}>
                        {isLoading ? (
                            <ActivityIndicator color={colors.primary} style={{ alignSelf: 'center', marginTop: 20 }} />
                        ) : (
                            products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        )}
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
        backgroundColor: '#F9FAFB',
    },
    navbar: {
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
        zIndex: 10,
    },
    navTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    navLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuButton: {
        marginRight: 12,
    },
    locationContainer: {
        justifyContent: 'center',
    },
    deliverToText: {
        fontSize: 11,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.text,
        maxWidth: 150,
    },
    navRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn: {
        padding: 4,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
        borderWidth: 1,
        borderColor: colors.white,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
    },
    searchPlaceholder: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: colors.textSecondary,
    },
    content: {
        flex: 1,
    },
    categoriesSection: {
        backgroundColor: colors.white,
        paddingVertical: 16,
        marginBottom: 16,
    },
    categoryScroll: {
        paddingHorizontal: 12,
    },
    circleCategory: {
        alignItems: 'center',
        width: 72,
        marginHorizontal: 4,
    },
    circleImageContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
    },
    circleImage: {
        width: '100%',
        height: '100%',
    },
    circleCategoryName: {
        fontSize: 11,
        color: colors.text,
        textAlign: 'center',
        fontWeight: '500',
    },
    carouselSection: {
        marginBottom: 24,
    },
    bannerWrapper: {
        width: width - 32, // Screen width minus padding
    },
    heroBanner: {
        width: '100%',
        height: 160,
        borderRadius: 16,
        flexDirection: 'row',
        overflow: 'hidden',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
    },
    heroContent: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    heroTag: {
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.9)',
        letterSpacing: 1,
        marginBottom: 6,
    },
    heroTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.white,
        marginBottom: 4,
    },
    heroSub: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 16,
    },
    heroButton: {
        backgroundColor: colors.white,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    heroButtonText: {
        color: colors.text,
        fontSize: 12,
        fontWeight: '700',
    },
    heroImage: {
        width: 140, // Fixed width for image to avoid squishing
        height: '100%',
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 14,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconBox: {
        width: 28,
        height: 28,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.text,
    },
    viewAllText: {
        fontSize: 13,
        color: colors.primary,
        fontWeight: '600',
    },
    horizontalScrollPadding: {
        paddingHorizontal: 16,
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
        justifyContent: 'space-between',
    },
    emptyTextSub: {
        fontSize: 14,
        color: colors.textSecondary,
        marginLeft: 16,
        fontStyle: 'italic',
    },
    bottomPadding: {
        height: 80,
    },
});
