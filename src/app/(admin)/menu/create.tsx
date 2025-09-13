import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Image, 
  Alert 
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Button from '@/components/Button';
import * as ImagePicker from 'expo-image-picker';
import { defaultPizzaImage } from '@/components/productListItem';
import Colors from '@/constants/Colors';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { 
  useInsertProduct, 
  useProduct, 
  useUpdateProduct, 
  useDeleteProduct
} from '@/api/products';

import * as FileSystem from 'expo-file-system';
import { randomUUID } from 'expo-crypto';
import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';

const CreateProductScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString?.[0]);
  const isUpdating = !!idString;

  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { data: updatingProduct } = useProduct(id);
  const { mutate: deleteProduct } = useDeleteProduct();

  const router = useRouter();

  // Load product details if editing
  useEffect(() => {
    if (updatingProduct) {
      setName(updatingProduct.name);
      setPrice(updatingProduct.price.toString());
      setImage(updatingProduct.image);
    }
  }, [updatingProduct]);

  const resetFields = () => {
    setName('');
    setPrice('');
    setImage(null);
  };

  const validateInput = () => {
    setError('');
    if (!name) {
      setError('Name is required!');
      return false;
    }

    if (!price) {
      setError('Price is required');
      return false;
    }

    if (isNaN(parseFloat(price))) {
      setError('Price is not a number!');
      return false;
    }

    return true;
  };

  const onSubmit = async () => {
    if (!validateInput()) return;

    if (isUpdating) {
      onUpdate();
    } else {
      await onCreate();
    }
  };

  const onCreate = async () => {
    const imageUrl = await uploadImage();

    insertProduct(
      { name, price: parseFloat(price), image: imageUrl },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      }
    );
  };

  const onUpdate = async () => {
    const imageUrl = await uploadImage();

    updateProduct(
      { id, name, price: parseFloat(price), image: imageUrl ?? image },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      }
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onDelete = () => {
    deleteProduct(id, {
      onSuccess: () => {
        resetFields();
        router.replace('/(admin)');
      },
    });
  };

  const confirmDelete = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete this product?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!image?.startsWith('file://')) {
      // If image is already a URL from Supabase, just return it
      return image;
    }

    try {
      const base64 = await FileSystem.readAsStringAsync(image, {
        encoding: 'base64',
      });

      const filePath = `${randomUUID()}.png`;
      const contentType = 'image/png';

      const { data, error } = await supabase.storage
        .from('product-images') // ✅ check bucket name in Supabase dashboard
        .upload(filePath, decode(base64), { contentType, upsert: true });

      if (error) {
        console.error('Upload failed:', error.message);
        return null;
      }

      // Generate a public URL for the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error('Unexpected upload error:', err);
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isUpdating ? 'Update Product' : 'Create Product' }}
      />
      <Image
        source={{ uri: image || defaultPizzaImage }}
        style={styles.image}
      />
      <Text onPress={pickImage} style={styles.textButton}>
        Select Image
      </Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="name"
        style={styles.input}
      />

      <Text style={styles.label}>Price (R)</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="9.99"
        style={styles.input}
        keyboardType="numeric"
      />

      <Text style={{ color: 'red' }}>{error}</Text>

      <Button onPress={onSubmit} text={isUpdating ? 'Update' : 'Create'} />

      {isUpdating && (
        <Text onPress={confirmDelete} style={styles.deleteButton}>
          Delete
        </Text>
      )}
    </View>
  );
};

export default CreateProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 10,
  },
  label: {
    color: 'gray',
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
  image: {
    width: '50%',
    aspectRatio: 1,
    borderRadius: 9999, // ✅ round image
    alignSelf: 'center',
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginVertical: 10,
  },
  deleteButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: 'red',
    marginVertical: 20,
  },
});
