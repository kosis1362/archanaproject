import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Users, Clock } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export function PastSessionItem({ session }: { session: any }) {
    return (
        <View style={styles.pastSessionCard}>
            <Image
                source={{ uri: session.thumbnail_url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400' }}
                style={styles.pastThumbnail}
            />
            <View style={styles.pastInfo}>
                <Text style={styles.pastTitle} numberOfLines={1}>{session.title}</Text>
                <View style={styles.pastMeta}>
                    <Users size={12} color={colors.textSecondary} />
                    <Text style={styles.pastMetaText}>{session.viewer_count || 0} viewers</Text>
                    <Clock size={12} color={colors.textSecondary} />
                    <Text style={styles.pastMetaText}>{session.duration || 0}min</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
        fontWeight: '500',
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
});
