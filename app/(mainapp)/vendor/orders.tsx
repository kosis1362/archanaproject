import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, User, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { recentOrders } from '@/mocks/data';

const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered'];

export default function VendorOrdersScreen() {
    const [activeTab, setActiveTab] = useState('All');

    const filteredOrders = activeTab === 'All'
        ? recentOrders
        : recentOrders.filter(o => o.status.toLowerCase() === activeTab.toLowerCase());

    const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
        pending: { icon: Clock, color: '#DC2626', bg: '#FEE2E2' },
        processing: { icon: Package, color: '#D97706', bg: '#FEF3C7' },
        shipped: { icon: Truck, color: '#059669', bg: '#D1FAE5' },
        delivered: { icon: CheckCircle, color: '#2563EB', bg: '#DBEAFE' },
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Order Management</Text>
            </View>

            <View style={styles.summaryContainer}>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>{recentOrders.length}</Text>
                    <Text style={styles.summaryLabel}>Total Orders</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: '#DC2626' }]}>
                        {recentOrders.filter(o => o.status === 'pending').length}
                    </Text>
                    <Text style={styles.summaryLabel}>Pending</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: '#2563EB' }]}>
                        {recentOrders.filter(o => o.status === 'delivered').length}
                    </Text>
                    <Text style={styles.summaryLabel}>Delivered</Text>
                </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
                {tabs.map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.tabActive]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {filteredOrders.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Package size={48} color={colors.textSecondary} />
                        <Text style={styles.emptyText}>No {activeTab.toLowerCase()} orders found</Text>
                    </View>
                ) : (
                    filteredOrders.map(order => {
                        const status = statusConfig[order.status] || statusConfig.pending;
                        const StatusIcon = status.icon;

                        return (
                            <View key={order.id} style={styles.orderCard}>
                                <View style={styles.orderCardHeader}>
                                    <View style={styles.orderIdGroup}>
                                        <Text style={styles.orderId}>Order #{order.id}</Text>
                                        <Text style={styles.orderDate}>Today, 10:30 AM</Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                                        <StatusIcon size={12} color={status.color} />
                                        <Text style={[styles.statusText, { color: status.color }]}>
                                            {order.status.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.customerDetailSection}>
                                    <View style={styles.detailRow}>
                                        <User size={16} color={colors.primary} />
                                        <Text style={styles.detailText}>{order.customerName}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Phone size={16} color={colors.primary} />
                                        <Text style={styles.detailText}>+977 98XXXXXXXX</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <MapPin size={16} color={colors.primary} />
                                        <Text style={styles.detailText} numberOfLines={1}>{order.customerLocation}</Text>
                                    </View>
                                </View>

                                <View style={styles.itemsList}>
                                    {order.items.map((item, index) => (
                                        <View key={index} style={styles.orderItemRow}>
                                            <Image source={{ uri: item.productImage }} style={styles.itemThumb} />
                                            <View style={styles.itemMainInfo}>
                                                <Text style={styles.itemName} numberOfLines={1}>{item.productName}</Text>
                                                <Text style={styles.itemMeta}>Qty: {item.quantity} • Price: रू{item.price.toLocaleString()}</Text>
                                            </View>
                                            <Text style={styles.itemSubtotal}>रू{(item.price * item.quantity).toLocaleString()}</Text>
                                        </View>
                                    ))}
                                </View>

                                <View style={styles.orderPricing}>
                                    <View style={styles.priceRow}>
                                        <Text style={styles.priceLabel}>Payment Mode:</Text>
                                        <Text style={styles.priceValue}>{order.paymentMethod.toUpperCase()}</Text>
                                    </View>
                                    <View style={[styles.priceRow, styles.totalRow]}>
                                        <Text style={styles.totalLabel}>Grand Total</Text>
                                        <Text style={styles.totalValue}>रू{order.totalAmount.toLocaleString()}</Text>
                                    </View>
                                </View>

                                <View style={styles.horizontalActions}>
                                    <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]}>
                                        <Text style={styles.secondaryBtnText}>View Full Details</Text>
                                    </TouchableOpacity>

                                    {order.status === 'pending' && (
                                        <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]}>
                                            <Text style={styles.primaryBtnText}>Accept Order</Text>
                                        </TouchableOpacity>
                                    )}
                                    {order.status === 'processing' && (
                                        <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]}>
                                            <Text style={styles.primaryBtnText}>Mark Shipped</Text>
                                        </TouchableOpacity>
                                    )}
                                    {order.status === 'shipped' && (
                                        <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]}>
                                            <Text style={styles.primaryBtnText}>Mark Delivered</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
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
        padding: 16,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800' as const,
        color: colors.text,
    },
    summaryContainer: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        margin: 16,
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        alignItems: 'center',
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: '900' as const,
        color: colors.text,
    },
    summaryLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 4,
        fontWeight: '600' as const,
    },
    summaryDivider: {
        width: 1,
        height: 40,
        backgroundColor: colors.borderLight,
        marginHorizontal: 10,
    },
    tabsContainer: {
        backgroundColor: colors.white,
        paddingHorizontal: 12,
        paddingVertical: 12,
        maxHeight: 70,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginHorizontal: 6,
        borderRadius: 25,
        backgroundColor: colors.borderLight,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    tabActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    tabText: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '700' as const,
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
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    orderCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
        paddingBottom: 12,
        marginBottom: 12,
    },
    orderIdGroup: {
        gap: 2,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '800' as const,
        color: colors.text,
    },
    orderDate: {
        fontSize: 11,
        color: colors.textSecondary,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '800' as const,
    },
    customerDetailSection: {
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 12,
        gap: 8,
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    detailText: {
        fontSize: 13,
        color: colors.text,
        fontWeight: '500' as const,
    },
    itemsList: {
        gap: 12,
        marginBottom: 16,
    },
    orderItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    itemThumb: {
        width: 50,
        height: 50,
        borderRadius: 10,
    },
    itemMainInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '700' as const,
        color: colors.text,
    },
    itemMeta: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    itemSubtotal: {
        fontSize: 14,
        fontWeight: '700' as const,
        color: colors.text,
    },
    orderPricing: {
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
        paddingTop: 12,
        gap: 6,
        marginBottom: 16,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceLabel: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    priceValue: {
        fontSize: 13,
        fontWeight: '700' as const,
        color: colors.text,
    },
    totalRow: {
        marginTop: 4,
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: '800' as const,
        color: colors.text,
    },
    totalValue: {
        fontSize: 20,
        fontWeight: '900' as const,
        color: colors.primary,
    },
    horizontalActions: {
        flexDirection: 'row',
        gap: 10,
    },
    actionBtn: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryBtn: {
        backgroundColor: colors.primary,
    },
    secondaryBtn: {
        backgroundColor: colors.white,
        borderWidth: 1.5,
        borderColor: colors.border,
    },
    primaryBtnText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '700' as const,
    },
    secondaryBtnText: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '700' as const,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        gap: 16,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textSecondary,
        fontWeight: '600' as const,
    },
    bottomSpace: {
        height: 40,
    },
});
