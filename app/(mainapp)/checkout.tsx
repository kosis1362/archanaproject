import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
    X,
    MapPin,
    CreditCard,
    Wallet,
    Truck,
    ChevronRight,
    Check,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useCart } from '@/contexts/CartContext';

const paymentMethods = [
    { id: 'esewa', name: 'eSewa', icon: '💳' },
    { id: 'khalti', name: 'Khalti', icon: '💰' },
    { id: 'cod', name: 'Cash on Delivery', icon: '💵' },
];

export default function CheckoutScreen() {
    const { items, totalAmount, clearCart } = useCart();
    const [selectedPayment, setSelectedPayment] = useState('esewa');
    const [address, setAddress] = useState('Kathmandu, Nepal');

    const deliveryFee = 100;
    const finalTotal = totalAmount + deliveryFee;

    const handlePlaceOrder = () => {
        clearCart();
        router.replace('/customer');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <X size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Checkout</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <MapPin size={18} color={colors.primary} />
                        <Text style={styles.sectionTitle}>Delivery Address</Text>
                    </View>
                    <TouchableOpacity style={styles.addressCard}>
                        <View style={styles.addressInfo}>
                            <Text style={styles.addressName}>Home</Text>
                            <Text style={styles.addressText}>{address}</Text>
                        </View>
                        <ChevronRight size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Truck size={18} color={colors.primary} />
                        <Text style={styles.sectionTitle}>Order Summary</Text>
                    </View>
                    {items.map(item => (
                        <View key={item.id} style={styles.orderItem}>
                            <Image source={{ uri: item.product.images[0] }} style={styles.itemImage} />
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
                                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                            </View>
                            <Text style={styles.itemPrice}>
                                रू{(item.product.price * item.quantity).toLocaleString()}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CreditCard size={18} color={colors.primary} />
                        <Text style={styles.sectionTitle}>Payment Method</Text>
                    </View>
                    {paymentMethods.map(method => (
                        <TouchableOpacity
                            key={method.id}
                            style={[
                                styles.paymentOption,
                                selectedPayment === method.id && styles.paymentOptionSelected,
                            ]}
                            onPress={() => setSelectedPayment(method.id)}
                        >
                            <View style={styles.paymentLeft}>
                                <Text style={styles.paymentIcon}>{method.icon}</Text>
                                <Text style={styles.paymentName}>{method.name}</Text>
                            </View>
                            <View style={[
                                styles.radioOuter,
                                selectedPayment === method.id && styles.radioOuterSelected,
                            ]}>
                                {selectedPayment === method.id && (
                                    <View style={styles.radioInner} />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Wallet size={18} color={colors.primary} />
                        <Text style={styles.sectionTitle}>Promo Code</Text>
                    </View>
                    <View style={styles.promoContainer}>
                        <TextInput
                            style={styles.promoInput}
                            placeholder="Enter promo code"
                            placeholderTextColor={colors.textSecondary}
                        />
                        <TouchableOpacity style={styles.applyButton}>
                            <Text style={styles.applyButtonText}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.summarySection}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>रू{totalAmount.toLocaleString()}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Delivery Fee</Text>
                        <Text style={styles.summaryValue}>रू{deliveryFee}</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>रू{finalTotal.toLocaleString()}</Text>
                    </View>
                </View>

                <View style={styles.bottomPadding} />
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.footerTotal}>
                    <Text style={styles.footerTotalLabel}>Total</Text>
                    <Text style={styles.footerTotalValue}>रू{finalTotal.toLocaleString()}</Text>
                </View>
                <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
                    <LinearGradient
                        colors={['#B91C1C', '#F59E0B']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.placeOrderGradient}
                    >
                        <Check size={20} color={colors.white} />
                        <Text style={styles.placeOrderText}>Place Order</Text>
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
        fontSize: 18,
        fontWeight: '600' as const,
        color: colors.text,
    },
    content: {
        flex: 1,
    },
    section: {
        backgroundColor: colors.white,
        marginTop: 12,
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600' as const,
        color: colors.text,
    },
    addressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.borderLight,
        borderRadius: 12,
        padding: 14,
    },
    addressInfo: {
        flex: 1,
    },
    addressName: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.text,
    },
    addressText: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 2,
    },
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
        fontWeight: '500' as const,
        color: colors.text,
    },
    itemQuantity: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.text,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 10,
    },
    paymentOptionSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.cherryLight,
    },
    paymentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    paymentIcon: {
        fontSize: 20,
    },
    paymentName: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: colors.text,
    },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioOuterSelected: {
        borderColor: colors.primary,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.primary,
    },
    promoContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    promoInput: {
        flex: 1,
        backgroundColor: colors.borderLight,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        color: colors.text,
    },
    applyButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        borderRadius: 10,
        justifyContent: 'center',
    },
    applyButtonText: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.white,
    },
    summarySection: {
        backgroundColor: colors.white,
        marginTop: 12,
        padding: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: colors.text,
    },
    summaryDivider: {
        height: 1,
        backgroundColor: colors.borderLight,
        marginVertical: 10,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: colors.text,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: colors.primary,
    },
    footer: {
        backgroundColor: colors.white,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
    },
    footerTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    footerTotalLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    footerTotalValue: {
        fontSize: 22,
        fontWeight: '700' as const,
        color: colors.text,
    },
    placeOrderButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    placeOrderGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    placeOrderText: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: colors.white,
    },
    bottomPadding: {
        height: 20,
    },
});
