import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Animated,
    TextInput,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Search,
    Plus,
    Bell,
    MessageSquare,
    Calendar,
    TrendingUp,
    TrendingDown,
    Users,
    IndianRupee,
    Package,
    ShoppingCart,
    MoreVertical,
    Star,
    Clock,
    Radio,
    Eye,
    ChevronRight,
    LogOut,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { api } from '@/lib/api';
import { dashboardStats as mockStats, salesData as mockSales, liveChat as mockChat } from '@/mocks/data';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { LiveSessionPanel } from '@/app/vendor/_components/LiveSessionPanel';
import { StatCard } from '@/app/vendor/_components/StatCard';
import { SalesChart } from '@/app/vendor/_components/SalesChart';
import { OrderItem } from '@/app/vendor/_components/OrderItem';
import { TopProductItem } from '@/app/vendor/_components/TopProductItem';

const { width } = Dimensions.get('window');

// Refactored to use extracted components

export default function VendorDashboardScreen() {
    const { t } = useLanguage();
    const { logout, user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [stats, setStats] = useState<any>(null);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [dashboardMessage, setDashboardMessage] = useState<string>('');

    useEffect(() => {
        if (authLoading) return; // Wait until authentication check is finished

        if (!isAuthenticated) {
            router.replace('/');
            return;
        }
        if (user) {
            fetchDashboardData();
        }
    }, [user, isAuthenticated, authLoading]);

    const fetchDashboardData = async () => {
        if (!user?.id) return;
        try {
            setIsLoading(true);

            // 1. Fetch real orders from Firestore
            const orders = await api.getVendorOrders(user.id);
            setRecentOrders(orders || []);

            // 2. Fetch real products from Firestore
            const products = await api.getProductsByVendor(user.id);
            setTopProducts(products || []);

            // 3. Calculate real stats
            setStats({
                todayRevenue: orders ? orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0) : 0,
                totalOrders: orders ? orders.length : 0,
                activeProducts: products ? products.length : 0,
            });

            // 4. Vendor dashboard msg
            const dashRes = await api.getVendorDashboard();
            if (dashRes?.message) setDashboardMessage(dashRes.message);

        } catch (error: any) {
            console.error('Dashboard fetch error:', error);
            if (error?.response?.status === 403 || error?.response?.status === 401) {
                await logout();
                router.replace('/');
            }
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchDashboardData();
    };

    const handleLogout = async () => {
        await logout();
        router.replace('/');
    };

    // Dummy currentVendor for profile avatar
    const currentVendor = {
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cfdfeeab?w=100',
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.brandContainer}>
                        <View style={styles.brandLogo}>
                            <Text style={styles.brandLogoText}>B</Text>
                        </View>
                        <Text style={styles.brandName}>Bechbikhan</Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <View style={styles.searchBox}>
                        <Search size={18} color={colors.textSecondary} />
                        <Text style={styles.searchPlaceholder}>Search products, orders...</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => router.push('/vendor/products')}
                    >
                        <Plus size={18} color={colors.white} />
                        <Text style={styles.addButtonText}>Add Product</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <MessageSquare size={20} color={colors.text} />
                        <View style={styles.badge}><Text style={styles.badgeText}>5</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Bell size={20} color={colors.text} />
                        <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.profileButton}
                        onPress={() => router.push('/vendor/profile')}
                    >
                        <Image source={{ uri: currentVendor.avatar }} style={styles.profileAvatar} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.iconButton, { marginLeft: 8 }]}
                        onPress={handleLogout}
                    >
                        <LogOut size={20} color={colors.error} />
                    </TouchableOpacity>
                </View>
            </View>

            {dashboardMessage ? (
                <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary }}>{dashboardMessage}</Text>
                </View>
            ) : null}

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.mainContent}>
                    <View style={styles.vendorHero}>
                        <LinearGradient
                            colors={[colors.secondary, '#c2410c']}
                            style={styles.heroGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View style={styles.heroTextContent}>
                                <Text style={styles.heroTag}>SELL MORE</Text>
                                <Text style={styles.heroTitle}>Grow Your Inventory</Text>
                                <Text style={styles.heroSubtitle}>Upload new items to increase sales today.</Text>
                            </View>
                            <TouchableOpacity style={styles.heroFab} onPress={() => router.push('/vendor/products')}>
                                <Plus size={24} color={colors.secondary} />
                                <Text style={styles.heroFabText}>Add Product</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>

                    <View style={styles.leftColumn}>

                        <View style={styles.modernStatsRow}>
                            <View style={styles.modernStatCard}>
                                <View style={[styles.modernStatIcon, { backgroundColor: '#FEE2E2' }]}>
                                    <IndianRupee size={20} color={colors.primary} />
                                </View>
                                <View>
                                    <Text style={styles.modernStatLabel}>Today's Revenue</Text>
                                    <Text style={styles.modernStatValue}>रू {stats?.todayRevenue?.toLocaleString() || '0'}</Text>
                                </View>
                                <TrendingUp size={16} color="#10B981" style={styles.modernStatTrend} />
                            </View>

                            <View style={styles.modernStatCard}>
                                <View style={[styles.modernStatIcon, { backgroundColor: '#E0E7FF' }]}>
                                    <Package size={20} color="#4338CA" />
                                </View>
                                <View>
                                    <Text style={styles.modernStatLabel}>Total Orders</Text>
                                    <Text style={styles.modernStatValue}>{stats?.totalOrders || '0'}</Text>
                                </View>
                            </View>

                            <View style={styles.modernStatCard}>
                                <View style={[styles.modernStatIcon, { backgroundColor: '#FEF3C7' }]}>
                                    <ShoppingCart size={20} color="#D97706" />
                                </View>
                                <View>
                                    <Text style={styles.modernStatLabel}>Active Products</Text>
                                    <Text style={styles.modernStatValue}>{stats?.activeProducts || '0'}</Text>
                                </View>
                            </View>
                        </View>

                        <SalesChart />

                        <View style={styles.ordersSection}>
                            <View style={styles.sectionHeader}>
                                <View>
                                    <Text style={styles.sectionTitle}>{t('recentOrders')}</Text>
                                    <Text style={styles.sectionSubtitle}>{t('latestOrders')}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.viewAllButton}
                                    onPress={() => router.push('/vendor/orders')}
                                >
                                    <Text style={styles.viewAllText}>{t('viewAll')}</Text>
                                </TouchableOpacity>
                            </View>
                            {isLoading ? (
                                <ActivityIndicator color={colors.primary} />
                            ) : recentOrders.length === 0 ? (
                                <Text style={styles.emptyText}>No recent orders</Text>
                            ) : (
                                recentOrders.map(order => (
                                    <OrderItem key={order.id} order={order} />
                                ))
                            )}
                        </View>
                    </View>

                    <View style={styles.rightColumn}>
                        <LiveSessionPanel vendorId={user?.id || ''} />

                        <View style={styles.topProductsSection}>
                            <View style={styles.sectionHeader}>
                                <View>
                                    <Text style={styles.sectionTitle}>{t('topProducts')}</Text>
                                    <Text style={styles.sectionSubtitle}>{t('bestPerforming')}</Text>
                                </View>
                                <TouchableOpacity style={styles.trendButton}>
                                    <TrendingUp size={16} color={colors.primary} />
                                </TouchableOpacity>
                            </View>
                            {isLoading ? (
                                <ActivityIndicator color={colors.primary} />
                            ) : topProducts.length === 0 ? (
                                <Text style={styles.emptyText}>No products listed</Text>
                            ) : (
                                topProducts.map((product, index) => (
                                    <TopProductItem key={product.id} product={product} rank={index + 1} />
                                ))
                            )}
                        </View>
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
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    brandContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    brandLogo: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    brandLogoText: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: colors.white,
    },
    brandName: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: colors.primary,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.borderLight,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 8,
        minWidth: 160,
    },
    searchPlaceholder: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 6,
    },
    addButtonText: {
        fontSize: 13,
        fontWeight: '600' as const,
        color: colors.white,
    },
    iconButton: {
        position: 'relative',
        padding: 8,
    },
    badge: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: colors.primary,
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700' as const,
        color: colors.white,
    },
    profileButton: {
        marginLeft: 4,
    },
    profileAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    content: {
        flex: 1,
    },
    welcomeSection: {
        padding: 16,
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: '700' as const,
        color: colors.text,
    },
    welcomeSubtext: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
    },
    festivalBanner: {
        marginHorizontal: 16,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
    },
    festivalGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    festivalIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    festivalInfo: {
        flex: 1,
        marginLeft: 12,
    },
    festivalTitle: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.text,
    },
    festivalText: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    prepareButton: {
        backgroundColor: colors.secondary,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    prepareButtonText: {
        fontSize: 12,
        fontWeight: '600' as const,
        color: colors.white,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
        gap: 8,
    },
    statCard: {
        flex: 1,
        minWidth: (width - 40) / 2,
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 14,
        margin: 4,
    },
    statCardHighlight: {
        flex: 1,
        minWidth: (width - 40) / 2,
        borderRadius: 12,
        padding: 14,
        margin: 4,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    statTitle: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    statTitleLight: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    statIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: colors.cherryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statIconContainerLight: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 22,
        fontWeight: '700' as const,
        color: colors.text,
        marginBottom: 4,
    },
    statValueLight: {
        fontSize: 22,
        fontWeight: '700' as const,
        color: colors.white,
        marginBottom: 4,
    },
    statChangeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statChange: {
        fontSize: 11,
    },
    statChangeLight: {
        fontSize: 11,
    },
    vendorHero: {
        marginBottom: 20,
    },
    heroGradient: {
        borderRadius: 20,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: colors.secondary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 8,
    },
    heroTextContent: {
        flex: 1,
        paddingRight: 16,
    },
    heroTag: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: 8,
    },
    heroTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    heroSubtitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
        lineHeight: 18,
    },
    heroFab: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 30,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    heroFabText: {
        color: colors.secondary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    modernStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginBottom: 24,
        gap: 12,
    },
    modernStatCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        minWidth: '47%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    modernStatIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    modernStatLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    modernStatValue: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
    },
    modernStatTrend: {
        position: 'absolute',
        top: 16,
        right: 16,
    },
    mainContent: {
        padding: 16,
    },
    leftColumn: {
        marginBottom: 16,
    },
    rightColumn: {},
    chartContainer: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: colors.text,
    },
    chartSubtitle: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    chartTabs: {
        flexDirection: 'row',
        backgroundColor: colors.borderLight,
        borderRadius: 8,
        padding: 2,
    },
    chartTab: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    chartTabActive: {
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    chartTabText: {
        fontSize: 11,
        color: colors.textSecondary,
    },
    chartTabTextActive: {
        fontSize: 11,
        color: colors.text,
        fontWeight: '500' as const,
    },
    chartArea: {
        flexDirection: 'row',
        height: 180,
    },
    chartYAxis: {
        width: 40,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingRight: 8,
    },
    chartYLabel: {
        fontSize: 10,
        color: colors.textSecondary,
    },
    chartBars: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
    },
    chartBarContainer: {
        alignItems: 'center',
        flex: 1,
    },
    chartBarWrapper: {
        height: '100%',
        width: 24,
        justifyContent: 'flex-end',
    },
    chartBar: {
        width: '100%',
        backgroundColor: colors.cherryLight,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderWidth: 2,
        borderColor: colors.primary,
        borderBottomWidth: 0,
    },
    chartXLabel: {
        fontSize: 10,
        color: colors.textSecondary,
        marginTop: 8,
    },
    ordersSection: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: colors.text,
    },
    sectionSubtitle: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    viewAllButton: {
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    viewAllText: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '500' as const,
    },
    orderItem: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    orderImage: {
        width: 48,
        height: 48,
        borderRadius: 8,
    },
    orderInfo: {
        flex: 1,
        marginLeft: 12,
    },
    orderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    orderId: {
        fontSize: 13,
        fontWeight: '600' as const,
        color: colors.text,
    },
    orderStatus: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    orderStatusText: {
        fontSize: 10,
        fontWeight: '600' as const,
    },
    orderProducts: {
        fontSize: 12,
        color: colors.text,
        marginBottom: 2,
    },
    livePanelEmpty: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.borderLight,
        borderStyle: 'dashed',
    },
    livePanelEmptyText: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    messagesList: {
        maxHeight: 150,
        marginBottom: 12,
    },
    noChatText: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 10,
    },
    chatInputRow: {
        flexDirection: 'row',
        gap: 8,
    },
    chatInput: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 13,
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    sendButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        justifyContent: 'center',
        borderRadius: 8,
    },
    sendButtonText: {
        color: colors.white,
        fontSize: 13,
        fontWeight: '600' as const,
    },
    emptyText: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        paddingVertical: 20,
    },
    orderCustomer: {
        fontSize: 11,
        color: colors.textSecondary,
    },
    orderRight: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    orderAmount: {
        fontSize: 14,
        fontWeight: '700' as const,
        color: colors.text,
    },
    orderItems: {
        fontSize: 11,
        color: colors.textSecondary,
    },
    livePanel: {
        backgroundColor: colors.white,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
    },
    livePanelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.primary,
        padding: 12,
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#86EFAC',
    },
    liveText: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.white,
    },
    liveStats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    liveStatText: {
        fontSize: 12,
        color: colors.white,
        marginLeft: 4,
    },
    liveContent: {
        padding: 12,
    },
    liveProductCard: {
        flexDirection: 'row',
        backgroundColor: colors.borderLight,
        borderRadius: 10,
        padding: 10,
        marginBottom: 12,
    },
    liveBadge: {
        position: 'absolute',
        top: 14,
        left: 14,
        backgroundColor: colors.primary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        zIndex: 1,
    },
    liveBadgeText: {
        fontSize: 8,
        fontWeight: '700' as const,
        color: colors.white,
    },
    liveProductImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    liveProductInfo: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    liveProductTitle: {
        fontSize: 13,
        fontWeight: '500' as const,
        color: colors.text,
    },
    liveProductMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    liveProductMetaText: {
        fontSize: 11,
        color: colors.textSecondary,
        marginLeft: 4,
    },
    liveButtons: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    manageButton: {
        flex: 1,
        backgroundColor: colors.secondary,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    manageButtonText: {
        fontSize: 13,
        fontWeight: '600' as const,
        color: colors.white,
    },
    endButton: {
        backgroundColor: colors.white,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.error,
    },
    endButtonText: {
        fontSize: 13,
        fontWeight: '600' as const,
        color: colors.error,
    },
    chatSection: {
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
        paddingTop: 12,
    },
    chatTitle: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    chatMessage: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    chatUser: {
        fontSize: 12,
        fontWeight: '600' as const,
        color: colors.primary,
        marginRight: 4,
    },
    chatText: {
        fontSize: 12,
        color: colors.text,
        flex: 1,
    },
    topProductsSection: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
    },
    trendButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: colors.cherryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topProductItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    rankBadge: {
        width: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    rankText: {
        fontSize: 11,
        fontWeight: '700' as const,
        color: colors.white,
    },
    topProductImage: {
        width: 44,
        height: 44,
        borderRadius: 8,
    },
    topProductInfo: {
        flex: 1,
        marginLeft: 10,
    },
    topProductName: {
        fontSize: 13,
        fontWeight: '500' as const,
        color: colors.text,
    },
    topProductMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    topProductRating: {
        fontSize: 11,
        fontWeight: '600' as const,
        color: colors.text,
        marginLeft: 4,
    },
    topProductReviews: {
        fontSize: 11,
        color: colors.textSecondary,
        marginLeft: 4,
    },
    progressBar: {
        height: 4,
        backgroundColor: colors.borderLight,
        borderRadius: 2,
        marginTop: 6,
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 2,
    },
    topProductPrice: {
        fontSize: 13,
        fontWeight: '700' as const,
        color: colors.text,
    },
    bottomPadding: {
        height: 20,
    },
    liveSessionCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    liveGradient: {
        padding: 16,
    },
    liveHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    liveStatusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    liveStatusBadgeText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: '900' as const,
    },
    viewerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    viewerText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: '600' as const,
    },
    liveTitle: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: colors.white,
        marginBottom: 16,
    },
    joinButton: {
        backgroundColor: colors.white,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    joinButtonText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '700' as const,
    },
});
