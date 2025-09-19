import { View, Text, Platform, FlatList, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useCart } from "@/providers/CartProvider";
import React, { useState } from "react";
import CartListItem from "@/components/CartListItem";
import Button from "@/components/Button";
import { useRouter } from "expo-router";

const DELIVERY_FEE = 15;
const TAX_RATE = 0.1; // 10%

const CartScreen = () => {
  const { items, total, checkout } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const tax = total * TAX_RATE;
  const grandTotal = total + DELIVERY_FEE + tax;


  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={items}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        contentContainerStyle={{ padding: 10, gap: 10, flexGrow: 1 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>🛒 Your cart is empty</Text>
            <Button text="Place Order..." onPress={() => router.back()} />
          </View>
        }
      />

      {items.length > 0 && (
        <>
          {/* 🧾 Payment Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Subtotal</Text>
              <Text style={styles.value}>R{total.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Delivery</Text>
              <Text style={styles.value}>R{DELIVERY_FEE.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Tax (10%)</Text>
              <Text style={styles.value}>R{tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>R{grandTotal.toFixed(2)}</Text>
            </View>
          </View>

          <Button onPress={checkout} text="Oder Now" />
        </>
      )}

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
};

const styles = StyleSheet.create({
  summaryContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: "gray",
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 15,
    color: "gray",
  },
});

export default CartScreen;
