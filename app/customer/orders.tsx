import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package, Truck, CheckCircle, Clock, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

const tabs = ['All', 'Active', 'Completed'];

export default function CustomerOrdersScreen() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('All');
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchOrders = async () => {
        if (!user?.id) return;
        try {
            setIsLoading(true);
            const data = await api.getCustomerOrders(user.id);
            setOrders(data);
        } catch (error) {
            console.error('Error fetching customer orders:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user?.id]);

    const filteredOrders = activeTab === 'All'
        ? orders
        : activeTab === 'Active'
            ? orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status))
            : orders.filter(o => o.status === 'delivered');

    const statusConfig: Record<string, { color: string; bg: string }> = {
        pending: { color: '#DC2626', bg: '#FEE2E2' },
        processing: { color: '#D97706', bg: '#FEF3C7' },
        shipped: { color: '#059669', bg: '#D1FAE5' },
        delivered: { color: '#2563EB', bg: '#DBEAFE' },
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronRight size={24} color={colors.text} style={{ transform: [{ rotate: '180deg' }] }} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Orders</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.tabsContainer}>
                {tabs.map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.tabActive]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={() => {
                        setIsRefreshing(true);
                        fetchOrders();
                    }} />
                }
            >
                {isLoading && !isRefreshing ? (
                    <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
                ) : filteredOrders.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Package size={48} color={colors.textSecondary} />
                        <Text style={styles.emptyText}>No {activeTab.toLowerCase()} orders found</Text>
                        <TouchableOpacity
                            style={styles.shopButton}
                            onPress={() => router.push('/customer')}
                        >
                            <Text style={styles.shopButtonText}>Start Shopping</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    filteredOrders.map(order => {
                        const status = statusConfig[order.status] || statusConfig.pending;

                        return (
                            <TouchableOpacity key={order.id} style={styles.orderCard} activeOpacity={0.7}>
                                <View style={styles.orderCardHeader}>
                                    <View>
                                        <Text style={styles.vendorName}>{order.vendorName}</Text>
                                        <Text style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                                        <Text style={[styles.statusText, { color: status.color }]}>
                                            {order.status.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.itemsPreview}>
                                    {order.items.slice(0, 3).map((item, index) => (
                                        <Image key={index} source={{ uri: item.productImage }} style={styles.itemThumb} />
                                    ))}
                                    {order.items.length > 3 && (
                                        <View style={styles.moreItems}>
                                            <Text style={styles.moreItemsText}>+{order.items.length - 3}</Text>
                                        </View>
                                    )}
                                    <View style={styles.itemsInfo}>
                                        <Text style={styles.itemCount}>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</Text>
                                        <Text style={styles.orderTotal}>रू{order.totalAmount.toLocaleString()}</Text>
                                    </View>
                                </View>

                                <View style={styles.orderCardFooter}>
                                    <Text style={styles.orderId}>Order #{order.id.slice(0, 8)}</Text>
                                    <ChevronRight size={18} color={colors.textSecondary} />
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}
                <View style={styles.bottomSpace} />
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
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: colors.text,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        padding: 12,
        gap: 12,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: colors.borderLight,
    },
    tabActive: {
        backgroundColor: colors.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.textSecondary,
    },
    tabTextActive: {
        color: colors.white,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    orderCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    orderCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    vendorName: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: colors.text,
    },
    orderDate: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '800' as const,
    },
    itemsPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
        paddingBottom: 16,
        marginBottom: 12,
    },
    itemThumb: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 8,
    },
    moreItems: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: colors.borderLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    moreItemsText: {
        fontSize: 14,
        fontWeight: '700' as const,
        color: colors.textSecondary,
    },
    itemsInfo: {
        flex: 1,
        alignItems: 'flex-end',
    },
    itemCount: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    orderTotal: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: colors.primary,
        marginTop: 2,
    },
    orderCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderId: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
        gap: 16,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textSecondary,
        fontWeight: '600' as const,
    },
    shopButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 8,
    },
    shopButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600' as const,
    },
    bottomSpace: {
        height: 32,
    },
});
