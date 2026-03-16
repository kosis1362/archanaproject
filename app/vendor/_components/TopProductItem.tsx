import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export function TopProductItem({ product, rank }: { product: any; rank: number }) {
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

const styles = StyleSheet.create({
    topProductItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
        gap: 12,
    },
    rankBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rankText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.white,
    },
    topProductImage: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: colors.borderLight,
    },
    topProductInfo: {
        flex: 1,
    },
    topProductName: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.text,
        marginBottom: 4,
    },
    topProductMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 6,
    },
    topProductRating: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text,
    },
    topProductReviews: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    progressBar: {
        height: 4,
        backgroundColor: colors.borderLight,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.secondary,
        borderRadius: 2,
    },
    topProductPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
});
