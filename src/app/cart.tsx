import { View, Text, ScrollView, StyleSheet, Pressable, Animated } from "react-native";
import { useCart } from "@/providers/CartProvider";
import CartListItem from "@/components/CartListItem";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { AnimatedCheckoutButton } from "@/components/AnimatedCheckoutButton";

export default function CartScreen() {
  const { items, total } = useCart();
  const router = useRouter();

  const subtotal = total;
  const deliveryFee = 0;
  const grandTotal = subtotal + deliveryFee;

  // Button press animation
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();

  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Order</Text>

      {/* EMPTY CART STATE */}
      {items.length === 0 && (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Your cart is empty 🛒</Text>
          <Text style={styles.emptySubtitle}>
            Hungry? Let’s fix that.
          </Text>

          <Pressable
            onPress={() => router.push("/(user)/menu")}
            style={styles.placeOrderBtn}
          >
            <Text style={styles.placeOrderText}>Place Order</Text>
          </Pressable>
        </View>
      )}

      {/* CART ITEMS */}
      <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
        {items.map(item => (
          <CartListItem key={item.id} cartItem={item} />
        ))}
      </ScrollView>

      {/* SUMMARY */}
      {items.length > 0 && (
        <View style={styles.summary}>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>R{subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Delivery</Text>
            <Text style={styles.value}>Free</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              R{grandTotal.toFixed(2)}
            </Text>
          </View>

          <AnimatedCheckoutButton
            title="Proceed >>"
            onPress={() => router.push("/(modals)/checkout")}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingTop: 60,
  },

  header: {
    fontSize: 26,
    fontWeight: "800",
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  /* EMPTY STATE */
  emptyWrap: {
    marginTop: 120,
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 24,
    textAlign: "center",
  },
  placeOrderBtn: {
    backgroundColor: "#16A34A",
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 999,
    shadowColor: "#16A34A",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  placeOrderText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  /* SUMMARY */
  summary: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: "#6B7280",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "800",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#16A34A",
  },

  /* CHECKOUT BUTTON */
  checkoutBtn: {
    backgroundColor: "#16A34A",
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#16A34A",
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
});
