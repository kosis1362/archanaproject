import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '@/constants/colors';

export function VendorListCard({ vendor }: { vendor: any }) {
    return (
        <TouchableOpacity style={styles.vendorItem}>
            <Image source={{ uri: vendor.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' }} style={styles.vendorAvatar} />
            <View style={styles.vendorInfo}>
                <Text style={styles.vendorNameText}>{vendor.full_name || 'Vendor'}</Text>
                <Text style={styles.vendorRole}>Member since {new Date(vendor.created_at).getFullYear()}</Text>
            </View>
            <TouchableOpacity style={styles.visitButton}>
                <Text style={styles.visitButtonText}>Visit Store</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    vendorItem: {
        flexDirection: 'row',
        alignItems: 'center',
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
    vendorAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    vendorInfo: {
        flex: 1,
        marginLeft: 12,
    },
    vendorNameText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    vendorRole: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    visitButton: {
        backgroundColor: colors.cherryLight,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    visitButtonText: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: 'bold',
    },
});
