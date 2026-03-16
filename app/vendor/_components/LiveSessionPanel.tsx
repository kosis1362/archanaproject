import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Radio, Eye } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export const LiveSessionPanel = ({ vendorId }: { vendorId: string }) => {
    const [liveSession, setLiveSession] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        if (!vendorId) return;
        setLiveSession(null);
    }, [vendorId]);

    if (!liveSession) return null;

    return (
        <View style={styles.liveSessionCard}>
            <LinearGradient
                colors={['#B91C1C', '#F59E0B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.liveGradient}
            >
                <View style={styles.liveHeader}>
                    <View style={styles.liveStatusBadge}>
                        <Radio size={12} color={colors.white} />
                        <Text style={styles.liveStatusBadgeText}>LIVE</Text>
                    </View>
                    <View style={styles.viewerBadge}>
                        <Eye size={12} color={colors.white} />
                        <Text style={styles.viewerText}>{liveSession.viewerCount || 0}</Text>
                    </View>
                </View>
                <Text style={styles.liveTitle} numberOfLines={1}>{liveSession.title}</Text>
                <TouchableOpacity
                    style={styles.joinButton}
                    onPress={() => router.push('/vendor/live')}
                >
                    <Text style={styles.joinButtonText}>Manage Session</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    liveSessionCard: {
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    liveGradient: {
        padding: 16,
    },
    liveHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    liveStatusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    liveStatusBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.white,
    },
    viewerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    viewerText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.white,
    },
    liveTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.white,
        marginBottom: 16,
    },
    joinButton: {
        backgroundColor: colors.white,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    joinButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary,
    },
});
