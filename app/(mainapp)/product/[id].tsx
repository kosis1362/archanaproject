import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ArrowLeft,
    Heart,
    Share2,
    Star,
    Minus,
    Plus,
    ShoppingCart,
    Truck,
    Shield,
    RotateCcw,
    Store,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { products as mockProducts } from '@/mocks/data';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { addToCart } = useCart();

    // State
    const [product, setProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.errorContainer}>
                <Text>Product not found</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ color: colors.primary, marginTop: 10 }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const price = product.price || 0;
    const originalPrice = product.original_price || product.originalPrice;
    const discount = originalPrice
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    const handleAddToCart = () => {
        addToCart(product, quantity);
        router.push('/customer/cart');
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: product.images[0] }} style={styles.productImage} />
                    <SafeAreaView style={styles.headerOverlay}>
                        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
                            <ArrowLeft size={22} color={colors.text} />
                        </TouchableOpacity>
                        <View style={styles.headerRight}>
                            <TouchableOpacity
                                style={styles.headerButton}
                                onPress={() => setIsWishlisted(!isWishlisted)}
                            >
                                <Heart
                                    size={22}
                                    color={isWishlisted ? colors.primary : colors.text}
                                    fill={isWishlisted ? colors.primary : 'transparent'}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerButton}>
                                <Share2 size={22} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                    {discount > 0 && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{discount}% OFF</Text>
                        </View>
                    )}
                </View>

                <View style={styles.content}>
                    <View style={styles.vendorRow}>
                        <Store size={14} color={colors.primary} />
                        <Text style={styles.vendorName}>{product.vendor_name || product.vendorName || 'Vendor'}</Text>
                    </View>

                    <Text style={styles.productName}>{product.name}</Text>

                    <View style={styles.ratingRow}>
                        <View style={styles.ratingContainer}>
                            <Star size={16} color={colors.secondary} fill={colors.secondary} />
                            <Text style={styles.rating}>{product.rating || '0.0'}</Text>
                            <Text style={styles.reviews}>({product.total_reviews || product.totalReviews || 0} reviews)</Text>
                        </View>
                        <Text style={styles.stock}>{product.stock} in stock</Text>
                    </View>

                    <View style={styles.priceRow}>
                        <Text style={styles.price}>रू{price.toLocaleString()}</Text>
                        {originalPrice && (
                            <Text style={styles.originalPrice}>रू{originalPrice.toLocaleString()}</Text>
                        )}
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{product.description}</Text>

                    <View style={styles.featuresRow}>
                        <View style={styles.featureItem}>
                            <View style={styles.featureIcon}>
                                <Truck size={18} color={colors.primary} />
                            </View>
                            <Text style={styles.featureText}>Free Delivery</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <View style={styles.featureIcon}>
                                <Shield size={18} color={colors.primary} />
                            </View>
                            <Text style={styles.featureText}>Secure Payment</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <View style={styles.featureIcon}>
                                <RotateCcw size={18} color={colors.primary} />
                            </View>
                            <Text style={styles.featureText}>Easy Returns</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Quantity</Text>
                    <View style={styles.quantityRow}>
                        <View style={styles.quantityControls}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                <Minus size={18} color={colors.text} />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity
                                style={[styles.quantityButton, styles.quantityButtonPlus]}
                                onPress={() => setQuantity(quantity + 1)}
                            >
                                <Plus size={18} color={colors.white} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.totalPrice}>
                            Total: रू{(price * quantity).toLocaleString()}
                        </Text>
                    </View>
                </View>

                <View style={styles.bottomPadding} />
            </ScrollView>

            <SafeAreaView edges={['bottom']} style={styles.footer}>
                <View style={styles.footerContent}>
                    <TouchableOpacity style={styles.cartIconButton}>
                        <ShoppingCart size={22} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                        <LinearGradient
                            colors={['#B91C1C', '#F59E0B']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.addToCartGradient}
                        >
                            <ShoppingCart size={20} color={colors.white} />
                            <Text style={styles.addToCartText}>Add to Cart</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    imageContainer: {
        position: 'relative',
        width: width,
        height: width,
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    headerButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 8,
    },
    discountBadge: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        backgroundColor: colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    discountText: {
        fontSize: 14,
        fontWeight: '700' as const,
        color: colors.white,
    },
    content: {
        padding: 20,
        backgroundColor: colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -24,
    },
    vendorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    vendorName: {
        fontSize: 13,
        color: colors.primary,
        fontWeight: '500' as const,
    },
    productName: {
        fontSize: 22,
        fontWeight: '700' as const,
        color: colors.text,
        marginBottom: 12,
    },
    ratingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    rating: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.text,
    },
    reviews: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    stock: {
        fontSize: 13,
        color: colors.success,
        fontWeight: '500' as const,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    price: {
        fontSize: 28,
        fontWeight: '700' as const,
        color: colors.primary,
    },
    originalPrice: {
        fontSize: 18,
        color: colors.textSecondary,
        textDecorationLine: 'line-through',
    },
    divider: {
        height: 1,
        backgroundColor: colors.borderLight,
        marginVertical: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: colors.text,
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 22,
    },
    featuresRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    featureItem: {
        alignItems: 'center',
        flex: 1,
    },
    featureIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: colors.cherryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    featureText: {
        fontSize: 11,
        color: colors.text,
        textAlign: 'center',
    },
    quantityRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    quantityButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: colors.borderLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonPlus: {
        backgroundColor: colors.primary,
    },
    quantityText: {
        fontSize: 18,
        fontWeight: '600' as const,
        color: colors.text,
        minWidth: 32,
        textAlign: 'center',
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: colors.text,
    },
    footer: {
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
    },
    footerContent: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    cartIconButton: {
        width: 56,
        height: 56,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addToCartButton: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
    },
    addToCartGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 8,
    },
    addToCartText: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: colors.white,
    },
    bottomPadding: {
        height: 100,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
