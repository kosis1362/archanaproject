import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Radio, ChevronLeft, MapPin } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

const { width } = Dimensions.get('window');

function LiveSessionCard({ session }: { session: any }) {
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
            <View style={styles.thumbnailContainer}>
                <Image
                    source={{ uri: session.thumbnail_url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400' }}
                    style={styles.liveThumbnail}
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.liveGradient}
                />

                <View style={styles.topBadges}>
                    <View style={styles.liveBadge}>
                        <Animated.View style={[styles.liveDot, { transform: [{ scale: pulseAnim }] }]} />
                        <Text style={styles.liveText}>LIVE</Text>
                    </View>
                    <View style={styles.viewersBadge}>
                        <Text style={styles.viewerCount}>{session.viewer_count || 0} watching</Text>
                    </View>
                </View>

                <View style={styles.liveInfo}>
                    <Text style={styles.liveTitle} numberOfLines={2}>{session.title}</Text>
                    <View style={styles.vendorRow}>
                        <Image
                            source={{ uri: session.vendor_avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }}
                            style={styles.vendorAvatar}
                        />
                        <Text style={styles.vendorName}>{session.vendor_name || 'Vendor'}</Text>
                        {session.location && (
                            <View style={styles.locationContainer}>
                                <MapPin size={10} color="rgba(255,255,255,0.7)" />
                                <Text style={styles.locationText}>{session.location}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default function LiveMarketplace() {
    const { t } = useLanguage();
    const [liveSessions, setLiveSessions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLiveSessions();
    }, []);

    const fetchLiveSessions = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('live_sessions')
                .select('*')
                .eq('is_live', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setLiveSessions(data || []);
        } catch (error) {
            console.error('Error fetching live sessions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.headerTitleRow}>
                    <Radio size={20} color={colors.primary} />
                    <Text style={styles.headerTitle}>Live Marketplace</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Fetching live shows...</Text>
                </View>
            ) : liveSessions.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Radio size={64} color={colors.border} />
                    <Text style={styles.emptyTitle}>No Live Shows Right Now</Text>
                    <Text style={styles.emptySubtitle}>Check back later or browse upcoming events.</Text>
                    <TouchableOpacity
                        style={styles.browseButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.browseButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={liveSessions}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <LiveSessionCard session={item} />}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    onRefresh={fetchLiveSessions}
                    refreshing={false}
                />
            )}
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    listContent: {
        padding: 16,
    },
    liveCard: {
        marginBottom: 20,
        borderRadius: 20,
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        overflow: 'hidden',
    },
    thumbnailContainer: {
        height: 220,
        position: 'relative',
    },
    liveThumbnail: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    liveGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    topBadges: {
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        gap: 6,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.white,
    },
    liveText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.white,
    },
    viewersBadge: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
    },
    viewerCount: {
        fontSize: 12,
        color: colors.white,
        fontWeight: '600',
    },
    liveInfo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
    },
    liveTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 8,
    },
    vendorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    vendorAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: colors.white,
    },
    vendorName: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.white,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginLeft: 8,
    },
    locationText: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.7)',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: colors.textSecondary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 20,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 30,
    },
    browseButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 12,
    },
    browseButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
