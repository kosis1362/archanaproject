import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { dashboardStats, salesData, recentOrders, products, liveChat, currentVendor } from '@/mocks/data';
import { useLanguage } from '@/contexts/LanguageContext';

const { width } = Dimensions.get('window');

function StatCard({ title, value, change, icon: Icon, isHighlight }: {
    title: string;
    value: string;
    change: number;
    icon: any;
    isHighlight?: boolean;
}) {
    const isPositive = change >= 0;

    if (isHighlight) {
        return (
            <LinearGradient
                colors={['#B91C1C', '#DC2626']}
                style={styles.statCardHighlight}
            >
                <View style={styles.statHeader}>
                    <Text style={styles.statTitleLight}>{title}</Text>
                    <View style={styles.statIconContainerLight}>
                        <Icon size={18} color={colors.white} />
                    </View>
                </View>
                <Text style={styles.statValueLight}>{value}</Text>
                <View style={styles.statChangeRow}>
                    {isPositive ? (
                        <TrendingUp size={14} color="#86EFAC" />
                    ) : (
                        <TrendingDown size={14} color="#FCA5A5" />
                    )}
                    <Text style={[styles.statChangeLight, { color: isPositive ? '#86EFAC' : '#FCA5A5' }]}>
                        {isPositive ? '+' : ''}{change}% vs last week
                    </Text>
                </View>
            </LinearGradient>
        );
    }

    return (
        <View style={styles.statCard}>
            <View style={styles.statHeader}>
                <Text style={styles.statTitle}>{title}</Text>
                <View style={styles.statIconContainer}>
                    <Icon size={18} color={colors.primary} />
                </View>
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <View style={styles.statChangeRow}>
                {isPositive ? (
                    <TrendingUp size={14} color={colors.success} />
                ) : (
                    <TrendingDown size={14} color={colors.error} />
                )}
                <Text style={[styles.statChange, { color: isPositive ? colors.success : colors.error }]}>
                    {isPositive ? '+' : ''}{change}% vs last week
                </Text>
            </View>
        </View>
    );
}

function SalesChart() {
    const maxAmount = Math.max(...salesData.map(d => d.amount));

    return (
        <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
                <View>
                    <Text style={styles.chartTitle}>Sales Overview</Text>
                    <Text style={styles.chartSubtitle}>Revenue performance</Text>
                </View>
                <View style={styles.chartTabs}>
                    <TouchableOpacity style={styles.chartTab}>
                        <Text style={styles.chartTabText}>Today</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.chartTab, styles.chartTabActive]}>
                        <Text style={styles.chartTabTextActive}>Week</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.chartTab}>
                        <Text style={styles.chartTabText}>Month</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.chartTab}>
                        <Text style={styles.chartTabText}>Year</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.chartArea}>
                <View style={styles.chartYAxis}>
                    <Text style={styles.chartYLabel}>रू60k</Text>
                    <Text style={styles.chartYLabel}>रू45k</Text>
                    <Text style={styles.chartYLabel}>रू30k</Text>
                    <Text style={styles.chartYLabel}>रू15k</Text>
                    <Text style={styles.chartYLabel}>रू0k</Text>
                </View>
                <View style={styles.chartBars}>
                    {salesData.map((data, index) => (
                        <View key={index} style={styles.chartBarContainer}>
                            <View style={styles.chartBarWrapper}>
                                <View
                                    style={[
                                        styles.chartBar,
                                        { height: `${(data.amount / maxAmount) * 100}%` },
                                    ]}
                                />
                            </View>
                            <Text style={styles.chartXLabel}>{data.day}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

function LiveSessionPanel() {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.3, duration: 800, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.livePanel}>
            <View style={styles.livePanelHeader}>
                <View style={styles.liveIndicator}>
                    <Animated.View style={[styles.liveDot, { transform: [{ scale: pulseAnim }] }]} />
                    <Text style={styles.liveText}>You're Live!</Text>
                </View>
                <View style={styles.liveStats}>
                    <Eye size={14} color={colors.white} />
                    <Text style={styles.liveStatText}>234 watching</Text>
                    <Clock size={14} color={colors.white} style={{ marginLeft: 12 }} />
                    <Text style={styles.liveStatText}>45:23</Text>
                </View>
            </View>

            <View style={styles.liveContent}>
                <View style={styles.liveProductCard}>
                    <View style={styles.liveBadge}>
                        <Text style={styles.liveBadgeText}>LIVE</Text>
                    </View>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100' }}
                        style={styles.liveProductImage}
                    />
                    <View style={styles.liveProductInfo}>
                        <Text style={styles.liveProductTitle} numberOfLines={1}>
                            New Arrivals - Handcrafted Jewelry Collection
                        </Text>
                        <View style={styles.liveProductMeta}>
                            <Users size={12} color={colors.textSecondary} />
                            <Text style={styles.liveProductMetaText}>234</Text>
                            <MessageSquare size={12} color={colors.textSecondary} style={{ marginLeft: 8 }} />
                            <Text style={styles.liveProductMetaText}>3</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.liveButtons}>
                    <TouchableOpacity style={styles.manageButton}>
                        <Text style={styles.manageButtonText}>Manage Session</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.endButton}>
                        <Text style={styles.endButtonText}>End Live</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.chatSection}>
                    <Text style={styles.chatTitle}>Recent chat</Text>
                    {liveChat.map(message => (
                        <View key={message.id} style={styles.chatMessage}>
                            <Text style={styles.chatUser}>{message.userName}:</Text>
                            <Text style={styles.chatText}>{message.message}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

function OrderItem({ order }: { order: typeof recentOrders[0] }) {
    const statusColors: Record<string, { bg: string; text: string }> = {
        processing: { bg: '#FEF3C7', text: '#D97706' },
        shipped: { bg: '#D1FAE5', text: '#059669' },
        pending: { bg: '#FEE2E2', text: '#DC2626' },
        delivered: { bg: '#DBEAFE', text: '#2563EB' },
    };

    const status = statusColors[order.status] || statusColors.pending;

    return (
        <View style={styles.orderItem}>
            <Image source={{ uri: order.items[0].productImage }} style={styles.orderImage} />
            <View style={styles.orderInfo}>
                <View style={styles.orderHeader}>
                    <Text style={styles.orderId}>#{order.id}</Text>
                    <View style={[styles.orderStatus, { backgroundColor: status.bg }]}>
                        <Text style={[styles.orderStatusText, { color: status.text }]}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Text>
                    </View>
                </View>
                <Text style={styles.orderProducts} numberOfLines={1}>
                    {order.items.map(i => i.productName).join(', ')}
                </Text>
                <Text style={styles.orderCustomer}>{order.customerName} • {order.customerLocation}</Text>
            </View>
            <View style={styles.orderRight}>
                <Text style={styles.orderAmount}>रू{order.totalAmount.toLocaleString()}</Text>
                <Text style={styles.orderItems}>{order.items.length} item{order.items.length > 1 ? 's' : ''}</Text>
                <TouchableOpacity>
                    <MoreVertical size={18} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

function TopProductItem({ product, rank }: { product: typeof products[0]; rank: number }) {
    const rankColors = ['#EAB308', '#9CA3AF', '#CD7F32', colors.text];

    return (
        <View style={styles.topProductItem}>
            <View style={[styles.rankBadge, { backgroundColor: rankColors[rank - 1] || colors.text }]}>
                <Text style={styles.rankText}>{rank}</Text>
            </View>
            <Image source={{ uri: product.images[0] }} style={styles.topProductImage} />
            <View style={styles.topProductInfo}>
                <Text style={styles.topProductName} numberOfLines={1}>{product.name}</Text>
                <View style={styles.topProductMeta}>
                    <Star size={12} color={colors.secondary} fill={colors.secondary} />
                    <Text style={styles.topProductRating}>{product.rating}</Text>
                    <Text style={styles.topProductReviews}>• {product.totalReviews} reviews</Text>
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${(product.rating / 5) * 100}%` }]} />
                </View>
            </View>
            <Text style={styles.topProductPrice}>रू{product.price.toLocaleString()}</Text>
        </View>
    );
}

export default function VendorDashboardScreen() {
    const { t } = useLanguage();

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
                    <TouchableOpacity style={styles.addButton}>
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
                    <TouchableOpacity style={styles.profileButton}>
                        <Image source={{ uri: currentVendor.avatar }} style={styles.profileAvatar} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.welcomeSection}>
                    <View>
                        <Text style={styles.welcomeText}>{t('goodEvening')}, {currentVendor.name.split(' ')[0]}! 👋</Text>
                        <Text style={styles.welcomeSubtext}>{t('storeMessage')}</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.festivalBanner}>
                    <LinearGradient
                        colors={['#FEF3C7', '#FDE68A']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.festivalGradient}
                    >
                        <View style={styles.festivalIcon}>
                            <Calendar size={20} color={colors.secondary} />
                        </View>
                        <View style={styles.festivalInfo}>
                            <Text style={styles.festivalTitle}>{t('upcomingFestival')} 🎉</Text>
                            <Text style={styles.festivalText}>{t('festivalMessage')}</Text>
                        </View>
                        <TouchableOpacity style={styles.prepareButton}>
                            <Text style={styles.prepareButtonText}>{t('prepareStore')}</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={styles.statsGrid}>
                    <StatCard
                        title={t('todayRevenue')}
                        value={`रू${dashboardStats.todayRevenue.toLocaleString()}`}
                        change={dashboardStats.revenueChange}
                        icon={IndianRupee}
                    />
                    <StatCard
                        title={t('totalOrders')}
                        value={dashboardStats.totalOrders.toString()}
                        change={dashboardStats.ordersChange}
                        icon={ShoppingCart}
                    />
                    <StatCard
                        title={t('activeProducts')}
                        value={dashboardStats.activeProducts.toString()}
                        change={dashboardStats.productsChange}
                        icon={Package}
                    />
                    <StatCard
                        title={t('storeVisitors')}
                        value={dashboardStats.storeVisitors.toLocaleString()}
                        change={dashboardStats.visitorsChange}
                        icon={Users}
                        isHighlight
                    />
                </View>

                <View style={styles.mainContent}>
                    <View style={styles.leftColumn}>
                        <SalesChart />

                        <View style={styles.ordersSection}>
                            <View style={styles.sectionHeader}>
                                <View>
                                    <Text style={styles.sectionTitle}>{t('recentOrders')}</Text>
                                    <Text style={styles.sectionSubtitle}>{t('latestOrders')}</Text>
                                </View>
                                <TouchableOpacity style={styles.viewAllButton}>
                                    <Text style={styles.viewAllText}>{t('viewAll')}</Text>
                                </TouchableOpacity>
                            </View>
                            {recentOrders.map(order => (
                                <OrderItem key={order.id} order={order} />
                            ))}
                        </View>
                    </View>

                    <View style={styles.rightColumn}>
                        <LiveSessionPanel />

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
                            {products.slice(0, 4).map((product, index) => (
                                <TopProductItem key={product.id} product={product} rank={index + 1} />
                            ))}
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
});
