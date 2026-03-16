import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export function OrderItem({ order }: { order: any }) {
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

const styles = StyleSheet.create({
    orderItem: {
        flexDirection: 'row',
        paddingVertical: 16,
        paddingHorizontal: 12,
        marginBottom: 12,
        backgroundColor: colors.white,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        gap: 12,
    },
    orderImage: {
        width: 52,
        height: 52,
        borderRadius: 12,
        backgroundColor: colors.borderLight,
    },
    orderInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    orderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    orderId: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
    orderStatus: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    orderStatusText: {
        fontSize: 11,
        fontWeight: '700',
    },
    orderProducts: {
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    orderCustomer: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    orderRight: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    orderAmount: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
    orderItems: {
        fontSize: 12,
        color: colors.textSecondary,
    },
});
