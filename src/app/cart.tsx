import { View, Text, FlatList, StyleSheet, Pressable, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useCart } from "@/providers/CartProvider";
import React, { useState } from "react";
import CartListItem from "@/components/CartListItem";
import { useRouter } from "expo-router";

const CartScreen = () => {
  const { items, total, checkout } = useCart();
  const router = useRouter();

  const [deliveryType, setDeliveryType] = useState<"delivery" | "collection">("delivery");

  const DELIVERY_FEE = deliveryType === "delivery" ? 15 : 0;
  const TAX_RATE = 0.1;
  const tax = total * TAX_RATE;
  const grandTotal = total + DELIVERY_FEE + tax;

  // Directly pass paymentMethod on button press
  const handleCashCheckout = () => checkout("cash", deliveryType);
  const handleCardCheckout = () => checkout("card", deliveryType);

  return (
    <View style={{ flex: 1 }}>
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>🛒 Your cart is empty</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Place Order</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={({ item }) => <CartListItem cartItem={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 10, gap: 10, flexGrow: 1 }}
          />

          {/* Checkout Modal */}
          <View style={styles.checkoutContainer}>
            {/* Delivery / Collection Toggle */}
            <View style={styles.toggleContainer}>
              {["delivery", "collection"].map((type) => (
                <Pressable
                  key={type}
                  onPress={() => setDeliveryType(type as "delivery" | "collection")}
                  style={[
                    styles.toggleButton,
                    deliveryType === type && styles.toggleButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      deliveryType === type && styles.toggleTextActive,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Payment Buttons */}
            <View style={styles.paymentButtonsContainer}>
              <Pressable
                onPress={handleCashCheckout}
                style={[styles.paymentButton, styles.cashButton]}
              >
                <Text style={styles.paymentTextActive}>Pay with Cash</Text>
              </Pressable>

              <Pressable
                onPress={handleCardCheckout}
                style={[styles.paymentButton, styles.cardButton]}
              >
                <Text style={styles.paymentTextActive}>Pay with Card</Text>
              </Pressable>
            </View>

            {/* Total Summary */}
            <View style={styles.summaryContainer}>
              <Text style={styles.totalText}>Total: R{grandTotal.toFixed(2)}</Text>
            </View>
          </View>
        </>
      )}

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 20, color: "gray", marginBottom: 20 },
  backButton: { backgroundColor: "#ff6b00", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  backButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  checkoutContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
    elevation: 10,
  },
  toggleContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 20, borderRadius: 12, overflow: "hidden", backgroundColor: "#f0f0f0" },
  toggleButton: { flex: 1, paddingVertical: 12, alignItems: "center" },
  toggleButtonActive: { backgroundColor: "#ff6b00" },
  toggleText: { fontSize: 16, color: "#555", fontWeight: "500" },
  toggleTextActive: { color: "#fff", fontWeight: "700" },

  paymentButtonsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  paymentButton: { flex: 1, marginHorizontal: 5, paddingVertical: 16, borderRadius: 12, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 3 } },
  cashButton: { backgroundColor: "#4caf50" },
  cardButton: { backgroundColor: "#2196f3" },
  paymentTextActive: { color: "#fff", fontWeight: "700", fontSize: 16 },

  summaryContainer: { alignItems: "center", marginBottom: 15 },
  totalText: { fontSize: 22, fontWeight: "bold", color: "#333" },
});

export default CartScreen;
