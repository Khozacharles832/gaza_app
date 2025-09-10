import { View, Text, StyleSheet, TextInput, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Button from '@/components/Button';
import * as ImagePicker from 'expo-image-picker';
import { defaultPizzaImage } from '@/components/productListItem';
import Colors from '@/constants/Colors';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useInsertProduct, useProduct, useUpdateProduct, useDeleteProduct } from '@/api/products';

const CreateProductScreen = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState('');
    const [image, setImage] = useState('');

    const { id: idString } = useLocalSearchParams();
    const id = parseFloat(typeof idString === 'string' ? idString : idString?.[0]);
    const isUpdating = !!idString;

    const { mutate: insertProduct } = useInsertProduct();
    const { mutate: updateProduct } = useUpdateProduct();
    const {data: updatingProduct} = useProduct(id);
    const { mutate: deleteProduct } = useDeleteProduct();

    const router = useRouter();

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
            setError('Price is not a number!.');
            return false;
        }

        return true;

    };

    const onSubmit = () => {
        if (isUpdating) {
            // Update
            onUpdateCreate();
        } else {
            onCreate();
        }
    }

    const onCreate = () => {
        if (!validateInput()) {
            return;
        }
        
        // Save in the database
        insertProduct({ name, price: parseFloat(price), image}, {
            onSuccess: () => {
                resetFields();
                router.back();

            },
        });

        
    };

    const onUpdateCreate = () => {
        if (!validateInput()) {
            return;
        }
        // Save in the database
        updateProduct({ id, name, price: parseFloat(price), image}, 
        {
            onSuccess: () => {
                resetFields();
                router.back();
        }
    });


            }

    
    

    const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
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
        }
    })
  }

  const confirmDelete = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete this product', [
    {
      text: 'Cancel',
    },
    {
        text: 'Delete',
        style: 'destructive',
        onPress: onDelete,
    },
    ]);
  };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title:  isUpdating ? 'Update Product' : 'Create Product'}} />
            <Image source={{ uri: image || defaultPizzaImage}} style={styles.image} />
            <Text onPress={pickImage} style={styles.textButton}>Select Image</Text>

            <Text style={styles.label} >Name</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder='name' 
                style={styles.input} 
                
                />

        <Text style={styles.label} >Price (R)</Text>
        <TextInput
            value={price}
            onChangeText={setPrice}
            placeholder='9.99' 
            style={styles.input}
            keyboardType='numeric'
            />
        <Text style={{ color: 'red' }}>{error}</Text>
        <Button onPress={onSubmit} text={isUpdating ? 'Update' : 'Create'} />
        {isUpdating && <Text onPress={confirmDelete} style={styles.textButton}>Delete</Text>}
        </View>
    )
}

export default CreateProductScreen;

const styles = StyleSheet.create({
    container: {
       flex: 1,
       justifyContent: 'center', 
       padding: 10,
    },

    label: {
        color: 'gray',
        fontSize: 16,


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
        alignSelf: 'center',
    },

    textButton: {
       alignSelf: 'center',
       fontWeight: 'bold', 
       color: Colors.light.tint,
       marginVertical: 10,
    },
})