import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import Colors from "../constants/Colors";
import { Product } from "../types";
import { Link, useSegments } from "expo-router";

export const defaultPizzaImage =
    'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

type ProductListItemProps = {
    product: Product;
};

const ProductListItem = ({ product }: ProductListItemProps) => {
  
    return (
      <Link href={`/menu/${product.id}`} asChild>
        <Pressable style={styles.container}>
            <Image 
            source={{ uri: product.image || defaultPizzaImage}} 
            style={styles.image}
            resizeMode="contain"
            />
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>R{product.price}</Text>
        </Pressable>
      </Link>
    );
};

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 20,
    flex: 1,
    maxWidth: '50%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffff',
  },
  price: {
    color: Colors.light.tint,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
});