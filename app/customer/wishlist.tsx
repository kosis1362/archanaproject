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
import { Heart, ShoppingCart, Star, Trash2 } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { products } from '@/mocks/data';
import { useCart } from '@/contexts/CartContext';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function WishlistScreen() {
    const { addToCart } = useCart();
    const [wishlistItems, setWishlistItems] = useState(products.slice(0, 4));

    const removeFromWishlist = (id: string) => {
        setWishlistItems(prev => prev.filter(item => item.id !== id));
    };

    const handleAddToCart = (product: typeof products[0]) => {
        addToCart(product);
    };

    if (wishlistItems.length === 0) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Wishlist</Text>
                </View>
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIcon}>
                        <Heart size={48} color={colors.textSecondary} />
                    </View>
                    <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
                    <Text style={styles.emptyText}>Save items you love for later</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Wishlist</Text>
                <Text style={styles.itemCount}>{wishlistItems.length} items</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.grid}>
                    {wishlistItems.map(product => (
                        <View key={product.id} style={styles.productCard}>
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => removeFromWishlist(product.id)}
                            >
                                <Trash2 size={16} color={colors.error} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => router.push(`/product/${product.id}`)}
                            >
                                <Image source={{ uri: product.images[0] }} style={styles.productImage} />
                            </TouchableOpacity>
                            <View style={styles.productInfo}>
                                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                                <View style={styles.ratingRow}>
                                    <Star size={12} color={colors.secondary} fill={colors.secondary} />
                                    <Text style={styles.rating}>{product.rating}</Text>
                                </View>
                                <View style={styles.priceRow}>
                                    <Text style={styles.price}>रू{product.price.toLocaleString()}</Text>
                                    {product.originalPrice && (
                                        <Text style={styles.originalPrice}>रू{product.originalPrice.toLocaleString()}</Text>
                                    )}
                                </View>
                                <TouchableOpacity
                                    style={styles.addToCartButton}
                                    onPress={() => handleAddToCart(product)}
                                >
                                    <ShoppingCart size={16} color={colors.white} />
                                    <Text style={styles.addToCartText}>Add to Cart</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
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
    itemCount: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    content: {
        flex: 1,
        padding: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    productCard: {
        width: (width - 36) / 2,
        backgroundColor: colors.white,
        borderRadius: 16,
        margin: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden',
    },
    removeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 10,
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
    productImage: {
        width: '100%',
        height: 140,
        resizeMode: 'cover',
    },
    productInfo: {
        padding: 12,
    },
    productName: {
        fontSize: 13,
        fontWeight: '500' as const,
        color: colors.text,
        height: 36,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    rating: {
        fontSize: 12,
        fontWeight: '600' as const,
        color: colors.text,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 6,
    },
    price: {
        fontSize: 15,
        fontWeight: '700' as const,
        color: colors.primary,
    },
    originalPrice: {
        fontSize: 11,
        color: colors.textSecondary,
        textDecorationLine: 'line-through',
    },
    addToCartButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingVertical: 10,
        marginTop: 10,
        gap: 6,
    },
    addToCartText: {
        fontSize: 12,
        fontWeight: '600' as const,
        color: colors.white,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    emptyIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.borderLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600' as const,
        color: colors.text,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    bottomPadding: {
        height: 20,
    },
});
