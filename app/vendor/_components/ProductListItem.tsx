import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star, Package, MoreVertical } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export function ProductListItem({ product }: { product: any }) {
    return (
        <View style={styles.productCard}>
            <Image source={{ uri: product.images?.[0] }} style={styles.productImage} />
            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                <Text style={styles.productCategory}>{product.category}</Text>
                <View style={styles.productMeta}>
                    <View style={styles.ratingContainer}>
                        <Star size={12} color={colors.secondary} fill={colors.secondary} />
                        <Text style={styles.ratingText}>{product.rating || '0.0'}</Text>
                    </View>
                    <View style={styles.stockContainer}>
                        <Package size={12} color={product.stock > 10 ? colors.success : colors.warning} />
                        <Text style={[styles.stockText, { color: product.stock > 10 ? colors.success : colors.warning }]}>
                            {product.stock} in stock
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.productRight}>
                <Text style={styles.productPrice}>रू{product.price.toLocaleString()}</Text>
                <TouchableOpacity style={styles.menuButton}>
                    <MoreVertical size={18} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    productCard: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: 10,
    },
    productInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    productName: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.text,
    },
    productCategory: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    productMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text,
    },
    stockContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    stockText: {
        fontSize: 11,
    },
    productRight: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.primary,
    },
    menuButton: {
        padding: 4,
    },
});
