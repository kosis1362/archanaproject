import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Dimensions, Animated } from 'react-native';
import { router } from 'expo-router';
import { Heart, Zap, Star } from 'lucide-react-native';
import { colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

export function ProductCard({ product }: { product: any }) {
    const scale = useRef(new Animated.Value(1)).current;
    
    const price = product.price || 0;
    const originalPrice = product.original_price || product.originalPrice;
    const discount = originalPrice
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.95,
            useNativeDriver: true,
            speed: 20,
            bounciness: 8,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
            bounciness: 8,
        }).start();
    };

    return (
        <Pressable
            onPress={() => router.push(`/product/${product.id}`)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <Animated.View style={[styles.productCard, { transform: [{ scale }] }]}>
                <View style={styles.productImageContainer}>
                    {product.images?.[0] && (
                        <Image source={{ uri: product.images[0] }} style={styles.productImage} />
                    )}
                    <Pressable style={styles.wishlistButton}>
                        <Heart size={18} color={colors.textSecondary} />
                    </Pressable>
                    {discount > 0 && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{discount}% OFF</Text>
                        </View>
                    )}
                    {(product.isFlashDeal || product.is_flash_deal) && (
                        <View style={styles.flashBadge}>
                            <Zap size={12} color={colors.white} fill={colors.white} />
                        </View>
                    )}
                </View>
                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                    <View style={styles.ratingRow}>
                        <Star size={12} color={colors.secondary} fill={colors.secondary} />
                        <Text style={styles.rating}>{product.rating || '0.0'}</Text>
                        <Text style={styles.reviews}>({product.total_reviews || product.totalReviews || 0})</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>रू{price.toLocaleString()}</Text>
                        {originalPrice ? (
                            <Text style={styles.originalPrice}>रू{originalPrice.toLocaleString()}</Text>
                        ) : null}
                    </View>
                </View>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    productCard: {
        width: (width - 48) / 2,
        backgroundColor: colors.white,
        borderRadius: 20,
        marginHorizontal: 4,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    productImageContainer: {
        position: 'relative',
        height: 150,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    wishlistButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    discountBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: colors.primary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    discountText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.white,
    },
    flashBadge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: colors.secondary,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productInfo: {
        padding: 12,
    },
    productName: {
        fontSize: 13,
        fontWeight: '500',
        color: colors.text,
        height: 36,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 4,
    },
    rating: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text,
    },
    reviews: {
        fontSize: 11,
        color: colors.textSecondary,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        gap: 6,
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.primary,
    },
    originalPrice: {
        fontSize: 12,
        color: colors.textSecondary,
        textDecorationLine: 'line-through',
    },
});
