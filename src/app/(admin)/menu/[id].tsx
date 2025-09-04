import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import products from '@assets/data/products';
import { defaultPizzaImage } from "@/components/productListItem";
import { useState } from "react";
import Button from "@/components/Button";
import { useCart } from "@/providers/CartProvider";
import { PizzaSize } from "@/types";

const sizes: PizzaSize[] = ['None', 'Sauce', 'Drinks', 'Pap'];

const ProductDetailsScreen = () => {
    const { id } = useLocalSearchParams();
    const { addItem } = useCart();
    const router = useRouter();

    const [selectedSize, setSelectedSize] = useState<PizzaSize>('None')
    
    const product = products.find((p) => p.id.toString() === id);

    const addToCart = () => {
      if (!product) {
        return;
      }
      addItem(product, selectedSize);
      router.push('/cart');
    };

    if (!product) {
        return <Text>Product not found</Text>;
    }
    return (
        <View style={styles.container}>
        <Stack.Screen options={{ title: product.name}} />
        <Image 
        source={{ uri: product.image || defaultPizzaImage }} 
        style={styles.image}
        />

        <Text style={styles.price}>R{product.price}</Text>
        </View>
    );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
 
});