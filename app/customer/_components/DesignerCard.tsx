import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Animated } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';

export function DesignerCard({ designer }: { designer: any }) {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.96,
            useNativeDriver: true,
            speed: 24,
            bounciness: 8,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 24,
            bounciness: 8,
        }).start();
    };

    return (
        <Pressable 
            onPress={() => router.push('/customer/search?tab=vendors')}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
                <Image source={{ uri: designer.image }} style={styles.image} />
                <View style={styles.gradientOverlay} />
                <View style={styles.info}>
                    <Text style={styles.role}>{designer.role}</Text>
                    <Text style={styles.name}>{designer.name}</Text>
                </View>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 140,
        height: 200,
        backgroundColor: colors.white,
        borderRadius: 16,
        marginHorizontal: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    info: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        alignItems: 'flex-start',
    },
    name: {
        fontSize: 14,
        fontWeight: '800',
        color: colors.white,
        marginBottom: 2,
    },
    role: {
        fontSize: 10,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.8)',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    }
});
