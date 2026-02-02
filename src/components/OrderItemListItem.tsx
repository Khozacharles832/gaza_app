import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';
import { OrderItem } from '../types';
import { defaultPizzaImage } from './productListItem';
import { Tables } from '@/database.types';
import RemoteImage from './RemoteImage';

type OrderItemListItemProps = {
  item: { products: Tables<'products'> } & Tables<'order_items'>;
};

const OrderItemListItem = ({ item }: OrderItemListItemProps) => {
  const extrasTotal =
    item.extras?.reduce(
      (sum, ex) => sum + ex.price * ex.qty,
      0
    ) ?? 0;

  const itemTotal =
    (item.products.price + extrasTotal) * item.quantity;

  return (
    <View style={styles.card}>
      <RemoteImage
        path={item.products.image}
        fallback={defaultPizzaImage}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.products.name}</Text>

        {/* Extras */}
        {item.extras?.length > 0 && (
          <View style={styles.extrasContainer}>
            {item.extras.map(ex => (
              <Text key={ex.id} style={styles.extraText}>
                • {ex.name} ×{ex.qty}
              </Text>
            ))}
          </View>
        )}

        <Text style={styles.price}>
          R{itemTotal.toFixed(2)}
        </Text>
      </View>

      <View style={styles.qtyBadge}>
        <Text style={styles.qtyText}>×{item.quantity}</Text>
      </View>


    </View>
  );
};


const styles = StyleSheet.create({
card: {
  backgroundColor: "#FFFFFF",
  borderRadius: 16,
  padding: 12,
  flexDirection: "row",
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 10,
  elevation: 3,
},

image: {
  width: 70,
  height: 70,
  marginRight: 12,
},

title: {
  fontSize: 16,
  fontWeight: "700",
  marginBottom: 4,
},

extrasContainer: {
  marginBottom: 6,
},

extraText: {
  fontSize: 13,
  color: "#6B7280",
},

price: {
  fontSize: 15,
  fontWeight: "700",
  color: "#111827",
},

qtyBadge: {
  backgroundColor: "#F3F4F6",
  borderRadius: 20,
  paddingHorizontal: 10,
  paddingVertical: 4,
  marginLeft: 8,
},

qtyText: {
  fontWeight: "700",
},

});

export default OrderItemListItem;