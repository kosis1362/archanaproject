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
import { api } from '@/lib/api';
import { Category } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import { SearchResultItem } from '@/app/customer/_components/SearchResultItem';
import { CategoryCard } from '@/app/customer/_components/CategoryCard';
import { VendorListCard } from '@/app/customer/_components/VendorListCard';

const recentSearches = ['Pashmina shawl', 'Brass diya', 'Handmade jewelry'];
const trendingSearches = ['Kundan set', 'Block print', 'Mango pickle', 'Pottery'];

export default function SearchScreen() {
    const { tab: initialTab } = useLocalSearchParams<{ tab: string }>();
    const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'vendors'>('products');
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
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
            const [prods, cats, vends] = await Promise.all([
                api.getProducts(100),
                api.getCategories(),
                api.getVendors()
            ]);

            setAllProducts(prods);
            setCategories(cats);
            setVendors(vends);
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
                                <SearchResultItem key={product.id} product={product} />
                            ))}
                        </View>
                    )
                ) : activeTab === 'categories' ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Browse All Categories</Text>
                        <View style={styles.categoriesGrid}>
                            {categories.map(category => (
                                <CategoryCard
                                    key={category.id}
                                    category={category}
                                    style={{ width: '30%', marginLeft: 0 }}
                                />
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
                                <VendorListCard key={vendor.id} vendor={vendor} />
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
    resultsContainer: {
        padding: 16,
    },
    resultsCount: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 16,
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
    emptyText: {
        textAlign: 'center',
        color: colors.textSecondary,
        marginTop: 20,
    },
});
