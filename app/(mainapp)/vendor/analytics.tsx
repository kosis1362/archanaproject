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
import { TrendingUp, TrendingDown, Users, Eye, ShoppingCart, Star } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { salesData } from '@/mocks/data';

const { width } = Dimensions.get('window');

const timeFilters = ['Today', 'Week', 'Month', 'Year'];

const analyticsData = {
    pageViews: { value: 12450, change: 18.7 },
    uniqueVisitors: { value: 8234, change: 12.3 },
    conversionRate: { value: 3.2, change: -0.5 },
    avgOrderValue: { value: 2450, change: 8.4 },
    productViews: [
        { name: 'Kundan Necklace', views: 1234 },
        { name: 'Pottery Vase', views: 987 },
        { name: 'Pashmina Shawl', views: 856 },
        { name: 'Brass Diya Set', views: 743 },
    ],
    trafficSources: [
        { source: 'Direct', percentage: 45 },
        { source: 'Search', percentage: 28 },
        { source: 'Social', percentage: 18 },
        { source: 'Referral', percentage: 9 },
    ],
};

function MetricCard({ title, value, change, icon: Icon, suffix }: {
    title: string;
    value: string | number;
    change: number;
    icon: any;
    suffix?: string;
}) {
    const isPositive = change >= 0;

    return (
        <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
                <View style={styles.metricIconContainer}>
                    <Icon size={18} color={colors.primary} />
                </View>
                <View style={styles.changeContainer}>
                    {isPositive ? (
                        <TrendingUp size={14} color={colors.success} />
                    ) : (
                        <TrendingDown size={14} color={colors.error} />
                    )}
                    <Text style={[styles.changeText, { color: isPositive ? colors.success : colors.error }]}>
                        {isPositive ? '+' : ''}{change}%
                    </Text>
                </View>
            </View>
            <Text style={styles.metricValue}>{value}{suffix}</Text>
            <Text style={styles.metricTitle}>{title}</Text>
        </View>
    );
}

export default function VendorAnalyticsScreen() {
    const [activeFilter, setActiveFilter] = useState('Week');
    const maxSales = Math.max(...salesData.map(d => d.amount));

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
                <View style={styles.metricsGrid}>
                    <MetricCard
                        title="Page Views"
                        value={analyticsData.pageViews.value.toLocaleString()}
                        change={analyticsData.pageViews.change}
                        icon={Eye}
                    />
                    <MetricCard
                        title="Unique Visitors"
                        value={analyticsData.uniqueVisitors.value.toLocaleString()}
                        change={analyticsData.uniqueVisitors.change}
                        icon={Users}
                    />
                    <MetricCard
                        title="Conversion Rate"
                        value={analyticsData.conversionRate.value}
                        change={analyticsData.conversionRate.change}
                        icon={ShoppingCart}
                        suffix="%"
                    />
                    <MetricCard
                        title="Avg Order Value"
                        value={`रू${analyticsData.avgOrderValue.value.toLocaleString()}`}
                        change={analyticsData.avgOrderValue.change}
                        icon={Star}
                    />
                </View>

                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Sales Trend</Text>
                    <View style={styles.chartContainer}>
                        {salesData.map((data, index) => (
                            <View key={index} style={styles.barContainer}>
                                <View style={styles.barWrapper}>
                                    <View
                                        style={[
                                            styles.bar,
                                            { height: `${(data.amount / maxSales) * 100}%` },
                                        ]}
                                    />
                                </View>
                                <Text style={styles.barLabel}>{data.day}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Top Viewed Products</Text>
                    {analyticsData.productViews.map((product, index) => (
                        <View key={index} style={styles.productViewItem}>
                            <Text style={styles.productRank}>{index + 1}</Text>
                            <Text style={styles.productViewName}>{product.name}</Text>
                            <Text style={styles.productViewCount}>{product.views.toLocaleString()} views</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Traffic Sources</Text>
                    <View style={styles.trafficContainer}>
                        {analyticsData.trafficSources.map((source, index) => (
                            <View key={index} style={styles.trafficItem}>
                                <View style={styles.trafficInfo}>
                                    <View style={[styles.trafficDot, { backgroundColor: ['#B91C1C', '#F59E0B', '#10B981', '#3B82F6'][index] }]} />
                                    <Text style={styles.trafficSource}>{source.source}</Text>
                                </View>
                                <Text style={styles.trafficPercentage}>{source.percentage}%</Text>
                            </View>
                        ))}
                        <View style={styles.trafficBar}>
                            {analyticsData.trafficSources.map((source, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.trafficBarSegment,
                                        {
                                            width: `${source.percentage}%`,
                                            backgroundColor: ['#B91C1C', '#F59E0B', '#10B981', '#3B82F6'][index],
                                        },
                                    ]}
                                />
                            ))}
                        </View>
                    </View>
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
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 4,
        borderRadius: 20,
        backgroundColor: colors.borderLight,
    },
    filterButtonActive: {
        backgroundColor: colors.primary,
    },
    filterText: {
        fontSize: 13,
        color: colors.textSecondary,
        fontWeight: '500' as const,
    },
    filterTextActive: {
        color: colors.white,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
        marginBottom: 16,
    },
    metricCard: {
        width: (width - 40) / 2,
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 14,
        margin: 4,
    },
    metricHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    metricIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: colors.cherryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    changeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    changeText: {
        fontSize: 11,
        fontWeight: '600' as const,
    },
    metricValue: {
        fontSize: 22,
        fontWeight: '700' as const,
        color: colors.text,
    },
    metricTitle: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    chartCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: colors.text,
        marginBottom: 16,
    },
    chartContainer: {
        flexDirection: 'row',
        height: 150,
        alignItems: 'flex-end',
        justifyContent: 'space-around',
    },
    barContainer: {
        alignItems: 'center',
        flex: 1,
    },
    barWrapper: {
        height: '100%',
        width: 24,
        justifyContent: 'flex-end',
    },
    bar: {
        width: '100%',
        backgroundColor: colors.primary,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    barLabel: {
        fontSize: 10,
        color: colors.textSecondary,
        marginTop: 8,
    },
    section: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: colors.text,
        marginBottom: 12,
    },
    productViewItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    productRank: {
        width: 24,
        fontSize: 14,
        fontWeight: '700' as const,
        color: colors.primary,
    },
    productViewName: {
        flex: 1,
        fontSize: 14,
        color: colors.text,
    },
    productViewCount: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    trafficContainer: {},
    trafficItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    trafficInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    trafficDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    trafficSource: {
        fontSize: 14,
        color: colors.text,
    },
    trafficPercentage: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.text,
    },
    trafficBar: {
        flexDirection: 'row',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        marginTop: 12,
    },
    trafficBarSegment: {
        height: '100%',
    },
    bottomPadding: {
        height: 20,
    },
});
