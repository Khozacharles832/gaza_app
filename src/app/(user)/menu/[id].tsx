import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { useState } from "react";
import Button from "@/components/Button";
import { useCart } from "@/providers/CartProvider";
import { useProduct } from "@/api/products";
import { useProductExtras } from "@/api/extras";
import RemoteImage from "@/components/RemoteImage";
import { defaultPizzaImage } from "@/components/productListItem";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductDetailsScreen() {
  const { id: idString } = useLocalSearchParams();
  const id = Number(idString);

  const { data: product, isLoading, error } = useProduct(id);
  const { data: extrasGroups } = useProductExtras(id);
  const { addItem } = useCart();
  const router = useRouter();

  const [selectedGroup, setSelectedGroup] = useState<string | null>(
    extrasGroups?.[0]?.id || null
  );
  const [selectedExtras, setSelectedExtras] = useState<{ [groupId: string]: string[] }>({});

  const toggleExtra = (groupId: string, extraId: string, multi: boolean) => {
    setSelectedExtras((prev) => {
      const groupSelection = prev[groupId] || [];
      if (multi) {
        return {
          ...prev,
          [groupId]: groupSelection.includes(extraId)
            ? groupSelection.filter((id) => id !== extraId)
            : [...groupSelection, extraId],
        };
      } else {
        return { ...prev, [groupId]: [extraId] };
      }
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, selectedExtras); // pass extras per item
    router.push("/cart");
  };

  if (isLoading) return <ActivityIndicator style={{ marginTop: 50 }} />;
  if (error) return <Text>Failed to fetch product</Text>;
  if (!product) return <Text>Product not found</Text>;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Stack.Screen options={{ title: product.name }} />
          <RemoteImage path={product.image} fallback={defaultPizzaImage} style={styles.image} />

          <Text style={styles.sectionTitle}>Extras</Text>

          {/* Group Buttons */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupButtons}>
            {extrasGroups?.map((group) => (
              <Pressable
                key={group.id}
                style={[
                  styles.groupButton,
                  selectedGroup === group.id && styles.groupButtonSelected,
                ]}
                onPress={() => setSelectedGroup(group.id)}
              >
                <Text
                  style={[
                    styles.groupButtonText,
                    selectedGroup === group.id && styles.groupButtonTextSelected,
                  ]}
                >
                  {group.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Extras for selected group */}
          <View style={styles.extrasContainer}>
            {extrasGroups
              ?.find((g) => g.id === selectedGroup)
              ?.options.map((extra) => {
                const selected = selectedExtras[selectedGroup!]?.includes(extra.id) || false;
                const multi = extrasGroups.find((g) => g.id === selectedGroup)?.multi || false;

                return (
                  <Pressable
                    key={extra.id}
                    style={[styles.extraOption, selected && styles.extraSelected]}
                    onPress={() => toggleExtra(selectedGroup!, extra.id, multi)}
                  >
                    <Text style={styles.extraText}>{extra.name} (+R{extra.price})</Text>
                  </Pressable>
                );
              })}
          </View>

          {/* Product Price */}
          <Text style={styles.price}>R{product.price}</Text>
        </ScrollView>

        {/* Sticky Add to Cart button */}
        <View style={styles.stickyButtonWrapper}>
          <Button onPress={handleAddToCart} text="Add to Cart" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 140 }, // extra space for sticky button
  image: { width: "100%", aspectRatio: 1 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", margin: 10, color: "red" },
  groupButtons: { flexDirection: "row", paddingHorizontal: 10, marginBottom: 10 },
  groupButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#f2f2f2",
    borderRadius: 25,
    marginRight: 10,
  },
  groupButtonSelected: { backgroundColor: "#007bff" },
  groupButtonText: { fontSize: 16 },
  groupButtonTextSelected: { color: "#fff", fontWeight: "bold" },
  extrasContainer: { marginHorizontal: 10 },
  extraOption: {
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginVertical: 3,
  },
  extraSelected: { backgroundColor: "#cce5ff" },
  extraText: { fontSize: 16 },
  price: { fontSize: 18, fontWeight: "bold", color: "green", margin: 10 },
  stickyButtonWrapper: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
});
