import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Video, Calendar, Clock } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export function ScheduledSessionItem({ session }: { session: any }) {
    return (
        <View style={styles.scheduledCard}>
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
    );
}

const styles = StyleSheet.create({
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
        fontWeight: '500',
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
        borderColor: colors.borderLight,
    },
    editButtonText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.text,
    },
});
