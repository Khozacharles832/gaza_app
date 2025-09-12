import { View, FlatList, ActivityIndicator, Text } from "react-native";
import ProductListItem from "@components/productListItem";
import { useProductList } from "@/api/products";
import Colors from "@/constants/Colors";

export default function MenuScreen() {
  const { data: products, error, isLoading } = useProductList();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch Products</Text>;
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ProductListItem product={item} />
      )}
      contentContainerStyle={{ 
        paddingBottom: 60,
        paddingHorizontal: 20, 
        backgroundColor: Colors.light.background,
        }}
    />
  );
}
