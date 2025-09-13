import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Image, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { defaultPizzaImage } from "@/components/productListItem";
import { useState } from "react";
import Button from "@/components/Button";
import { useCart } from "@/providers/CartProvider";
import { PizzaSize } from "@/types";
import { useProduct } from "@/api/products";
import RemoteImage from "@/components/RemoteImage";

const sizes: PizzaSize[] = ['None', 'Sauce', 'Drinks', 'Pap'];

const ProductDetailsScreen = () => {
    const { id: idString } = useLocalSearchParams();
    const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);

    const { data: product, error, isLoading } = useProduct(id);
    const { addItem } = useCart();
    const router = useRouter();

    const [selectedSize, setSelectedSize] = useState<PizzaSize>('None')
    
    const addToCart = () => {
      if (!product) {
        return;
      }
      addItem(product, selectedSize);
      router.push('/cart');
    };

    if (isLoading) {
      return <ActivityIndicator /> 
    }
    
    if (error) {
      return <Text>Failed to fetch Products</Text>
    }

    if (!product) {
      return <Text>Product not found!</Text>
    }

    return (
        <View style={styles.container}>
        <Stack.Screen options={{ title: product.name}} />
        <RemoteImage 
          path={product.image}
          fallback={defaultPizzaImage}
        style={styles.image}
        />

        <Text style={{ color: 'red' }}>Extras</Text>
        <View style={styles.sizes}>
          {sizes.map((size) => (
            <Pressable 
              onPress={() => { setSelectedSize(size) }}
            style={[styles.size,
              {
                backgroundColor: selectedSize === size ? 'blue' : 'white',
              },
            ]}
            key={size}>
              <Text
                style={[
                  styles.sizeText,
                  {
                    color: selectedSize === size ? 'red' : 'black',
                  },
                ]}
              >
                {size}
              </Text>
            </Pressable>
        ))}
        </View>

        <Text style={styles.price}>R{product.price}</Text>
        <Button onPress={ addToCart } text="Add to cart" />
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
    //marginTop: 'auto',
  },
  sizes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
    size: {
    backgroundColor: 'gainsboro',
    width: 70,
    aspectRatio: 2,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
    sizeText: {
    fontSize: 20,
    //fontWeight: '500',
    //color: 'blue',
  },
});