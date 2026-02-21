import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X, TrendingUp, Clock, Star } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { products as mockProducts, categories as mockCategories } from '@/mocks/data';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';

const recentSearches = ['Pashmina shawl', 'Brass diya', 'Handmade jewelry'];
const trendingSearches = ['Kundan set', 'Block print', 'Mango pickle', 'Pottery'];

export default function SearchScreen() {
    const { tab: initialTab } = useLocalSearchParams<{ tab: string }>();
    const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'vendors'>('products');
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [vendors, setVendors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (initialTab === 'categories' || initialTab === 'vendors') {
            setActiveTab(initialTab);
        }
    }, [initialTab]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [productsRes, vendorsRes] = await Promise.all([
                supabase.from('products').select('*').order('name', { ascending: true }),
                supabase.from('profiles').select('*').eq('role', 'vendor')
            ]);

            setAllProducts(productsRes.data || []);
            setVendors(vendorsRes.data || []);
        } catch (error) {
            console.error('Search fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProducts = query.length > 0
        ? allProducts.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            (p.category && p.category.toLowerCase().includes(query.toLowerCase()))
        )
        : [];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View style={styles.searchBox}>
                    <Search size={20} color={colors.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search products, categories..."
                        placeholderTextColor={colors.textSecondary}
                        value={query}
                        onChangeText={setQuery}
                        onFocus={() => setIsSearching(true)}
                        autoFocus
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery('')}>
                            <X size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {activeTab === 'products' ? (
                    query.length === 0 ? (
                        <>
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Clock size={18} color={colors.textSecondary} />
                                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                                </View>
                                <View style={styles.chipContainer}>
                                    {recentSearches.map((search, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.chip}
                                            onPress={() => setQuery(search)}
                                        >
                                            <Text style={styles.chipText}>{search}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <TrendingUp size={18} color={colors.primary} />
                                    <Text style={styles.sectionTitle}>Trending</Text>
                                </View>
                                <View style={styles.chipContainer}>
                                    {trendingSearches.map((search, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[styles.chip, styles.trendingChip]}
                                            onPress={() => setQuery(search)}
                                        >
                                            <Text style={[styles.chipText, styles.trendingChipText]}>{search}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </>
                    ) : (
                        <View style={styles.resultsContainer}>
                            <Text style={styles.resultsCount}>{filteredProducts.length} results</Text>
                            {isLoading ? (
                                <ActivityIndicator color={colors.primary} />
                            ) : filteredProducts.map(product => (
                                <TouchableOpacity
                                    key={product.id}
                                    style={styles.resultItem}
                                    onPress={() => router.push(`/product/${product.id}`)}
                                >
                                    <Image source={{ uri: product.images?.[0] || 'https://via.placeholder.com/150' }} style={styles.resultImage} />
                                    <View style={styles.resultInfo}>
                                        <Text style={styles.resultName} numberOfLines={2}>{product.name}</Text>
                                        <Text style={styles.resultCategory}>{product.category}</Text>
                                        <View style={styles.resultMeta}>
                                            <Text style={styles.resultPrice}>रू{product.price.toLocaleString()}</Text>
                                            <View style={styles.ratingContainer}>
                                                <Star size={12} color={colors.secondary} fill={colors.secondary} />
                                                <Text style={styles.ratingText}>{product.rating || '0.0'}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )
                ) : activeTab === 'categories' ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Browse All Categories</Text>
                        <View style={styles.categoriesGrid}>
                            {mockCategories.map(category => (
                                <TouchableOpacity key={category.id} style={styles.categoryItem}>
                                    <Image source={{ uri: category.image }} style={styles.categoryImage} />
                                    <Text style={styles.categoryName}>{category.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ) : (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Local Vendors & Shops</Text>
                        <View style={styles.vendorsList}>
                            {isLoading ? (
                                <ActivityIndicator color={colors.primary} />
                            ) : vendors.length === 0 ? (
                                <Text style={styles.emptyText}>No vendors found</Text>
                            ) : vendors.map(vendor => (
                                <TouchableOpacity key={vendor.id} style={styles.vendorItem}>
                                    <Image source={{ uri: vendor.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' }} style={styles.vendorAvatar} />
                                    <View style={styles.vendorInfo}>
                                        <Text style={styles.vendorNameText}>{vendor.full_name || 'Vendor'}</Text>
                                        <Text style={styles.vendorRole}>Member since {new Date(vendor.created_at).getFullYear()}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.visitButton}>
                                        <Text style={styles.visitButtonText}>Visit Store</Text>
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'products' && styles.activeTab]}
                    onPress={() => setActiveTab('products')}
                >
                    <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>Products</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'categories' && styles.activeTab]}
                    onPress={() => setActiveTab('categories')}
                >
                    <Text style={[styles.tabText, activeTab === 'categories' && styles.activeTabText]}>Categories</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'vendors' && styles.activeTab]}
                    onPress={() => setActiveTab('vendors')}
                >
                    <Text style={[styles.tabText, activeTab === 'vendors' && styles.activeTabText]}>Vendors</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: 16,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.borderLight,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 48,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: colors.text,
        marginLeft: 12,
    },
    content: {
        flex: 1,
    },
    section: {
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: colors.text,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        backgroundColor: colors.white,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
    },
    trendingChip: {
        backgroundColor: colors.cherryLight,
        borderColor: colors.cherryLight,
    },
    chipText: {
        fontSize: 14,
        color: colors.text,
    },
    trendingChipText: {
        color: colors.primary,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
        gap: 12,
    },
    categoryItem: {
        width: '30%',
        alignItems: 'center',
    },
    categoryImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: colors.white,
    },
    categoryName: {
        fontSize: 12,
        color: colors.text,
        marginTop: 8,
        textAlign: 'center',
    },
    resultsContainer: {
        padding: 16,
    },
    resultsCount: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 16,
    },
    resultItem: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    resultImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    resultInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    resultName: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: colors.text,
    },
    resultCategory: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    resultMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    resultPrice: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: colors.primary,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '600' as const,
        color: colors.text,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: colors.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.textSecondary,
    },
    activeTabText: {
        color: colors.primary,
    },
    vendorsList: {
        marginTop: 12,
    },
    vendorItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    vendorAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    vendorInfo: {
        flex: 1,
        marginLeft: 12,
    },
    vendorNameText: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: colors.text,
    },
    vendorRole: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    visitButton: {
        backgroundColor: colors.cherryLight,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    visitButtonText: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        color: colors.textSecondary,
        marginTop: 20,
    },
});
