import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';

export function LiveSessionCard({ session }: { session: any }) {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <TouchableOpacity
            style={styles.liveCard}
            activeOpacity={0.9}
            onPress={() => router.push(`/live/${session.id}`)}
        >
            <Image source={{ uri: session.thumbnail_url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400' }} style={styles.liveThumbnail} />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.liveGradient}
            />
            <View style={styles.liveBadge}>
                <Animated.View style={[styles.liveDot, { transform: [{ scale: pulseAnim }] }]} />
                <Text style={styles.liveText}>LIVE</Text>
            </View>
            <View style={styles.liveViewers}>
                <Text style={styles.viewerCount}>{session.viewer_count || 0} watching</Text>
            </View>
            <View style={styles.liveInfo}>
                <Image source={{ uri: session.vendor_avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }} style={styles.vendorAvatar} />
                <View style={styles.liveDetails}>
                    <Text style={styles.liveTitle} numberOfLines={1}>{session.title}</Text>
                    <Text style={styles.vendorName}>{session.vendor_name || 'Vendor'}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    liveCard: {
        width: width * 0.7,
        height: 180,
        borderRadius: 16,
        overflow: 'hidden',
        marginRight: 12,
        backgroundColor: colors.black,
    },
    liveThumbnail: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    liveGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    liveBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        gap: 4,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.white,
    },
    liveText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.white,
    },
    liveViewers: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    viewerCount: {
        fontSize: 11,
        color: colors.white,
        fontWeight: '500',
    },
    liveInfo: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    vendorAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: colors.white,
    },
    liveDetails: {
        marginLeft: 10,
        flex: 1,
    },
    liveTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.white,
    },
    vendorName: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
});
