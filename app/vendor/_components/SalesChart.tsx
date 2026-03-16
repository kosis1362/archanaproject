import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { salesData as mockSales } from '@/mocks/data';

export function SalesChart() {
    const maxAmount = Math.max(...mockSales.map(d => d.amount));

    return (
        <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
                <View>
                    <Text style={styles.chartTitle}>Sales Overview</Text>
                    <Text style={styles.chartSubtitle}>Revenue performance</Text>
                </View>
                <View style={styles.chartTabs}>
                    <TouchableOpacity style={styles.chartTab}>
                        <Text style={styles.chartTabText}>Today</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.chartTab, styles.chartTabActive]}>
                        <Text style={styles.chartTabTextActive}>Week</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.chartTab}>
                        <Text style={styles.chartTabText}>Month</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.chartTab}>
                        <Text style={styles.chartTabText}>Year</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.chartArea}>
                <View style={styles.chartYAxis}>
                    <Text style={styles.chartYLabel}>रू60k</Text>
                    <Text style={styles.chartYLabel}>रू45k</Text>
                    <Text style={styles.chartYLabel}>रू30k</Text>
                    <Text style={styles.chartYLabel}>रू15k</Text>
                    <Text style={styles.chartYLabel}>रू0k</Text>
                </View>
                <View style={styles.chartBars}>
                    {mockSales.map((data, index) => (
                        <View key={index} style={styles.chartBarContainer}>
                            <View style={styles.chartBarWrapper}>
                                <View
                                    style={[
                                        styles.chartBar,
                                        { height: `${(data.amount / maxAmount) * 100}%` },
                                    ]}
                                />
                            </View>
                            <Text style={styles.chartXLabel}>{data.day}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    chartContainer: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    chartSubtitle: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    chartTabs: {
        flexDirection: 'row',
        backgroundColor: colors.borderLight,
        borderRadius: 8,
        padding: 2,
    },
    chartTab: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    chartTabActive: {
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    chartTabText: {
        fontSize: 11,
        color: colors.textSecondary,
    },
    chartTabTextActive: {
        fontSize: 11,
        color: colors.text,
        fontWeight: '500',
    },
    chartArea: {
        flexDirection: 'row',
        height: 180,
    },
    chartYAxis: {
        width: 40,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingRight: 8,
    },
    chartYLabel: {
        fontSize: 10,
        color: colors.textSecondary,
    },
    chartBars: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
    },
    chartBarContainer: {
        alignItems: 'center',
        flex: 1,
    },
    chartBarWrapper: {
        height: '100%',
        width: 24,
        justifyContent: 'flex-end',
    },
    chartBar: {
        width: '100%',
        backgroundColor: colors.cherryLight,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderWidth: 2,
        borderColor: colors.primary,
        borderBottomWidth: 0,
    },
    chartXLabel: {
        fontSize: 10,
        color: colors.textSecondary,
        marginTop: 8,
    },
});
