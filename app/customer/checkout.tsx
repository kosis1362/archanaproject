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
import { useAuth } from '@/contexts/AuthContext';
import { Alert, ActivityIndicator } from 'react-native';
import { AddressCard } from '@/app/customer/_components/checkout/AddressCard';
import { CheckoutOrderItem } from '@/app/customer/_components/checkout/CheckoutOrderItem';
import { PaymentMethodOption } from '@/app/customer/_components/checkout/PaymentMethodOption';

const paymentMethods = [
    { id: 'esewa', name: 'eSewa', icon: '💳' },
    { id: 'khalti', name: 'Khalti', icon: '💰' },
    { id: 'cod', name: 'Cash on Delivery', icon: '💵' },
];

export default function CheckoutScreen() {
    const { user } = useAuth();
    const { items, totalAmount, clearCart } = useCart();
    const [selectedPayment, setSelectedPayment] = useState('esewa');
    const [address, setAddress] = useState('Kathmandu, Nepal');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const deliveryFee = 100;
    const finalTotal = totalAmount + deliveryFee;

    const handlePlaceOrder = async () => {
        if (!user?.id) {
            Alert.alert('Error', 'You must be logged in to place an order');
            return;
        }

        try {
            setIsSubmitting(true);

            // Mock network latency for ordering
            await new Promise(r => setTimeout(r, 1500));
            // Success

            Alert.alert(
                'Success',
                'Your order has been placed successfully!',
                [{
                    text: 'Back to Shopping',
                    onPress: () => {
                        clearCart();
                        router.replace('/customer/dashboard');
                    }
                }]
            );
        } catch (error: any) {
            console.error('Checkout error:', error);
            Alert.alert('Error', 'Failed to place order: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
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
                    <AddressCard address={address} />
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Truck size={18} color={colors.primary} />
                        <Text style={styles.sectionTitle}>Order Summary</Text>
                    </View>
                    {items.map(item => (
                        <CheckoutOrderItem key={item.id} item={item} />
                    ))}
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CreditCard size={18} color={colors.primary} />
                        <Text style={styles.sectionTitle}>Payment Method</Text>
                    </View>
                    {paymentMethods.map(method => (
                        <PaymentMethodOption
                            key={method.id}
                            method={method}
                            isSelected={selectedPayment === method.id}
                            onSelect={setSelectedPayment}
                        />
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
                <TouchableOpacity
                    style={[styles.placeOrderButton, isSubmitting && { opacity: 0.7 }]}
                    onPress={handlePlaceOrder}
                    disabled={isSubmitting}
                >
                    <LinearGradient
                        colors={['#B91C1C', '#F59E0B']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.placeOrderGradient}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color={colors.white} />
                        ) : (
                            <>
                                <Check size={20} color={colors.white} />
                                <Text style={styles.placeOrderText}>Place Order</Text>
                            </>
                        )}
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
