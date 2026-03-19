import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import {
  Bell,
  ShoppingBag,
  Heart,
  User,
  Search,
  Bookmark,
  Home,
  Plus,
  ShoppingCart,
} from 'lucide-react-native';

// ─── Helper ───────────────────────────────────────────────────────────────────

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CustomerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const displayName = user?.name || 'Alex Rivera';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View>
          <Text style={styles.greetingLabel}>{getGreeting().toUpperCase()}</Text>
          <Text style={styles.userName}>{displayName}</Text>
        </View>
        <TouchableOpacity style={styles.bellWrapper} activeOpacity={0.8}>
          <Bell size={22} color="#4B5563" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* ── Scrollable Body ──────────────────────────────────────────────────── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Links ─────────────────────────────────────────────────────── */}
        <View style={styles.quickLinks}>
          <QuickLink 
            icon={<ShoppingBag size={24} color="#2563EB" />} 
            label="Orders" 
            bg="#EFF6FF" 
            onPress={() => Alert.alert('Orders', 'Order history tracking coming soon!')}
          />
          <QuickLink 
            icon={<Heart size={24} color="#EC4899" />} 
            label="Wishlist" 
            bg="#FDF2F8" 
            onPress={() => Alert.alert('Wishlist', 'Your saved products will appear here soon.')}
          />
          <QuickLink 
            icon={<User size={24} color="#7C3AED" />} 
            label="Profile" 
            bg="#F5F3FF" 
            onPress={() => router.push('/customer/customer-profile')}
          />
        </View>

        {/* Order Status ────────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Order Status</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>View All</Text>
            </TouchableOpacity>
          </View>

          <OrderCard
            imageUri="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop"
            name="Minimalist Desk Lamp"
            sub="Out for delivery today"
            status="In Transit"
            statusColor="#059669"
            statusBg="#ECFDF5"
            borderColor="#10B981"
          />

          <OrderCard
            imageUri="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=120&h=120&fit=crop"
            name="Leather Card Holder"
            sub="Expected: Oct 24"
            status="Processing"
            statusColor="#2563EB"
            statusBg="#EFF6FF"
            borderColor="#3B82F6"
            style={{ marginTop: 12 }}
          />
        </View>

        {/* Recommended Products ───────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <View style={styles.productsGrid}>
            <ProductCard
              imageUri="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=400&fit=crop"
              category="Electronics"
              name="ANC Headphones"
              price="$129.00"
            />
            <ProductCard
              imageUri="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300&h=400&fit=crop"
              category="Lifestyle"
              name="Matte Ceramic Mug"
              price="$24.00"
            />
          </View>
        </View>
      </ScrollView>

      {/* ── Bottom Navigation ────────────────────────────────────────────────── */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 8 }]}>
        <NavItem 
          icon={<Home size={24} color="#2563EB" fill="#2563EB" />} 
          label="Home" 
          active 
        />
        <NavItem 
          icon={<Search size={24} color="#9CA3AF" />} 
          label="Search" 
          onPress={() => router.push('/customer/explore')} 
        />
        <NavItem 
          icon={<ShoppingCart size={24} color="#9CA3AF" />} 
          label="Cart" 
          onPress={() => Alert.alert('Shopping Cart', 'Cart functionality is currently being implemented.')}
        />
        <NavItem 
          icon={<User size={24} color="#9CA3AF" />} 
          label="Profile" 
          onPress={() => router.push('/customer/customer-profile')} 
        />
      </View>
    </View>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function QuickLink({ icon, label, bg, onPress }: { icon: React.ReactNode; label: string; bg: string; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.quickLinkCard} activeOpacity={0.8} onPress={onPress}>
      <View style={[styles.quickLinkIcon, { backgroundColor: bg }]}>{icon}</View>
      <Text style={styles.quickLinkLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function OrderCard({
  imageUri,
  name,
  sub,
  status,
  statusColor,
  statusBg,
  borderColor,
  style,
}: {
  imageUri: string;
  name: string;
  sub: string;
  status: string;
  statusColor: string;
  statusBg: string;
  borderColor: string;
  style?: object;
}) {
  return (
    <View style={[styles.orderCard, { borderLeftColor: borderColor }, style]}>
      <Image source={{ uri: imageUri }} style={styles.orderImage} />
      <View style={styles.orderInfo}>
        <Text style={styles.orderName} numberOfLines={1}>{name}</Text>
        <Text style={styles.orderSub}>{sub}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
        <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
      </View>
    </View>
  );
}

function ProductCard({
  imageUri,
  category,
  name,
  price,
}: {
  imageUri: string;
  category: string;
  name: string;
  price: string;
}) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.88}
      onPress={() => router.push('/customer/product-detail')}
    >
      <View style={styles.productImageBox}>
        <Image source={{ uri: imageUri }} style={styles.productImage} />
        <TouchableOpacity style={styles.wishlistBtn}>
          <Heart size={16} color="#4B5563" />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productCategory}>{category}</Text>
        <Text style={styles.productName} numberOfLines={1}>{name}</Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>{price}</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Plus size={16} color="#FFFFFF" strokeWidth={3} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function NavItem({ icon, label, active, onPress }: { icon: React.ReactNode; label: string; active?: boolean; onPress?: () => void }) {
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
  shadowOpacity: 0.05,
  shadowRadius: 10,
  elevation: 3,
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F9FAFB' },

  // Header
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOW,
  },
  greetingLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  userName: { fontSize: 22, fontWeight: '700', color: '#1F2937' },
  bellWrapper: {
    width: 42,
    height: 42,
    backgroundColor: '#F3F4F6',
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  scrollView: { flex: 1 },

  // Quick Links
  quickLinks: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginTop: 20,
    marginBottom: 28,
  },
  quickLinkCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 10,
    ...SHADOW,
  },
  quickLinkIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLinkLabel: { fontSize: 12, fontWeight: '500', color: '#4B5563' },

  // Section
  section: { paddingHorizontal: 24, marginBottom: 28 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1F2937' },
  sectionLink: { fontSize: 13, fontWeight: '600', color: '#2563EB' },

  // Order Card
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    gap: 12,
    ...SHADOW,
  },
  orderImage: {
    width: 54,
    height: 54,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  orderInfo: { flex: 1 },
  orderName: { fontSize: 13, fontWeight: '700', color: '#1F2937', marginBottom: 3 },
  orderSub: { fontSize: 11, color: '#6B7280' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700' },

  // Products
  productsGrid: { flexDirection: 'row', gap: 14 },
  productCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    ...SHADOW,
  },
  productImageBox: { position: 'relative' },
  productImage: { width: '100%', aspectRatio: 3 / 4, backgroundColor: '#E5E7EB' },
  wishlistBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    padding: 6,
  },
  productInfo: { padding: 12 },
  productCategory: { fontSize: 10, color: '#9CA3AF', fontWeight: '500', marginBottom: 2 },
  productName: { fontSize: 13, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 14, fontWeight: '700', color: '#2563EB' },
  addBtn: {
    width: 30,
    height: 30,
    backgroundColor: '#111827',
    borderRadius: 15,
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
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: { alignItems: 'center', gap: 4 },
  navLabel: { fontSize: 10, fontWeight: '500', color: '#9CA3AF' },
  navLabelActive: { color: '#2563EB', fontWeight: '700' },
});
