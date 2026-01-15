import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useCart } from "@/providers/CartProvider";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function CheckoutModal() {
  const { items, total, checkout } = useCart();
  const router = useRouter();

  const [deliveryType, setDeliveryType] = useState<"delivery" | "collection">("delivery");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");

  return (
    <View style={styles.container}>
      <View style={styles.handle} />
      <Text style={styles.title}>Checkout</Text>

      <ScrollView>
        {/* Order Summary */}
        {items.map(item => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.itemName}>
              {item.product.name} x{item.quantity}
            </Text>

            {item.extras?.map(ex => (
              <Text key={ex.id} style={styles.extra}>
                • {ex.name} x{ex.qty}
              </Text>
            ))}
          </View>
        ))}

        {/* Delivery type */}
        <Text style={styles.section}>Delivery method</Text>
        <View style={styles.row}>
          <Pressable
            style={[styles.choice, deliveryType === "delivery" && styles.selected]}
            onPress={() => setDeliveryType("delivery")}
          >
            <Text>Delivery</Text>
          </Pressable>
          <Pressable
            style={[styles.choice, deliveryType === "collection" && styles.selected]}
            onPress={() => setDeliveryType("collection")}
          >
            <Text>Collection</Text>
          </Pressable>
        </View>

        {/* Payment */}
        <Text style={styles.section}>Payment</Text>
        <View style={styles.row}>
          <Pressable
            style={[styles.choice, paymentMethod === "cash" && styles.selected]}
            onPress={() => setPaymentMethod("cash")}
          >
            <Text>Cash</Text>
          </Pressable>
          <Pressable
            style={[styles.choice, paymentMethod === "card" && styles.selected]}
            onPress={() => setPaymentMethod("card")}
          >
            <Text>Card</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Total & Place Order */}
      <View style={styles.footer}>
        <Text style={styles.total}>Total: R{total.toFixed(2)}</Text>

        <Pressable
          style={styles.placeOrder}
          onPress={async () => {
            await checkout(paymentMethod, deliveryType);
            router.dismissAll();
          }}
        >
          <Text style={styles.placeOrderText}>Place Order</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
  },
  handle: {
    width: 50,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemName: { fontWeight: "600", fontSize: 16 },
  extra: { marginLeft: 10, color: "#666" },
  section: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  choice: {
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "40%",
    alignItems: "center",
  },
  selected: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  placeOrder: {
    backgroundColor: "#007bff",
    padding: 18,
    borderRadius: 25,
    alignItems: "center",
  },
  placeOrderText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
