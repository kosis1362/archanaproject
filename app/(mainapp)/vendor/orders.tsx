import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package, Truck, CheckCircle, Clock, MoreVertical } from 'lucide-react-native';
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
                <Text style={styles.headerTitle}>Orders</Text>
                <View style={styles.orderCount}>
                    <Text style={styles.orderCountText}>{recentOrders.length} orders</Text>
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
                {filteredOrders.map(order => {
                    const status = statusConfig[order.status] || statusConfig.pending;
                    const StatusIcon = status.icon;

                    return (
                        <View key={order.id} style={styles.orderCard}>
                            <View style={styles.orderHeader}>
                                <View style={styles.orderIdContainer}>
                                    <Text style={styles.orderId}>Order #{order.id}</Text>
                                    <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                                        <StatusIcon size={12} color={status.color} />
                                        <Text style={[styles.statusText, { color: status.color }]}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity>
                                    <MoreVertical size={18} color={colors.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.customerInfo}>
                                <Text style={styles.customerName}>{order.customerName}</Text>
                                <Text style={styles.customerLocation}>{order.customerLocation}</Text>
                            </View>

                            <View style={styles.itemsContainer}>
                                {order.items.map((item, index) => (
                                    <View key={index} style={styles.orderItem}>
                                        <Image source={{ uri: item.productImage }} style={styles.itemImage} />
                                        <View style={styles.itemInfo}>
                                            <Text style={styles.itemName} numberOfLines={1}>{item.productName}</Text>
                                            <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                                        </View>
                                        <Text style={styles.itemPrice}>रू{item.price.toLocaleString()}</Text>
                                    </View>
                                ))}
                            </View>

                            <View style={styles.orderFooter}>
                                <View style={styles.paymentInfo}>
                                    <Text style={styles.paymentLabel}>Payment:</Text>
                                    <Text style={styles.paymentMethod}>{order.paymentMethod.toUpperCase()}</Text>
                                    <View style={[styles.paymentStatus, { backgroundColor: order.paymentStatus === 'paid' ? '#D1FAE5' : '#FEF3C7' }]}>
                                        <Text style={[styles.paymentStatusText, { color: order.paymentStatus === 'paid' ? '#059669' : '#D97706' }]}>
                                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.totalContainer}>
                                    <Text style={styles.totalLabel}>Total</Text>
                                    <Text style={styles.totalAmount}>रू{order.totalAmount.toLocaleString()}</Text>
                                </View>
                            </View>

                            <View style={styles.actionButtons}>
                                <TouchableOpacity style={styles.secondaryButton}>
                                    <Text style={styles.secondaryButtonText}>View Details</Text>
                                </TouchableOpacity>
                                {order.status === 'pending' && (
                                    <TouchableOpacity style={styles.primaryButton}>
                                        <Text style={styles.primaryButtonText}>Accept Order</Text>
                                    </TouchableOpacity>
                                )}
                                {order.status === 'processing' && (
                                    <TouchableOpacity style={styles.primaryButton}>
                                        <Text style={styles.primaryButtonText}>Mark Shipped</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    );
                })}
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
    orderCount: {
        backgroundColor: colors.cherryLight,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    orderCountText: {
        fontSize: 13,
        fontWeight: '500' as const,
        color: colors.primary,
    },
    tabsContainer: {
        backgroundColor: colors.white,
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 4,
        borderRadius: 20,
        backgroundColor: colors.borderLight,
    },
    tabActive: {
        backgroundColor: colors.primary,
    },
    tabText: {
        fontSize: 13,
        color: colors.textSecondary,
        fontWeight: '500' as const,
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
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderIdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    orderId: {
        fontSize: 15,
        fontWeight: '600' as const,
        color: colors.text,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600' as const,
    },
    customerInfo: {
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    customerName: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: colors.text,
    },
    customerLocation: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    itemsContainer: {
        marginBottom: 12,
    },
    orderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    itemImage: {
        width: 48,
        height: 48,
        borderRadius: 8,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        fontSize: 13,
        fontWeight: '500' as const,
        color: colors.text,
    },
    itemQuantity: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.text,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
        marginBottom: 12,
    },
    paymentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    paymentLabel: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    paymentMethod: {
        fontSize: 12,
        fontWeight: '600' as const,
        color: colors.text,
    },
    paymentStatus: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    paymentStatusText: {
        fontSize: 10,
        fontWeight: '600' as const,
    },
    totalContainer: {
        alignItems: 'flex-end',
    },
    totalLabel: {
        fontSize: 11,
        color: colors.textSecondary,
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: colors.primary,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    secondaryButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontSize: 13,
        fontWeight: '600' as const,
        color: colors.text,
    },
    primaryButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: colors.primary,
        alignItems: 'center',
    },
    primaryButtonText: {
        fontSize: 13,
        fontWeight: '600' as const,
        color: colors.white,
    },
    bottomPadding: {
        height: 20,
    },
});
