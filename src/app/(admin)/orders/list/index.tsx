import { Text, FlatList, ActivityIndicator, Image, View, StyleSheet } from "react-native";
import OrderListItem from "@/components/OrderListItem";
import { useAdminOrderList } from "@/api/orders";
import { useInsertOrderSubscription } from "@/api/orders/subscriptions";

export default function OrderScreen() {
    const { 
        data: orders,
        isLoading, 
        error,
     } = useAdminOrderList({ archived: false});
    
     useInsertOrderSubscription();
     
    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (error) {
        return <Text>!</Text>
    }

    return (
        <FlatList
         data={orders}
          renderItem={({ item }) => <OrderListItem order={item} />}
          contentContainerStyle={{ gap: 10, padding: 10}}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>🛒 No Orders Yet...</Text>
          </View>
        }
          />
    )
}

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 18,
        marginBottom: 15,
        color: 'gray',
    }
})