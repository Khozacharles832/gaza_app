import { OrderStatusList } from "@/types";
import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import Colors from "@/constants/Colors";
import { useOrderDetails, useUpdateOrder } from "@/api/orders";
import OrderItemListItem from "@/components/OrderItemListItem";

export default function OrderDetailsScreen() {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);

  const { data: order, isLoading, error } = useOrderDetails(id);
  const { mutate: updateOrder } = useUpdateOrder();

  const updateStatus = (status: string) => {
    updateOrder({ id: id, updatedField: { status } });
  };

  if (isLoading) return <ActivityIndicator style={{ marginTop: 50 }} />;
  if (error) return <Text>Failed to fetch order!</Text>;
  if (!order) return <Text>No orders yet...</Text>;

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#F9FAFB" }}>
      <Stack.Screen options={{ title: `Order #${id}` }} />

      {/* Header Card */}
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 14,
          padding: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          elevation: 3,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
        }}
      >
        <View>
          <Text style={{ fontSize: 18, fontWeight: "800" }}>Order #{order.id}</Text>
          <Text style={{ color: "#6B7280", marginTop: 2 }}>
            {order.order_items.length} item{order.order_items.length !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* Payment Status Badge */}
        <View
          style={{
            backgroundColor:
              order.payment === "paid"
                ? "#DCFCE7"
                : order.payment === "cash"
                ? "#FEF3C7"
                : "#E5E7EB",
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 999,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "800",
              letterSpacing: 0.5,
              color:
                order.payment === "paid"
                  ? "#166534"
                  : order.payment === "cash"
                  ? "#92400E"
                  : "#374151",
            }}
          >
            {order.payment?.toUpperCase() ?? "PENDING"}
          </Text>
        </View>
      </View>

      {/* Order Items List */}
      <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
        ListFooterComponent={
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 6 }}>Status</Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              {OrderStatusList.map((status) => (
                <Pressable
                  key={status}
                  onPress={() => updateStatus(status)}
                  style={{
                    borderColor: Colors.light.tint,
                    borderWidth: 1,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor: order.status === status ? Colors.light.tint : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color: order.status === status ? "white" : Colors.light.tint,
                      fontWeight: "600",
                    }}
                  >
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
      />
    </View>
  );
}
