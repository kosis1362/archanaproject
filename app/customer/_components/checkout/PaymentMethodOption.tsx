import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';

interface PaymentMethodOptionProps {
    method: { id: string; name: string; icon: string };
    isSelected: boolean;
    onSelect: (id: string) => void;
}

export function PaymentMethodOption({ method, isSelected, onSelect }: PaymentMethodOptionProps) {
    return (
        <TouchableOpacity
            style={[
                styles.paymentOption,
                isSelected && styles.paymentOptionSelected,
            ]}
            onPress={() => onSelect(method.id)}
        >
            <View style={styles.paymentLeft}>
                <Text style={styles.paymentIcon}>{method.icon}</Text>
                <Text style={styles.paymentName}>{method.name}</Text>
            </View>
            <View style={[
                styles.radioOuter,
                isSelected && styles.radioOuterSelected,
            ]}>
                {isSelected && (
                    <View style={styles.radioInner} />
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
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
        fontWeight: '500',
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
});
