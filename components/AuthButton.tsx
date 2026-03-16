import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AuthButtonProps extends TouchableOpacityProps {
    title: string;
    isLoading?: boolean;
    colors?: readonly [string, string, ...string[]];
}

export const AuthButton = ({ 
    title, 
    isLoading = false, 
    colors = ['#B91C1C', '#EA580C'],
    style,
    disabled,
    ...props 
}: AuthButtonProps) => {
    return (
        <TouchableOpacity
            style={[styles.loginButton, style]}
            disabled={isLoading || disabled}
            {...props}
        >
            <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.loginButtonText}>{title}</Text>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    loginButton: {
        height: 60,
        borderRadius: 15,
        overflow: 'hidden',
        marginTop: 10,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
