import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Wallet, TrendingUp, ArrowDownRight, ArrowUpRight, Clock, CheckCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';

const transactions = [
    { id: 't1', type: 'credit', amount: 12500, description: 'Order #O125 payment', date: '2024-01-20', status: 'completed' },
    { id: 't2', type: 'debit', amount: 500, description: 'Platform commission', date: '2024-01-20', status: 'completed' },
    { id: 't3', type: 'credit', amount: 8700, description: 'Order #O124 payment', date: '2024-01-19', status: 'completed' },
    { id: 't4', type: 'withdrawal', amount: 25000, description: 'Bank withdrawal', date: '2024-01-18', status: 'processing' },
    { id: 't5', type: 'credit', amount: 15400, description: 'Order #O123 payment', date: '2024-01-17', status: 'completed' },
];

export default function VendorEarningsScreen() {
    const [activeTab, setActiveTab] = useState('all');

    const filteredTransactions = activeTab === 'all'
        ? transactions
        : transactions.filter(t => t.type === activeTab);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Earnings</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.balanceCard}>
                    <LinearGradient
                        colors={['#B91C1C', '#DC2626']}
                        style={styles.balanceGradient}
                    >
                        <View style={styles.balanceHeader}>
                            <View style={styles.walletIcon}>
                                <Wallet size={24} color={colors.white} />
                            </View>
                            <View style={styles.balanceChange}>
                                <TrendingUp size={16} color="#86EFAC" />
                                <Text style={styles.balanceChangeText}>+18.5% this month</Text>
                            </View>
                        </View>
                        <Text style={styles.balanceLabel}>Available Balance</Text>
                        <Text style={styles.balanceAmount}>रू 1,24,500</Text>
                        <View style={styles.balanceActions}>
                            <TouchableOpacity style={styles.withdrawButton}>
                                <Text style={styles.withdrawButtonText}>Withdraw</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.historyButton}>
                                <Text style={styles.historyButtonText}>View History</Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>

                <View style={styles.summaryRow}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>This Month</Text>
                        <Text style={styles.summaryValue}>रू 86,450</Text>
                        <View style={styles.summaryChange}>
                            <ArrowUpRight size={14} color={colors.success} />
                            <Text style={[styles.summaryChangeText, { color: colors.success }]}>+12.3%</Text>
                        </View>
                    </View>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Pending</Text>
                        <Text style={styles.summaryValue}>रू 18,200</Text>
                        <View style={styles.summaryChange}>
                            <Clock size={14} color={colors.warning} />
                            <Text style={[styles.summaryChangeText, { color: colors.warning }]}>3 orders</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Transactions</Text>

                    <View style={styles.tabsContainer}>
                        {[
                            { key: 'all', label: 'All' },
                            { key: 'credit', label: 'Earnings' },
                            { key: 'debit', label: 'Deductions' },
                            { key: 'withdrawal', label: 'Withdrawals' },
                        ].map(tab => (
                            <TouchableOpacity
                                key={tab.key}
                                style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                                onPress={() => setActiveTab(tab.key)}
                            >
                                <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {filteredTransactions.map(transaction => (
                        <View key={transaction.id} style={styles.transactionItem}>
                            <View style={[
                                styles.transactionIcon,
                                {
                                    backgroundColor: transaction.type === 'credit'
                                        ? '#D1FAE5'
                                        : transaction.type === 'debit'
                                            ? '#FEE2E2'
                                            : '#FEF3C7',
                                },
                            ]}>
                                {transaction.type === 'credit' ? (
                                    <ArrowDownRight size={18} color={colors.success} />
                                ) : transaction.type === 'debit' ? (
                                    <ArrowUpRight size={18} color={colors.error} />
                                ) : (
                                    <Wallet size={18} color={colors.warning} />
                                )}
                            </View>
                            <View style={styles.transactionInfo}>
                                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                                <View style={styles.transactionMeta}>
                                    <Text style={styles.transactionDate}>{transaction.date}</Text>
                                    <View style={[
                                        styles.transactionStatus,
                                        { backgroundColor: transaction.status === 'completed' ? '#D1FAE5' : '#FEF3C7' },
                                    ]}>
                                        {transaction.status === 'completed' ? (
                                            <CheckCircle size={10} color={colors.success} />
                                        ) : (
                                            <Clock size={10} color={colors.warning} />
                                        )}
                                        <Text style={[
                                            styles.transactionStatusText,
                                            { color: transaction.status === 'completed' ? colors.success : colors.warning },
                                        ]}>
                                            {transaction.status}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <Text style={[
                                styles.transactionAmount,
                                {
                                    color: transaction.type === 'credit'
                                        ? colors.success
                                        : transaction.type === 'debit'
                                            ? colors.error
                                            : colors.text,
                                },
                            ]}>
                                {transaction.type === 'credit' ? '+' : '-'}रू{transaction.amount.toLocaleString()}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>💰 Payment Info</Text>
                    <Text style={styles.infoText}>• Earnings are settled every Monday</Text>
                    <Text style={styles.infoText}>• Platform commission: 5% per order</Text>
                    <Text style={styles.infoText}>• Minimum withdrawal: रू500</Text>
                    <Text style={styles.infoText}>• Bank transfer takes 2-3 business days</Text>
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
    content: {
        flex: 1,
        padding: 16,
    },
    balanceCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
    },
    balanceGradient: {
        padding: 20,
    },
    balanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    walletIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    balanceChange: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    balanceChangeText: {
        fontSize: 12,
        color: '#86EFAC',
        fontWeight: '500' as const,
    },
    balanceLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
    },
    balanceAmount: {
        fontSize: 36,
        fontWeight: '700' as const,
        color: colors.white,
        marginTop: 4,
        marginBottom: 20,
    },
    balanceActions: {
        flexDirection: 'row',
        gap: 12,
    },
    withdrawButton: {
        flex: 1,
        backgroundColor: colors.white,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    withdrawButtonText: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.primary,
    },
    historyButton: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    historyButtonText: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.white,
    },
    summaryRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
    },
    summaryLabel: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    summaryValue: {
        fontSize: 20,
        fontWeight: '700' as const,
        color: colors.text,
        marginTop: 4,
    },
    summaryChange: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 6,
    },
    summaryChangeText: {
        fontSize: 12,
        fontWeight: '500' as const,
    },
    section: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: colors.text,
        marginBottom: 12,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: colors.borderLight,
        borderRadius: 10,
        padding: 4,
        marginBottom: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: colors.white,
    },
    tabText: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '500' as const,
    },
    tabTextActive: {
        color: colors.text,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    transactionIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    transactionInfo: {
        flex: 1,
        marginLeft: 12,
    },
    transactionDescription: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: colors.text,
    },
    transactionMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    transactionDate: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    transactionStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 3,
    },
    transactionStatusText: {
        fontSize: 10,
        fontWeight: '500' as const,
    },
    transactionAmount: {
        fontSize: 15,
        fontWeight: '700' as const,
    },
    infoCard: {
        backgroundColor: colors.cherryLight,
        borderRadius: 12,
        padding: 16,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.primary,
        marginBottom: 10,
    },
    infoText: {
        fontSize: 13,
        color: colors.primaryDark,
        marginBottom: 6,
    },
    bottomPadding: {
        height: 20,
    },
});
