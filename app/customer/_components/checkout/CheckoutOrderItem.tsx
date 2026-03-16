import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '@/constants/colors';

export function CheckoutOrderItem({ item }: { item: any }) {
    return (
        <View style={styles.orderItem}>
            <Image source={{ uri: item.product.images[0] }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>
                रू{(item.product.price * item.quantity).toLocaleString()}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    orderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        fontSize: 13,
        fontWeight: '500',
        color: colors.text,
    },
    itemQuantity: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
});
