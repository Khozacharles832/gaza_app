import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Image, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { defaultPizzaImage } from "@/components/productListItem";
import { useState } from "react";
import Button from "@/components/Button";
import { useCart } from "@/providers/CartProvider";
import { PizzaSize } from "@/types";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useProduct } from "@/api/products";

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

    return (
        <View style={styles.container}>
                    <Stack.Screen 
                    options={{ title: 'Menu',
                      headerRight: () => (
                        <Link href={`/(admin)/menu/create?id=${id}`} asChild>
                          <Pressable>
                            {({ pressed }) => (
                              <FontAwesome
                                name="pencil"
                                size={25}
                                color={Colors.light.tint}
                                style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                              />
                            )}
                          </Pressable>
                        </Link>
                      ),
        }} />
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