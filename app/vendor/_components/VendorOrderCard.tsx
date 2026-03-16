import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Package, Truck, CheckCircle, Clock, MapPin, User } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Order } from '@/types';

interface VendorOrderCardProps {
    order: Order;
    onUpdateStatus: (orderId: string, newStatus: Order['status']) => void;
}

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
    pending: { icon: Clock, color: '#DC2626', bg: '#FEE2E2' },
    processing: { icon: Package, color: '#D97706', bg: '#FEF3C7' },
    shipped: { icon: Truck, color: '#059669', bg: '#D1FAE5' },
    delivered: { icon: CheckCircle, color: '#2563EB', bg: '#DBEAFE' },
};

export function VendorOrderCard({ order, onUpdateStatus }: VendorOrderCardProps) {
    const status = statusConfig[order.status] || statusConfig.pending;
    const StatusIcon = status.icon;

    return (
        <View style={styles.orderCard}>
            <View style={styles.orderCardHeader}>
                <View style={styles.orderIdGroup}>
                    <Text style={styles.orderId}>Order #{order.id.slice(0, 8)}...</Text>
                    <Text style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</Text>
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
                    <Text style={styles.priceValue}>{order.paymentMethod?.toUpperCase()}</Text>
                </View>
                <View style={[styles.priceRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Grand Total</Text>
                    <Text style={styles.totalValue}>रू{order.totalAmount.toLocaleString()}</Text>
                </View>
            </View>

            <View style={styles.horizontalActions}>
                {order.status === 'pending' && (
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.primaryBtn]}
                        onPress={() => onUpdateStatus(order.id, 'processing')}
                    >
                        <Text style={styles.primaryBtnText}>Accept Order</Text>
                    </TouchableOpacity>
                )}
                {order.status === 'processing' && (
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.primaryBtn]}
                        onPress={() => onUpdateStatus(order.id, 'shipped')}
                    >
                        <Text style={styles.primaryBtnText}>Mark Shipped</Text>
                    </TouchableOpacity>
                )}
                {order.status === 'shipped' && (
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.primaryBtn]}
                        onPress={() => onUpdateStatus(order.id, 'delivered')}
                    >
                        <Text style={styles.primaryBtnText}>Mark Delivered</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
        fontWeight: '800',
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
        fontWeight: '800',
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
        fontWeight: '500',
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
        fontWeight: '700',
        color: colors.text,
    },
    itemMeta: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    itemSubtotal: {
        fontSize: 14,
        fontWeight: '700',
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
        fontWeight: '700',
        color: colors.text,
    },
    totalRow: {
        marginTop: 4,
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.text,
    },
    totalValue: {
        fontSize: 20,
        fontWeight: '900',
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
    primaryBtnText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '700',
    },
});
