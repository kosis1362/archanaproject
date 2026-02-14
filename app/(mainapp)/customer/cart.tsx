import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useCart } from '@/contexts/CartContext';
import { router } from 'expo-router';

export default function CartScreen() {
    const { items, updateQuantity, removeFromCart, totalAmount } = useCart();

    if (items.length === 0) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Cart</Text>
                </View>
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIcon}>
                        <ShoppingBag size={48} color={colors.textSecondary} />
                    </View>
                    <Text style={styles.emptyTitle}>Your cart is empty</Text>
                    <Text style={styles.emptyText}>Start shopping to add items to your cart</Text>
                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => router.push('/customer')}
                    >
                        <Text style={styles.shopButtonText}>Start Shopping</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Cart</Text>
                <Text style={styles.itemCount}>{items.length} items</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {items.map(item => (
                    <View key={item.id} style={styles.cartItem}>
                        <Image source={{ uri: item.product.images[0] }} style={styles.itemImage} />
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
                            <Text style={styles.itemVendor}>{item.product.vendorName}</Text>
                            <View style={styles.itemFooter}>
                                <Text style={styles.itemPrice}>रू{item.product.price.toLocaleString()}</Text>
                                <View style={styles.quantityControls}>
                                    <TouchableOpacity
                                        style={styles.quantityButton}
                                        onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
                                    >
                                        <Minus size={16} color={colors.text} />
                                    </TouchableOpacity>
                                    <Text style={styles.quantityText}>{item.quantity}</Text>
                                    <TouchableOpacity
                                        style={[styles.quantityButton, styles.quantityButtonPlus]}
                                        onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                                    >
                                        <Plus size={16} color={colors.white} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => removeFromCart(item.product.id)}
                        >
                            <Trash2 size={18} color={colors.error} />
                        </TouchableOpacity>
                    </View>
                ))}
                <View style={styles.bottomPadding} />
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalAmount}>रू{totalAmount.toLocaleString()}</Text>
                </View>
                <TouchableOpacity style={styles.checkoutButton} onPress={() => router.push('/checkout')}>
                    <LinearGradient
                        colors={['#B91C1C', '#F59E0B']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.checkoutGradient}
                    >
                        <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
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
        padding: 16,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    itemImage: {
        width: 90,
        height: 90,
        borderRadius: 12,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    itemName: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: colors.text,
    },
    itemVendor: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: colors.primary,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    quantityButton: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: colors.borderLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonPlus: {
        backgroundColor: colors.primary,
    },
    quantityText: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.text,
        minWidth: 24,
        textAlign: 'center',
    },
    deleteButton: {
        padding: 8,
    },
    footer: {
        backgroundColor: colors.white,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 10,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: '700' as const,
        color: colors.text,
    },
    checkoutButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    checkoutGradient: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    checkoutText: {
        fontSize: 16,
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
        marginBottom: 24,
    },
    shopButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
    },
    shopButtonText: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: colors.white,
    },
    bottomPadding: {
        height: 20,
    },
});
