import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Radio, Play, Calendar, Users, Clock, Plus, Video } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { liveSessions } from '@/mocks/data';

const scheduledSessions = [
    { id: 's1', title: 'Festival Special Collection', date: '2024-01-25', time: '14:00', products: 12 },
    { id: 's2', title: 'New Arrivals Showcase', date: '2024-01-27', time: '16:00', products: 8 },
];

export default function VendorLiveScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Live Sessions</Text>
                <TouchableOpacity style={styles.scheduleButton}>
                    <Calendar size={16} color={colors.primary} />
                    <Text style={styles.scheduleButtonText}>Schedule</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.goLiveCard}>
                    <LinearGradient
                        colors={['#B91C1C', '#DC2626']}
                        style={styles.goLiveGradient}
                    >
                        <View style={styles.goLiveIcon}>
                            <Radio size={32} color={colors.white} />
                        </View>
                        <Text style={styles.goLiveTitle}>Go Live Now</Text>
                        <Text style={styles.goLiveText}>Start streaming to your customers</Text>
                        <View style={styles.goLiveButton}>
                            <Play size={18} color={colors.primary} fill={colors.primary} />
                            <Text style={styles.goLiveButtonText}>Start Live Session</Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Scheduled Sessions</Text>
                        <TouchableOpacity>
                            <Plus size={20} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                    {scheduledSessions.map(session => (
                        <View key={session.id} style={styles.scheduledCard}>
                            <View style={styles.scheduledIcon}>
                                <Video size={20} color={colors.primary} />
                            </View>
                            <View style={styles.scheduledInfo}>
                                <Text style={styles.scheduledTitle}>{session.title}</Text>
                                <View style={styles.scheduledMeta}>
                                    <Calendar size={12} color={colors.textSecondary} />
                                    <Text style={styles.scheduledMetaText}>{session.date}</Text>
                                    <Clock size={12} color={colors.textSecondary} />
                                    <Text style={styles.scheduledMetaText}>{session.time}</Text>
                                </View>
                                <Text style={styles.scheduledProducts}>{session.products} products selected</Text>
                            </View>
                            <TouchableOpacity style={styles.editButton}>
                                <Text style={styles.editButtonText}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Past Sessions</Text>
                    </View>
                    {liveSessions.map(session => (
                        <View key={session.id} style={styles.pastSessionCard}>
                            <Image source={{ uri: session.thumbnail }} style={styles.pastThumbnail} />
                            <View style={styles.pastInfo}>
                                <Text style={styles.pastTitle} numberOfLines={1}>{session.title}</Text>
                                <View style={styles.pastMeta}>
                                    <Users size={12} color={colors.textSecondary} />
                                    <Text style={styles.pastMetaText}>{session.viewerCount} viewers</Text>
                                    <Clock size={12} color={colors.textSecondary} />
                                    <Text style={styles.pastMetaText}>{session.duration}min</Text>
                                </View>
                                <View style={styles.pastStats}>
                                    <View style={styles.pastStatItem}>
                                        <Text style={styles.pastStatValue}>12</Text>
                                        <Text style={styles.pastStatLabel}>Orders</Text>
                                    </View>
                                    <View style={styles.pastStatItem}>
                                        <Text style={styles.pastStatValue}>रू24.5k</Text>
                                        <Text style={styles.pastStatLabel}>Revenue</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.tipsCard}>
                    <Text style={styles.tipsTitle}>💡 Live Streaming Tips</Text>
                    <Text style={styles.tipItem}>• Go live during peak hours (6-9 PM)</Text>
                    <Text style={styles.tipItem}>• Prepare products to showcase beforehand</Text>
                    <Text style={styles.tipItem}>• Engage with viewers' questions</Text>
                    <Text style={styles.tipItem}>• Use good lighting and stable camera</Text>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    scheduleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.cherryLight,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    scheduleButtonText: {
        fontSize: 13,
        fontWeight: '500' as const,
        color: colors.primary,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    goLiveCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
    },
    goLiveGradient: {
        padding: 24,
        alignItems: 'center',
    },
    goLiveIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    goLiveTitle: {
        fontSize: 22,
        fontWeight: '700' as const,
        color: colors.white,
        marginBottom: 8,
    },
    goLiveText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 20,
    },
    goLiveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    goLiveButtonText: {
        fontSize: 15,
        fontWeight: '600' as const,
        color: colors.primary,
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: colors.text,
    },
    scheduledCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
    },
    scheduledIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: colors.cherryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scheduledInfo: {
        flex: 1,
        marginLeft: 12,
    },
    scheduledTitle: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: colors.text,
    },
    scheduledMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    scheduledMetaText: {
        fontSize: 12,
        color: colors.textSecondary,
        marginRight: 8,
    },
    scheduledProducts: {
        fontSize: 11,
        color: colors.primary,
        marginTop: 4,
    },
    editButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.border,
    },
    editButtonText: {
        fontSize: 12,
        fontWeight: '500' as const,
        color: colors.text,
    },
    pastSessionCard: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 10,
    },
    pastThumbnail: {
        width: 100,
        height: 100,
    },
    pastInfo: {
        flex: 1,
        padding: 12,
    },
    pastTitle: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: colors.text,
        marginBottom: 6,
    },
    pastMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },
    pastMetaText: {
        fontSize: 11,
        color: colors.textSecondary,
        marginRight: 8,
    },
    pastStats: {
        flexDirection: 'row',
        gap: 16,
    },
    pastStatItem: {},
    pastStatValue: {
        fontSize: 14,
        fontWeight: '700' as const,
        color: colors.primary,
    },
    pastStatLabel: {
        fontSize: 10,
        color: colors.textSecondary,
    },
    tipsCard: {
        backgroundColor: colors.cherryLight,
        borderRadius: 12,
        padding: 16,
    },
    tipsTitle: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.primary,
        marginBottom: 10,
    },
    tipItem: {
        fontSize: 13,
        color: colors.primaryDark,
        marginBottom: 6,
    },
    bottomPadding: {
        height: 20,
    },
});
