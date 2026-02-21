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
    LogOut,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { dashboardStats as mockStats, salesData as mockSales, recentOrders as mockOrders, products as mockProducts, liveChat as mockChat, currentVendor } from '@/mocks/data';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

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
    const maxAmount = Math.max(...mockSales.map(d => d.amount));

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
                    {mockSales.map((data, index) => (
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
    const { user } = useAuth();
    const [activeSession, setActiveSession] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            ])
        ).start();

        fetchActiveSession();
    }, []);

    const fetchActiveSession = async () => {
        try {
            const { data, error } = await supabase
                .from('live_sessions')
                .select('*')
                .eq('vendor_id', user?.id)
                .eq('is_live', true)
                .single();

            if (data) {
                setActiveSession(data);
                fetchMessages(data.id);
                subscribeToMessages(data.id);
            }
        } catch (error) {
            // No active session
        }
    };

    const fetchMessages = async (sessionId: string) => {
        const { data } = await supabase
            .from('messages')
            .select('*')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true });
        if (data) setMessages(data);
    };

    const subscribeToMessages = (sessionId: string) => {
        const channel = supabase
            .channel(`session-${sessionId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `session_id=eq.${sessionId}` },
                (payload) => {
                    setMessages((current) => [...current, payload.new]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !activeSession || !user) return;

        try {
            const { error } = await supabase.from('messages').insert([
                {
                    session_id: activeSession.id,
                    sender_id: user.id,
                    sender_name: user.name || 'Vendor',
                    message: newMessage,
                }
            ]);
            if (error) throw error;
            setNewMessage('');
        } catch (error: any) {
            console.error('Send error:', error.message);
        }
    };

    if (!activeSession) {
        return (
            <View style={styles.livePanelEmpty}>
                <Radio size={40} color={colors.textSecondary} />
                <Text style={styles.livePanelEmptyText}>Start a live session to engage with consumers!</Text>
            </View>
        );
    }

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
                    <Text style={styles.chatTitle}>Live Chat</Text>
                    <ScrollView
                        style={styles.messagesList}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ gap: 8 }}
                    >
                        {messages.length === 0 ? (
                            <Text style={styles.noChatText}>No messages yet</Text>
                        ) : (
                            messages.map(message => (
                                <View key={message.id} style={styles.chatMessage}>
                                    <Text style={styles.chatUser}>{message.sender_name}:</Text>
                                    <Text style={styles.chatText}>{message.message}</Text>
                                </View>
                            ))
                        )}
                    </ScrollView>
                    <View style={styles.chatInputRow}>
                        <TextInput
                            style={styles.chatInput}
                            placeholder="Type a message..."
                            value={newMessage}
                            onChangeText={setNewMessage}
                            onSubmitEditing={sendMessage}
                        />
                        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                            <Text style={styles.sendButtonText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

function OrderItem({ order }: { order: any }) {
    const statusColors: Record<string, { bg: string; text: string }> = {
        processing: { bg: '#FEF3C7', text: '#D97706' },
        shipped: { bg: '#D1FAE5', text: '#059669' },
        pending: { bg: '#FEE2E2', text: '#DC2626' },
        delivered: { bg: '#DBEAFE', text: '#2563EB' },
    };

    const status = statusColors[order.status] || statusColors.pending;

    return (
        <View style={styles.orderItem}>
            {order.items?.[0]?.productImage && (
                <Image source={{ uri: order.items[0].productImage }} style={styles.orderImage} />
            )}
            <View style={styles.orderInfo}>
                <View style={styles.orderHeader}>
                    <Text style={styles.orderId}>#{order.id.slice(0, 8)}</Text>
                    <View style={[styles.orderStatus, { backgroundColor: status.bg }]}>
                        <Text style={[styles.orderStatusText, { color: status.text }]}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Text>
                    </View>
                </View>
                <Text style={styles.orderProducts} numberOfLines={1}>
                    {order.items?.map((i: any) => i.productName).join(', ') || 'No items'}
                </Text>
                <Text style={styles.orderCustomer}>{order.customerName} • {order.customerLocation}</Text>
            </View>
            <View style={styles.orderRight}>
                <Text style={styles.orderAmount}>रू{order.total_amount?.toLocaleString() || order.totalAmount?.toLocaleString()}</Text>
                <Text style={styles.orderItems}>{order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}</Text>
                <TouchableOpacity>
                    <MoreVertical size={18} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

function TopProductItem({ product, rank }: { product: any; rank: number }) {
    const rankColors = ['#EAB308', '#9CA3AF', '#CD7F32', colors.text];

    return (
        <View style={styles.topProductItem}>
            <View style={[styles.rankBadge, { backgroundColor: rankColors[rank - 1] || colors.text }]}>
                <Text style={styles.rankText}>{rank}</Text>
            </View>
            {product.images?.[0] && (
                <Image source={{ uri: product.images[0] }} style={styles.topProductImage} />
            )}
            <View style={styles.topProductInfo}>
                <Text style={styles.topProductName} numberOfLines={1}>{product.name}</Text>
                <View style={styles.topProductMeta}>
                    <Star size={12} color={colors.secondary} fill={colors.secondary} />
                    <Text style={styles.topProductRating}>{product.rating || '0.0'}</Text>
                    <Text style={styles.topProductReviews}>• {product.total_reviews || product.totalReviews || 0} reviews</Text>
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${((product.rating || 0) / 5) * 100}%` }]} />
                </View>
            </View>
            <Text style={styles.topProductPrice}>रू{product.price.toLocaleString()}</Text>
        </View>
    );
}

export default function VendorDashboardScreen() {
    const { t } = useLanguage();
    const { logout, user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [stats, setStats] = useState<any>(null);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.replace('/');
            return;
        }
        if (user) {
            fetchDashboardData();
        }
    }, [user, isAuthenticated, authLoading]);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            // 1. Fetch Orders
            const { data: orders } = await supabase
                .from('orders')
                .select('*, items')
                .eq('vendor_id', user?.id)
                .order('created_at', { ascending: false })
                .limit(5);
            setRecentOrders(orders || []);

            // 2. Fetch Products
            const { data: products } = await supabase
                .from('products')
                .select('*')
                .eq('vendor_id', user?.id)
                .order('rating', { ascending: false })
                .limit(4);
            setTopProducts(products || []);

            // 3. Simple Stats (mocking growth for visual appeal but using real counts)
            setStats({
                todayRevenue: orders ? orders.reduce((acc, o) => acc + (o.total_amount || 0), 0) : 0,
                totalOrders: orders ? orders.length : 0,
                activeProducts: products ? products.length : 0,
            });

        } catch (error) {
            console.error('Dashboard fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.replace('/');
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

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
});
