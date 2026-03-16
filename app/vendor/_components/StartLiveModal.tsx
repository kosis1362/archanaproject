import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface StartLiveModalProps {
    visible: boolean;
    isStarting: boolean;
    sessionTitle: string;
    onClose: () => void;
    onTitleChange: (title: string) => void;
    onSubmit: () => void;
}

export function StartLiveModal({ visible, isStarting, sessionTitle, onClose, onTitleChange, onSubmit }: StartLiveModalProps) {
    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>New Live Session</Text>
                        <TouchableOpacity onPress={onClose} disabled={isStarting}>
                            <X size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.inputLabel}>Session Title</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="What will you talk about?"
                        value={sessionTitle}
                        onChangeText={onTitleChange}
                        maxLength={100}
                        editable={!isStarting}
                    />

                    <TouchableOpacity
                        style={[styles.submitButton, isStarting && styles.submitButtonDisabled]}
                        onPress={onSubmit}
                        disabled={isStarting}
                    >
                        {isStarting ? (
                            <ActivityIndicator color={colors.white} />
                        ) : (
                            <Text style={styles.submitButtonText}>Start Streaming</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
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
        fontWeight: '700',
        color: colors.text,
    },
    inputLabel: {
        fontSize: 14,
        color: colors.text,
        fontWeight: '600',
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
        fontWeight: '600',
    },
});
