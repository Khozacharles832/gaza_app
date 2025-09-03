import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import products from '@assets/data/products';
import { defaultPizzaImage } from "@/components/productListItem";
import { useState } from "react";
import Button from "@/components/Button";

const sizes = ['None', 'Sauce', 'Drinks', 'Pap'];

const ProductDetailsScreen = () => {
    const { id } = useLocalSearchParams();

    const [selectedSize, setSelectedSize] = useState('None')
    
    const product = products.find((p) => p.id.toString() === id);

    const addToCart = () => {
      console.warn('Addinng to cart, extra:', selectedSize);
    }

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
    marginTop: 'auto',
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