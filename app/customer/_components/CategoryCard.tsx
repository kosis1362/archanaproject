import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ViewStyle, StyleProp } from 'react-native';
import { Category } from '@/types';
import { colors } from '@/constants/colors';

export function CategoryCard({ category, style }: { category: Category, style?: StyleProp<ViewStyle> }) {
    return (
        <TouchableOpacity style={[styles.categoryCard, style]} activeOpacity={0.8}>
            <View style={styles.categoryImageContainer}>
                <Image source={{ uri: category.image }} style={styles.categoryImage} />
            </View>
            <Text style={styles.categoryName} numberOfLines={1}>{category.name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    categoryCard: {
        alignItems: 'center',
        marginLeft: 16,
        width: 72,
    },
    categoryImageContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.white,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    categoryImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    categoryName: {
        fontSize: 12,
        color: colors.text,
        marginTop: 8,
        textAlign: 'center',
    },
});
