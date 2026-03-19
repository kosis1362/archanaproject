import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Share,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Share2,
  Star,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Home,
  Search,
  ShoppingCart,
  User,
} from 'lucide-react-native';

// ─── Data ─────────────────────────────────────────────────────────────────────

const COLORS = [
  { id: 'black', label: 'Black', swatch: '#1a1a1a' },
  { id: 'silver', label: 'Silver', swatch: '#C0C0C0' },
  { id: 'navy', label: 'Navy', swatch: '#1e3a5f' },
];

const PRODUCT = {
  name: 'Premium Minimalist Headphones',
  price: 149.0,
  rating: 4,
  reviews: 128,
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
  description:
    'Experience pure sound with our next-generation noise cancellation technology. Designed for all-day comfort with memory foam ear cushions and a lightweight minimalist frame. Perfect for travel, work, or losing yourself in your favorite music.',
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProductDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [selectedColor, setSelectedColor] = useState('black');
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const totalPrice = (PRODUCT.price * quantity).toFixed(2);

  const handleShare = async () => {
    try {
      await Share.share({ message: `Check out ${PRODUCT.name} for $${PRODUCT.price}!` });
    } catch (_) {}
  };

  const handleAddToCart = () => {
    Alert.alert('Added to Cart', `${quantity}x ${PRODUCT.name} added to your cart.`);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F6F6" />

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Product Details</Text>

        <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
          <Share2 size={20} color="#1E293B" />
        </TouchableOpacity>
      </View>

      {/* ── Scrollable Body ──────────────────────────────────────────────────── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 180 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: PRODUCT.image }} style={styles.productImage} resizeMode="cover" />
        </View>

        <View style={styles.content}>
          {/* Title & Price */}
          <View style={styles.titleRow}>
            <View style={styles.titleLeft}>
              <Text style={styles.productName}>{PRODUCT.name}</Text>

              {/* Star Rating */}
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={15}
                    color="#EC5B13"
                    fill={i <= PRODUCT.rating ? '#EC5B13' : 'transparent'}
                  />
                ))}
                <Text style={styles.reviewCount}>({PRODUCT.reviews} Reviews)</Text>
              </View>
            </View>

            <Text style={styles.price}>${PRODUCT.price.toFixed(2)}</Text>
          </View>

          {/* Description */}
          <View style={styles.block}>
            <Text style={styles.blockLabel}>DESCRIPTION</Text>
            <Text style={styles.description}>{PRODUCT.description}</Text>
          </View>

          {/* Color Picker */}
          <View style={styles.block}>
            <Text style={styles.blockLabel}>COLOR</Text>
            <View style={styles.colorRow}>
              {COLORS.map((c) => {
                const isActive = selectedColor === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.colorChip, isActive && styles.colorChipActive]}
                    onPress={() => setSelectedColor(c.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.colorSwatch, { backgroundColor: c.swatch }]} />
                    <Text style={[styles.colorLabel, isActive && styles.colorLabelActive]}>
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Quantity + Wishlist */}
          <View style={styles.qtyWishRow}>
            <View>
              <Text style={styles.blockLabel}>QUANTITY</Text>
              <View style={styles.qtyControl}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                  activeOpacity={0.8}
                >
                  <Minus size={18} color="#1E293B" />
                </TouchableOpacity>

                <Text style={styles.qtyValue}>{quantity}</Text>

                <TouchableOpacity
                  style={[styles.qtyBtn, styles.qtyBtnActive]}
                  onPress={() => setQuantity((q) => q + 1)}
                  activeOpacity={0.8}
                >
                  <Plus size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.wishlistBtn, wishlisted && styles.wishlistBtnActive]}
              onPress={() => setWishlisted((w) => !w)}
              activeOpacity={0.8}
            >
              <Heart
                size={22}
                color={wishlisted ? '#EF4444' : '#64748B'}
                fill={wishlisted ? '#EF4444' : 'transparent'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ── Sticky Footer ────────────────────────────────────────────────────── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 4 }]}>
        {/* Add to Cart */}
        <View style={styles.cartRow}>
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total Price</Text>
            <Text style={styles.totalPrice}>${totalPrice}</Text>
          </View>

          <TouchableOpacity style={styles.addCartBtn} onPress={handleAddToCart} activeOpacity={0.85}>
            <ShoppingBag size={20} color="#FFFFFF" />
            <Text style={styles.addCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Nav */}
        <View style={styles.bottomNav}>
          <NavItem
            icon={<Home size={22} color="#EC5B13" fill="#EC5B13" />}
            label="Home"
            active
            onPress={() => router.replace('/customer/dashboard')}
          />
          <NavItem
            icon={<Search size={22} color="#9CA3AF" />}
            label="Search"
            onPress={() => router.push('/customer/explore')}
          />
          <NavItem 
            icon={<ShoppingCart size={22} color="#9CA3AF" />} 
            label="Cart" 
            onPress={() => Alert.alert('Shopping Cart', 'Cart functionality is coming soon!')}
          />
          <NavItem icon={<User size={22} color="#9CA3AF" />} label="Profile" onPress={() => router.push('/customer/customer-profile')} />
        </View>
      </View>
    </View>
  );
}

// ─── NavItem ──────────────────────────────────────────────────────────────────

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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8F6F6' },

  // Header
  header: {
    backgroundColor: '#F8F6F6',
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    zIndex: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
  },

  // Scroll
  scrollView: { flex: 1 },

  // Image
  imageWrapper: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOW,
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#E2E8F0',
  },

  // Content
  content: { paddingHorizontal: 16 },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 12,
  },
  titleLeft: { flex: 1 },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 28,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 3,
    flexWrap: 'wrap',
  },
  reviewCount: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#EC5B13',
    marginTop: 2,           // aligns top of price with top of product name
    flexShrink: 0,          // don't let it compress
  },

  // Section blocks
  block: { marginTop: 28 },
  blockLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
  },

  // Color
  colorRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  colorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  colorChipActive: {
    borderColor: '#EC5B13',
    backgroundColor: 'rgba(236,91,19,0.08)',
  },
  colorSwatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00000020',
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  colorLabelActive: {
    color: '#1E293B',
    fontWeight: '600',
  },

  // Quantity + Wishlist
  qtyWishRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',      // centre both vertically
    marginTop: 28,
    paddingBottom: 8,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(148,163,184,0.15)',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnActive: {
    backgroundColor: '#EC5B13',
  },
  qtyValue: {
    width: 40,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  wishlistBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistBtnActive: {
    borderColor: 'rgba(239,68,68,0.3)',
    backgroundColor: 'rgba(239,68,68,0.05)',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F8F6F6',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  totalBox: { flex: 0 },
  totalLabel: { fontSize: 11, color: '#64748B' },
  totalPrice: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  addCartBtn: {
    flex: 1,
    height: 54,
    backgroundColor: '#EC5B13',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#EC5B13',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  addCartText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Bottom Nav
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 6,
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
