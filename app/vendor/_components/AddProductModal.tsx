import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    Modal,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { X, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

interface AddProductModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddProductModal({ visible, onClose, onSuccess }: AddProductModalProps) {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Handicrafts',
        stock: '',
        image: null as string | null,
    });

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setNewProduct({ ...newProduct, image: result.assets[0].uri });
        }
    };

    const uploadImage = async (uri: string) => {
        // Mock image upload taking 1 second
        await new Promise(r => setTimeout(r, 1000));
        return uri;
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.image) {
            Alert.alert('Error', 'Please fill all required fields and provide an image URL');
            return;
        }

        if (!user?.id) {
            Alert.alert('Error', 'You must be logged in to add products');
            return;
        }

        try {
            setIsSubmitting(true);
            const imageUrl = await uploadImage(newProduct.image);

            Alert.alert('Success', 'Product listed successfully on the marketplace!');

            onSuccess();
            onClose();
            setNewProduct({
                name: '',
                description: '',
                price: '',
                category: 'Handicrafts',
                stock: '',
                image: null,
            });
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add New Product</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.imageInputContainer}>
                            <Text style={styles.inputLabel}>Product Image *</Text>
                            <TouchableOpacity
                                style={styles.imagePickerButton}
                                onPress={pickImage}
                            >
                                {newProduct.image ? (
                                    <Image source={{ uri: newProduct.image }} style={styles.pickedImagePreview} />
                                ) : (
                                    <View style={styles.imagePlaceholder}>
                                        <Camera size={32} color={colors.textSecondary} />
                                        <Text style={styles.placeholderText}>Select from Gallery</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputLabel}>Product Name *</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Enter product name"
                            value={newProduct.name}
                            onChangeText={(val) => setNewProduct({ ...newProduct, name: val })}
                        />

                        <Text style={styles.inputLabel}>Description</Text>
                        <TextInput
                            style={[styles.modalInput, { height: 100, textAlignVertical: 'top' }]}
                            placeholder="Enter product description"
                            multiline
                            numberOfLines={4}
                            value={newProduct.description}
                            onChangeText={(val) => setNewProduct({ ...newProduct, description: val })}
                        />

                        <View style={styles.inputRow}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <Text style={styles.inputLabel}>Price (रू) *</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="0.00"
                                    keyboardType="numeric"
                                    value={newProduct.price}
                                    onChangeText={(val) => setNewProduct({ ...newProduct, price: val })}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                <Text style={styles.inputLabel}>Stock *</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    value={newProduct.stock}
                                    onChangeText={(val) => setNewProduct({ ...newProduct, stock: val })}
                                />
                            </View>
                        </View>

                        <Text style={styles.inputLabel}>Category</Text>
                        <View style={styles.categoryPicker}>
                            {['Handicrafts', 'Clothing', 'Jewelry', 'Food & Spices', 'Home Decor', 'Art'].map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.categoryChip,
                                        newProduct.category === cat && styles.categoryChipActive
                                    ]}
                                    onPress={() => setNewProduct({ ...newProduct, category: cat })}
                                >
                                    <Text style={[
                                        styles.categoryChipText,
                                        newProduct.category === cat && styles.categoryChipTextActive
                                    ]}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                            onPress={handleAddProduct}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color={colors.white} />
                            ) : (
                                <Text style={styles.submitButtonText}>List Product</Text>
                            )}
                        </TouchableOpacity>
                        <View style={{ height: 20 }} />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
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
        fontWeight: '700',
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
        fontWeight: '600',
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
        fontWeight: '500',
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
        fontWeight: '700',
        color: colors.white,
    },
});
