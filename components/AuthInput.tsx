import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface AuthInputProps extends TextInputProps {
    icon?: React.ReactNode;
    secureTextEntry?: boolean;
    showPassword?: boolean;
    onTogglePassword?: () => void;
}

export const AuthInput = ({
    icon,
    secureTextEntry,
    showPassword,
    onTogglePassword,
    ...props
}: AuthInputProps) => {
    return (
        <View style={styles.inputContainer}>
            {icon && <View style={styles.inputIcon}>{icon}</View>}

            <TextInput
                style={styles.input}
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={secureTextEntry && !showPassword}
                {...props}
            />

            {secureTextEntry !== undefined && onTogglePassword && (
                <TouchableOpacity onPress={onTogglePassword}>
                    {showPassword ? (
                        <EyeOff size={20} color={colors.textSecondary} />
                    ) : (
                        <Eye size={20} color={colors.textSecondary} />
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 15,
        height: 60,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#111827',
    },
});
