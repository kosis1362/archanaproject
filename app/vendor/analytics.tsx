import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, Users, Eye, ShoppingCart, Star, PieChart as PieIcon, BarChart } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { salesData, products } from '@/mocks/data';

const { width } = Dimensions.get('window');

const timeFilters = ['Today', 'Week', 'Month', 'Year'];

// Simulation of data for different time periods
const salesPeriodData = {
    'Today': [
        { label: '8am', value: 2400 },
        { label: '11am', value: 4500 },
        { label: '2pm', value: 3800 },
        { label: '5pm', value: 5200 },
        { label: '8pm', value: 6100 },
    ],
    'Week': salesData.map(d => ({ label: d.day, value: d.amount })),
    'Month': [
        { label: 'W1', value: 24000 },
        { label: 'W2', value: 18000 },
        { label: 'W3', value: 32000 },
        { label: 'W4', value: 28000 },
    ],
    'Year': [
        { label: 'Q1', value: 120000 },
        { label: 'Q2', value: 150000 },
        { label: 'Q3', value: 110000 },
        { label: 'Q4', value: 180000 },
    ]
};

const topProductShare = products.slice(0, 5).map((p, i) => ({
    name: p.name,
    share: [35, 25, 20, 15, 5][i],
    color: ['#B91C1C', '#EA580C', '#F59E0B', '#FCD34D', '#FEF3C7'][i]
}));

function PieChart() {
    return (
        <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
                <PieIcon size={20} color={colors.primary} />
                <Text style={styles.chartTitle}>Product Sales Distribution</Text>
            </View>
            <View style={styles.pieContainer}>
                <View style={styles.pieMock}>
                    {/* Visual representation of segments */}
                    {topProductShare.map((item, index) => (
                        <View
                            key={index}
                            style={[
                                styles.pieSegment,
                                {
                                    width: `${item.share}%`,
                                    backgroundColor: item.color,
                                    height: 30 + (index * 5) // Slightly varying heights for visual interest
                                }
                            ]}
                        />
                    ))}
                </View>
                <View style={styles.legendContainer}>
                    {topProductShare.map((item, index) => (
                        <View key={index} style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                            <Text style={styles.legendText} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.legendPercentage}>{item.share}%</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

export default function VendorAnalyticsScreen() {
    const [activeFilter, setActiveFilter] = useState('Week');
    const currentData = salesPeriodData[activeFilter as keyof typeof salesPeriodData];
    const maxValue = Math.max(...currentData.map(d => d.value));

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Analytics</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
                {timeFilters.map(filter => (
                    <TouchableOpacity
                        key={filter}
                        style={[styles.filterButton, activeFilter === filter && styles.filterButtonActive]}
                        onPress={() => setActiveFilter(filter)}
                    >
                        <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <BarChart size={20} color={colors.primary} />
                        <Text style={styles.chartTitle}>{activeFilter} Sales Overview</Text>
                    </View>
                    <View style={styles.unifiedChartContainer}>
                        {currentData.map((data, index) => (
                            <View key={index} style={styles.barContainer}>
                                <View style={styles.barWrapper}>
                                    <View
                                        style={[
                                            styles.bar,
                                            { height: `${(data.value / maxValue) * 100}%` },
                                        ]}
                                    />
                                </View>
                                <Text style={styles.barLabel}>{data.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <PieChart />

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
    filterContainer: {
        backgroundColor: colors.white,
        paddingHorizontal: 12,
        paddingVertical: 12,
        maxHeight: 70,
    },
    filterButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginHorizontal: 4,
        borderRadius: 20,
        backgroundColor: colors.borderLight,
    },
    filterButtonActive: {
        backgroundColor: colors.primary,
    },
    filterText: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '600' as const,
    },
    filterTextActive: {
        color: colors.white,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    chartCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    chartHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: colors.text,
    },
    unifiedChartContainer: {
        flexDirection: 'row',
        height: 180,
        alignItems: 'flex-end',
        justifyContent: 'space-around',
    },
    barContainer: {
        alignItems: 'center',
        flex: 1,
    },
    barWrapper: {
        height: '100%',
        width: 30,
        justifyContent: 'flex-end',
    },
    bar: {
        width: '100%',
        backgroundColor: colors.primary,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
    },
    barLabel: {
        fontSize: 11,
        color: colors.textSecondary,
        marginTop: 10,
        fontWeight: '500' as const,
    },
    pieContainer: {
        flexDirection: 'column',
    },
    pieMock: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        backgroundColor: colors.borderLight,
        borderRadius: 30,
        overflow: 'hidden',
        marginBottom: 20,
        paddingHorizontal: 2,
    },
    pieSegment: {
        height: '100%',
        marginHorizontal: 1,
        borderRadius: 4,
    },
    legendContainer: {
        gap: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendText: {
        flex: 1,
        fontSize: 14,
        color: colors.text,
    },
    legendPercentage: {
        fontSize: 14,
        fontWeight: '700' as const,
        color: colors.text,
    },
    bottomPadding: {
        height: 40,
    },
});
