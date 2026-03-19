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
  ArrowLeft,
  MoreVertical,
  Pencil,
  User,
  Lock,
  Truck,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  Home,
  Search,
  ShoppingCart,
  ChevronRight,
} from 'lucide-react-native';

// ─── Constants ────────────────────────────────────────────────────────────────

const PRIMARY = '#EC5B13';
const BG = '#F8F6F6';
const CARD_BG = '#FFFFFF';
const DIVIDER = '#E2E8F0';
const TEXT_MAIN = '#1E293B';
const TEXT_MUTED = '#64748B';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MenuRowProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  isLast?: boolean;
  danger?: boolean;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CustomerProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
      router.replace('/customer/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={TEXT_MAIN} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile &amp; Settings</Text>

        <TouchableOpacity style={styles.iconBtn}>
          <MoreVertical size={22} color={TEXT_MAIN} />
        </TouchableOpacity>
      </View>

      {/* ── Scrollable Body ──────────────────────────────────────────────── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Hero */}
        <View style={styles.heroSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPOdJreycZ6i9hhGiy2P2hF28qVT3x7QLVPRGirrQCvzUpagVHMRhRcaqx2GDCcyo-mCTg5KlX9D875iQMBtDB2Vp9b45nM4kOSsG9DsxisHBKsOM5YmokXX8Hxnk5TV0DRAC48479SxB-CFr4Xr1BkXsF6WrxGKcX5amtlHIWfrL1Rb8UogQ1IixOFny-uOwf8k8neog6FQAue19UoR-djbsF1UmOnQRU-ugvk5dCg_N9B_UuaG2jL3GApdZKBJ4TlSZ7nGyhkynF',
              }}
              style={styles.avatar}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Pencil size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>Alex Johnson</Text>
          <Text style={styles.userEmail}>alex.johnson@example.com</Text>

          <View style={styles.memberBadge}>
            <Text style={styles.memberBadgeText}>Gold Member</Text>
          </View>
        </View>

        {/* ── Personal Information ─────────────────────────────────────── */}
        <SectionLabel label="Personal Information" />
        <View style={styles.card}>
          <MenuRow
            icon={<User size={20} color={PRIMARY} />}
            iconBg="rgba(236,91,19,0.1)"
            iconColor={PRIMARY}
            title="Account Details"
            subtitle="Name, Email, Phone Number"
            onPress={() => Alert.alert('Account Details', 'Account management coming soon!')}
          />
          <MenuRow
            icon={<Lock size={20} color={PRIMARY} />}
            iconBg="rgba(236,91,19,0.1)"
            iconColor={PRIMARY}
            title="Security &amp; Password"
            subtitle="Last changed 3 months ago"
            onPress={() => Alert.alert('Security', 'Security settings coming soon!')}
            isLast
          />
        </View>

        {/* ── Preferences & Data ───────────────────────────────────────── */}
        <SectionLabel label="Preferences &amp; Data" />
        <View style={styles.card}>
          <MenuRow
            icon={<Truck size={20} color={PRIMARY} />}
            iconBg="rgba(236,91,19,0.1)"
            iconColor={PRIMARY}
            title="Shipping Addresses"
            subtitle="3 saved locations"
            onPress={() => Alert.alert('Shipping', 'Address management coming soon!')}
          />
          <MenuRow
            icon={<CreditCard size={20} color={PRIMARY} />}
            iconBg="rgba(236,91,19,0.1)"
            iconColor={PRIMARY}
            title="Payment Methods"
            subtitle="Visa **** 4242"
            onPress={() => Alert.alert('Payment', 'Payment method management coming soon!')}
          />
          <MenuRow
            icon={<Bell size={20} color={PRIMARY} />}
            iconBg="rgba(236,91,19,0.1)"
            iconColor={PRIMARY}
            title="Notification Settings"
            subtitle="Push, Email, and SMS"
            onPress={() => Alert.alert('Notifications', 'Notification preferences coming soon!')}
            isLast
          />
        </View>

        {/* ── Support ──────────────────────────────────────────────────── */}
        <SectionLabel label="Support" />
        <View style={styles.card}>
          <MenuRow
            icon={<HelpCircle size={20} color={TEXT_MUTED} />}
            iconBg="#F1F5F9"
            iconColor={TEXT_MUTED}
            title="Help &amp; Support"
            subtitle="FAQs and contact us"
            onPress={() => Alert.alert('Support', 'Support center coming soon!')}
          />
          <MenuRow
            icon={<LogOut size={20} color="#EF4444" />}
            iconBg="rgba(239,68,68,0.1)"
            iconColor="#EF4444"
            title="Sign Out"
            onPress={handleSignOut}
            isLast
            danger
          />
        </View>

        <Text style={styles.versionText}>Version 2.4.1 (2023)</Text>
      </ScrollView>

      {/* ── Bottom Nav ───────────────────────────────────────────────────── */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 6 }]}>
        <NavItem
          icon={<Home size={22} color="#9CA3AF" />}
          label="Home"
          onPress={() => router.replace('/customer/dashboard')}
        />
        <NavItem
          icon={<Search size={22} color="#9CA3AF" />}
          label="Search"
          onPress={() => router.push('/customer/explore')}
        />
        <NavItem icon={<ShoppingCart size={22} color="#9CA3AF" />} label="Orders" />
        <NavItem icon={<User size={22} color={PRIMARY} />} label="Profile" active />
      </View>
    </View>
  );
}

// ─── SectionLabel ─────────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <View style={styles.sectionLabelWrapper}>
      <Text style={styles.sectionLabel}>{label}</Text>
    </View>
  );
}

// ─── MenuRow ──────────────────────────────────────────────────────────────────

function MenuRow({
  icon,
  iconBg,
  title,
  subtitle,
  onPress,
  isLast,
  danger,
}: MenuRowProps) {
  return (
    <TouchableOpacity
      style={[styles.menuRow, !isLast && styles.menuRowBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIconBox, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={styles.menuTextWrapper}>
        <Text style={[styles.menuTitle, danger && styles.menuTitleDanger]}>{title}</Text>
        {subtitle ? <Text style={styles.menuSubtitle}>{subtitle}</Text> : null}
      </View>
      {!danger && <ChevronRight size={20} color="#CBD5E1" />}
    </TouchableOpacity>
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
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 3,
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  // Header
  header: {
    backgroundColor: BG,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: DIVIDER,
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
    color: TEXT_MAIN,
  },

  // Scroll
  scrollView: { flex: 1 },

  // Hero
  heroSection: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    ...SHADOW,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: PRIMARY,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: TEXT_MAIN,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: TEXT_MUTED,
    fontWeight: '500',
    marginBottom: 10,
  },
  memberBadge: {
    backgroundColor: 'rgba(236,91,19,0.1)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
  },
  memberBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: PRIMARY,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Section label
  sectionLabelWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: TEXT_MUTED,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },

  // Card
  card: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: CARD_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: DIVIDER,
    overflow: 'hidden',
    ...SHADOW,
  },

  // Menu Row
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: DIVIDER,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  menuTextWrapper: { flex: 1 },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_MAIN,
  },
  menuTitleDanger: { color: '#EF4444' },
  menuSubtitle: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 2,
  },

  // Version
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 4,
    marginBottom: 12,
  },

  // Bottom Nav
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: DIVIDER,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: { alignItems: 'center', gap: 3, flex: 1 },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  navLabelActive: { color: PRIMARY, fontWeight: '700' },
});
