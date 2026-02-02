

import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { CartItem } from "../types";
import { useCart } from "../providers/CartProvider";
import { defaultPizzaImage } from "./productListItem";

type Props = {
  cartItem: CartItem;
};

export default function CartListItem({ cartItem }: Props) {
  const { updateQuantity } = useCart();

  const extrasTotal =
    cartItem.extras?.reduce(
      (sum, ex) => sum + ex.price * ex.qty,
      0
    ) ?? 0;

  const unitPrice = cartItem.product.price + extrasTotal;
  const lineTotal = unitPrice * cartItem.quantity;

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: cartItem.product.image || defaultPizzaImage }}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.title}>
          {cartItem.product.name}
        </Text>

        {!!cartItem.extras?.length && (
          <View style={styles.extras}>
            {cartItem.extras.map(ex => (
              <Text key={ex.id} style={styles.extraText}>
                • {ex.name} × {ex.qty}
              </Text>
            ))}
          </View>
        )}

        <Text style={styles.unitPrice}>
          R{unitPrice.toFixed(2)} each
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={styles.lineTotal}>
          R{lineTotal.toFixed(2)}
        </Text>

        <View style={styles.qtyControls}>
          <Pressable
            onPress={() => updateQuantity(cartItem.id, -1)}
            style={styles.qtyBtn}
          >
            <FontAwesome name="minus" size={14} />
          </Pressable>

          <Text style={styles.qty}>
            {cartItem.quantity}
          </Text>

          <Pressable
            onPress={() => updateQuantity(cartItem.id, 1)}
            style={styles.qtyBtn}
          >
            <FontAwesome name="plus" size={14} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,

    // Shadow
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  extras: {
    marginBottom: 4,
  },
  extraText: {
    fontSize: 13,
    color: "#666",
  },
  unitPrice: {
    fontSize: 13,
    color: "#888",
  },
  right: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  lineTotal: {
    fontSize: 16,
    fontWeight: "700",
    color: "#007bff",
  },
  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  qtyBtn: {
    padding: 6,
  },
  qty: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 6,
  },
});
