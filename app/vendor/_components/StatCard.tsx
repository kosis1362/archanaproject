import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface StatCardProps {
    title: string;
    value: string;
    change: number;
    icon: any;
    isHighlight?: boolean;
}

export function StatCard({ title, value, change, icon: Icon, isHighlight }: StatCardProps) {
    const isPositive = change >= 0;

    if (isHighlight) {
        return (
            <LinearGradient
                colors={['#B91C1C', '#DC2626']}
                style={styles.statCardHighlight}
            >
                <View style={styles.statHeader}>
                    <Text style={styles.statTitleLight}>{title}</Text>
                    <View style={styles.statIconContainerLight}>
                        <Icon size={18} color={colors.white} />
                    </View>
                </View>
                <Text style={styles.statValueLight}>{value}</Text>
                <View style={styles.statChangeRow}>
                    {isPositive ? (
                        <TrendingUp size={14} color="#86EFAC" />
                    ) : (
                        <TrendingDown size={14} color="#FCA5A5" />
                    )}
                    <Text style={[styles.statChangeLight, { color: isPositive ? '#86EFAC' : '#FCA5A5' }]}>
                        {isPositive ? '+' : ''}{change}% vs last week
                    </Text>
                </View>
            </LinearGradient>
        );
    }

    return (
        <View style={styles.statCard}>
            <View style={styles.statHeader}>
                <Text style={styles.statTitle}>{title}</Text>
                <View style={styles.statIconContainer}>
                    <Icon size={18} color={colors.primary} />
                </View>
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <View style={styles.statChangeRow}>
                {isPositive ? (
                    <TrendingUp size={14} color={colors.success} />
                ) : (
                    <TrendingDown size={14} color={colors.error} />
                )}
                <Text style={[styles.statChange, { color: isPositive ? colors.success : colors.error }]}>
                    {isPositive ? '+' : ''}{change}% vs last week
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    statCard: {
        flex: 1,
        minWidth: 150, // rough estimate replacing (width - 40) / 2
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 14,
        margin: 4,
    },
    statCardHighlight: {
        flex: 1,
        minWidth: 150, // rough estimate replacing (width - 40) / 2
        borderRadius: 12,
        padding: 14,
        margin: 4,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    statTitle: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    statTitleLight: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    statIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: colors.cherryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statIconContainerLight: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 4,
    },
    statValueLight: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.white,
        marginBottom: 4,
    },
    statChangeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statChange: {
        fontSize: 11,
    },
    statChangeLight: {
        fontSize: 11,
    },
});
