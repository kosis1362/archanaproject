import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Modal,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Radio, Play, Calendar, Users, Clock, Plus, Video, X, Square } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { ScheduledSessionItem } from '@/app/vendor/_components/ScheduledSessionItem';
import { PastSessionItem } from '@/app/vendor/_components/PastSessionItem';
import { StartLiveModal } from '@/app/vendor/_components/StartLiveModal';

const scheduledSessions = [
    { id: 's1', title: 'Festival Special Collection', date: '2024-01-25', time: '14:00', products: 12 },
    { id: 's2', title: 'New Arrivals Showcase', date: '2024-01-27', time: '16:00', products: 8 },
];

export default function VendorLiveScreen() {
    const { user } = useAuth();
    const [pastSessions, setPastSessions] = useState<any[]>([]);
    const [activeSession, setActiveSession] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // UI State
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isStarting, setIsStarting] = useState(false);
    const [sessionTitle, setSessionTitle] = useState('');

    const checkActiveSession = () => {
        if (!user?.id) return;
        // Mock active session hook
        setActiveSession(null);
        return () => { };
    };

    useEffect(() => {
        let unsubscribe: any;
        if (user) {
            fetchSessions();
            unsubscribe = checkActiveSession();
        }
        return () => unsubscribe && unsubscribe();
    }, [user]);

    const fetchSessions = async () => {
        if (!user?.id) return;
        try {
            setIsLoading(true);
            await new Promise(r => setTimeout(r, 500));
            setPastSessions([]);
        } catch (error) {
            console.error('Error fetching past sessions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const startSession = async () => {
        if (!sessionTitle.trim()) {
            Alert.alert('Error', 'Please enter a session title');
            return;
        }

        try {
            setIsStarting(true);
            await new Promise(r => setTimeout(r, 1000));

            const sessionData = {
                id: 'mock-session-id',
                vendorId: user?.id,
                vendorName: user?.name,
                title: sessionTitle,
                isLive: true,
                startedAt: new Date().toISOString(),
                viewerCount: 0,
            };

            setActiveSession(sessionData);

            setIsModalVisible(false);
            setSessionTitle('');
            Alert.alert('Success', 'You are now live!');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsStarting(false);
        }
    };

    const stopSession = async () => {
        if (!activeSession) return;

        try {
            await new Promise(r => setTimeout(r, 500));
            setActiveSession(null);
            fetchSessions();
            Alert.alert('Success', 'Live session ended.');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };
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
                {activeSession ? (
                    <View style={styles.activeSessionCard}>
                        <LinearGradient
                            colors={['#10B981', '#059669']}
                            style={styles.goLiveGradient}
                        >
                            <View style={styles.liveIndicatorRow}>
                                <View style={styles.liveDot} />
                                <Text style={styles.liveLabelText}>ACTIVE NOW</Text>
                            </View>
                            <Text style={styles.goLiveTitle}>{activeSession.title}</Text>
                            <Text style={styles.goLiveText}>You are currently streaming live</Text>
                            <TouchableOpacity style={styles.stopButton} onPress={stopSession}>
                                <Square size={18} color={colors.error} fill={colors.error} />
                                <Text style={styles.stopButtonText}>End Session</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.goLiveCard} onPress={() => setIsModalVisible(true)}>
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
                )}

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Scheduled Sessions</Text>
                        <TouchableOpacity>
                            <Plus size={20} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                    {scheduledSessions.map(session => (
                        <ScheduledSessionItem key={session.id} session={session} />
                    ))}
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Past Sessions</Text>
                    </View>
                    {isLoading ? (
                        <ActivityIndicator color={colors.primary} />
                    ) : pastSessions.length === 0 ? (
                        <Text style={styles.emptyText}>No past sessions found.</Text>
                    ) : (
                        pastSessions.map(session => (
                            <PastSessionItem key={session.id} session={session} />
                        ))
                    )}
                </View>

                {/* Start Session Modal */}
                <StartLiveModal
                    visible={isModalVisible}
                    isStarting={isStarting}
                    sessionTitle={sessionTitle}
                    onClose={() => setIsModalVisible(false)}
                    onTitleChange={setSessionTitle}
                    onSubmit={startSession}
                />

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
    // Active Session Styles
    activeSessionCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
    },
    liveIndicatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 8,
        marginBottom: 16,
    },
    liveDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FF0000',
    },
    liveLabelText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '700' as const,
    },
    stopButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    stopButtonText: {
        fontSize: 15,
        fontWeight: '600' as const,
        color: colors.error,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: colors.text,
    },
    inputLabel: {
        fontSize: 14,
        color: colors.text,
        fontWeight: '600' as const,
        marginBottom: 8,
    },
    input: {
        backgroundColor: colors.background,
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        borderColor: colors.borderLight,
        borderWidth: 1,
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600' as const,
    },
    emptyText: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 20,
    },
});
