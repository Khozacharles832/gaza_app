import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useCart } from "@/providers/CartProvider";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function CheckoutModal() {
  const { items, total, checkout } = useCart();
  const router = useRouter();

  const [deliveryType, setDeliveryType] =
    useState<"delivery" | "collection">("delivery");
  const [paymentMethod, setPaymentMethod] =
    useState<"cash" | "card">("cash");
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (loading) return;
    setLoading(true);
    router.dismissAll();
    await checkout(paymentMethod, deliveryType);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.handle} />
      <Text style={styles.title}>Checkout</Text>

      <ScrollView>
        {items.map(item => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.itemName}>
              {item.product.name} × {item.quantity}
            </Text>

            {item.extras?.map(ex => (
              <Text key={ex.id} style={styles.extra}>
                • {ex.name} × {ex.qty}
              </Text>
            ))}
          </View>
        ))}

        <Text style={styles.section}>Payment</Text>
        <View style={styles.row}>
          {(["cash", "card"] as const).map(method => (
            <Pressable
              key={method}
              style={[
                styles.choice,
                paymentMethod === method && styles.selected,
              ]}
              onPress={() => setPaymentMethod(method)}
            >
              <Text>{method}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.total}>Total: R{total.toFixed(2)}</Text>

        <Pressable
          style={[styles.placeOrder, loading && { opacity: 0.6 }]}
          disabled={loading}
          onPress={handleCheckout}
        >
          <Text style={styles.placeOrderText}>
            {loading ? "Processing…" : "Place Order"}
          </Text>
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
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemName: {
    fontWeight: "600",
    fontSize: 16,
    color: "#111",
  },
  extra: {
    marginLeft: 10,
    marginTop: 2,
    color: "#666",
    fontSize: 14,
  },
  section: {
    marginTop: 24,
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 20,
    color: "#111",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    paddingHorizontal: 12,
  },
  choice: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "42%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  selected: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#111",
  },
  placeOrder: {
    backgroundColor: "#007bff",
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",

    // Android
    elevation: 4,

    // iOS
    shadowColor: "#007bff",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  placeOrderText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.3,
  },
});

