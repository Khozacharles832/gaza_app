import { useOrderDetails } from '@/api/orders';
import { useUpdateOrderSubscription } from '@/api/orders/subscriptions';
import OrderItemListItem from '@/components/OrderItemListItem';
import OrderListItem from '@/components/OrderListItem';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

export  default function OrderDetailsScreen() {
    const { id: idString } = useLocalSearchParams();
    const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);

    const { data: order, isLoading, error } = useOrderDetails(id);
    useUpdateOrderSubscription(id);

if (isLoading) {
    return <ActivityIndicator />
}

if (error) {
    return <Text>Failed to fetch!.</Text>
}

    return ( 
        <View style={styles.screen}>
        <Stack.Screen options={{ title: `Order #${id}` }} />

        {/* Header */}
        <View style={styles.headerCard}>
            <Text style={styles.orderTitle}>Order #{id}</Text>
            <Text style={styles.status}>{order?.status}</Text>
        </View>

        <FlatList
            data={order?.order_items}
            renderItem={({ item }) => <OrderItemListItem item={item} />}
            contentContainerStyle={{ gap: 12 }}
            showsVerticalScrollIndicator={false}
        />
        </View>
        

    );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
  },

  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  orderTitle: {
    fontSize: 18,
    fontWeight: "800",
  },

  status: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
    textTransform: "capitalize",
  },
});
