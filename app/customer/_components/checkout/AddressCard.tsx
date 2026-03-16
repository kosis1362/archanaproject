import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface AddressCardProps {
    address: string;
    title?: string;
    onPress?: () => void;
}

export function AddressCard({ address, title = 'Home', onPress }: AddressCardProps) {
    return (
        <TouchableOpacity style={styles.addressCard} onPress={onPress}>
            <View style={styles.addressInfo}>
                <Text style={styles.addressName}>{title}</Text>
                <Text style={styles.addressText}>{address}</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
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
        fontWeight: '600',
        color: colors.text,
    },
    addressText: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 2,
    },
});
