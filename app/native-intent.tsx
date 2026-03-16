import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function NativeIntent() {
    const router = useRouter();

    useEffect(() => {
        // Simple placeholder - redirect to home
        router.replace('/');
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Opening...</Text>
        </View>
    );
}
