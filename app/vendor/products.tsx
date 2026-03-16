import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, Filter, MoreVertical, Star, Package, X, Camera } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import { ProductListItem } from '@/app/vendor/_components/ProductListItem';
import { AddProductModal } from '@/app/vendor/_components/AddProductModal';

export default function VendorProductsScreen() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Product State
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      const data = await api.getProductsByVendor(user.id);
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Products</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Plus size={18} color={colors.white} />
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{products.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.success }]}>
            {products.filter(p => p.stock > 10).length}
          </Text>
          <Text style={styles.statLabel}>In Stock</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.warning }]}>
            {products.filter(p => p.stock <= 10 && p.stock > 0).length}
          </Text>
          <Text style={styles.statLabel}>Low Stock</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.error }]}>
            {products.filter((p: any) => p.stock === 0).length}
          </Text>
          <Text style={styles.statLabel}>Out of Stock</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Package size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        ) : (
          filteredProducts.map(product => (
            <ProductListItem key={product.id} product={product} />
          ))
        )}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Add Product Modal */}
      <AddProductModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={fetchProducts}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.white,
  },
  searchRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 10,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.text,
  },
  productCategory: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stockText: {
    fontSize: 11,
  },
  productRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  menuButton: {
    padding: 4,
  },
  bottomPadding: {
    height: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    height: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.text,
  },
  imageInputContainer: {
    marginBottom: 20,
  },
  imagePlaceholder: {
    height: 150,
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  placeholderText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  imagePickerButton: {
    width: '100%',
  },
  pickedImagePreview: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },
  categoryChipTextActive: {
    color: colors.white,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.white,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },
});
