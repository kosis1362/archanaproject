import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Star } from 'lucide-react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';

export function SearchResultItem({ product }: { product: any }) {
    return (
        <TouchableOpacity
            style={styles.resultItem}
            onPress={() => router.push(`/product/${product.id}`)}
        >
            <Image source={{ uri: product.images?.[0] || 'https://via.placeholder.com/150' }} style={styles.resultImage} />
            <View style={styles.resultInfo}>
                <Text style={styles.resultName} numberOfLines={2}>{product.name}</Text>
                <Text style={styles.resultCategory}>{product.category}</Text>
                <View style={styles.resultMeta}>
                    <Text style={styles.resultPrice}>रू{product.price.toLocaleString()}</Text>
                    <View style={styles.ratingContainer}>
                        <Star size={12} color={colors.secondary} fill={colors.secondary} />
                        <Text style={styles.ratingText}>{product.rating || '0.0'}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    resultItem: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    resultImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    resultInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    resultName: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.text,
    },
    resultCategory: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    resultMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    resultPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.primary,
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
});
