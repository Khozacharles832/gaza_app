import { StyleSheet, Text, View, Pressable } from "react-native";
import Colors from "../constants/Colors";
import { Tables } from "../types";
import { Link } from "expo-router";
import RemoteImage from "./RemoteImage";

export const defaultPizzaImage =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";

type ProductListItemProps = {
  product: Tables<"products">;
};

const ProductListItem = ({ product }: ProductListItemProps) => {
  return (
    <Link href={`/menu/${product.id}`} asChild>
      <Pressable style={styles.card}>
        <RemoteImage
          path={product.image}
          fallback={defaultPizzaImage}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.price}>R{product.price}</Text>
        </View>
      </Pressable>
    </Link>
  );
};

export default ProductListItem;

const styles = StyleSheet.create({
  card: {
    //flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.25,
    borderColor: 'blue',
    borderRadius: 20,
    padding: 0,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 8,
    backgroundColor: 'white',
    position: 'relative',

  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 150,
    //marginRight: 16,
    //top: -40,
  },
  info: {
    flex: 2,
    //justifyContent: "center",
    //marginLeft: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: Colors.light.text,
    marginBottom: 0,
    marginTop: 100,
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    //fontWeight: "bold",
    color: Colors.light.tint,
    //paddingRight: 0,
    //bottom: 0,
    //position: 'absolute',
    //right: 0,
    marginBottom: 16,
  },
});