import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useCart } from "@/providers/CartProvider";
import CartListItem from "@/components/CartListItem";
import { useRouter } from "expo-router";

export default function CartScreen() {
  const { items, total } = useCart();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Order</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
        {items.length === 0 && (
          <Text style={styles.empty}>Your cart is empty.</Text>
        )}

        {items.map(item => (
          <CartListItem key={item.id} cartItem={item} />
        ))}
      </ScrollView>

      {/* Summary */}
      {items.length > 0 && (
        <View style={styles.summary}>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>R{total.toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Delivery</Text>
            <Text style={styles.value}>Free</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R{total.toFixed(2)}</Text>
          </View>

        <Pressable
          onPress={() => router.push("/(modals)/checkout")}
          style={styles.checkoutBtn}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
      </Pressable>

        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    paddingTop: 60,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  empty: {
    textAlign: "center",
    marginTop: 80,
    color: "#777",
    fontSize: 16,
  },
  summary: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: "#777",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007bff",
  },
  checkoutBtn: {
  backgroundColor: "#E11D48", // rich red
  borderRadius: 28,
  paddingVertical: 16,
  paddingHorizontal: 24,
  alignItems: "center",
  justifyContent: "center",
  marginHorizontal: 16,
  marginBottom: 12,

  // Floating feel
  shadowColor: "#E11D48",
  shadowOpacity: 0.35,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 6 },
  elevation: 6,
},

checkoutText: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "700",
  letterSpacing: 0.4,
},

});

