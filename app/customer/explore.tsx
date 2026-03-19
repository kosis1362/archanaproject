import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ShoppingBag,
  Search,
  Heart,
  Plus,
  Home,
  ShoppingCart,
  User,
} from 'lucide-react-native';

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'all', label: 'All', active: true },
  { id: 'fashion', label: 'Fashion' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'home', label: 'Home' },
];

const PRODUCTS = [
  {
    id: '1',
    name: 'Modern Quartz Watch',
    price: '$120.00',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop',
  },
  {
    id: '2',
    name: 'Wireless Noise Cancelling',
    price: '$299.00',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop',
  },
  {
    id: '3',
    name: 'Urban Pro Sneakers',
    price: '$85.00',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop',
  },
  {
    id: '4',
    name: 'Speed Runner Red',
    price: '$145.00',
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=500&fit=crop',
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchText, setSearchText] = useState('');

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F6F6" />

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Explore</Text>

        <TouchableOpacity style={styles.iconBtn}>
          <ShoppingBag size={22} color="#1E293B" />
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products, brands..."
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
            />
          </View>
        </View>
      </View>

      {/* ── Scrollable Body ──────────────────────────────────────────────────── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories ──────────────────────────────────────────────────────── */}
        <View style={styles.categoriesSection}>
          <Text style={styles.categoryHeading}>POPULAR CATEGORIES</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                  onPress={() => setActiveCategory(cat.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Trending Products ────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.productsGrid}>
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ── Bottom Navigation ────────────────────────────────────────────────── */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 6 }]}>
        <NavItem icon={<Home size={24} color="#9CA3AF" />} label="Home" onPress={() => router.replace('/customer/dashboard')} />
        <NavItem icon={<Search size={24} color="#EC5B13" />} label="Explore" active />
        <NavItem icon={<ShoppingCart size={24} color="#9CA3AF" />} label="Cart" />
        <NavItem icon={<User size={24} color="#9CA3AF" />} label="Profile" />
      </View>
    </View>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProductCard({ product }: { product: typeof PRODUCTS[0] }) {
  const [wishlisted, setWishlisted] = useState(false);
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.88}
      onPress={() => router.push('/customer/product-detail')}
    >
      <View style={styles.productImageBox}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={(e) => { e.stopPropagation?.(); setWishlisted((w) => !w); }}
          activeOpacity={0.8}
        >
          <Heart
            size={18}
            color={wishlisted ? '#EC5B13' : '#1E293B'}
            fill={wishlisted ? '#EC5B13' : 'transparent'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>{product.price}</Text>
          <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}>
            <Plus size={18} color="#FFFFFF" strokeWidth={3} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function NavItem({
  icon,
  label,
  active,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={onPress}>
      {icon}
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 3,
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_PADDING = 16; // paddingHorizontal of section
const GRID_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8F6F6' },

  // Header
  header: {
    backgroundColor: '#F8F6F6',
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    zIndex: 10,
    gap: 0,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  searchRow: {
    width: '100%',
    marginTop: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    paddingVertical: 0,
  },

  scrollView: { flex: 1 },

  // Categories
  categoriesSection: { marginTop: 20, marginBottom: 8 },
  categoryHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1.2,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  categoryRow: {
    paddingHorizontal: 16,
    gap: 10,
  },
  categoryChip: {
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: '#EC5B13',
    borderColor: '#EC5B13',
    shadowColor: '#EC5B13',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Section
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1E293B' },
  seeAll: { fontSize: 13, fontWeight: '600', color: '#EC5B13' },

  // Product Grid
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    ...SHADOW,
  },
  productImageBox: { position: 'relative' },
  productImage: {
    width: '100%',
    aspectRatio: 4 / 5,
    backgroundColor: '#E2E8F0',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    padding: 6,
  },
  productInfo: { padding: 10 },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
    lineHeight: 18,
    minHeight: 36,  // reserve 2 lines so all cards align at the price row
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  addBtn: {
    width: 32,
    height: 32,
    backgroundColor: '#EC5B13',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Bottom Nav
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: { alignItems: 'center', gap: 3 },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  navLabelActive: { color: '#EC5B13', fontWeight: '700' },
});
