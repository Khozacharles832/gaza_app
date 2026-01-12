import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
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
  const [selectedExtras, setSelectedExtras] = useState<{
    [groupId: string]: string[];
  }>({});

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
    addItem(product, selectedExtras);
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

          {/* Image with logo & price overlay */}
          <View style={styles.imageContainer}>
            <RemoteImage
              path={product.image}
              fallback={defaultPizzaImage}
              style={styles.image}
            />

            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>LOGO</Text>
            </View>

            <View style={styles.priceOverlay}>
              <Text style={styles.priceText}>R{product.price}</Text>
            </View>

              {/* Floating Order button */}
            <View style={styles.floatingOrderBtn}>
              <Button onPress={handleAddToCart} text="Order" />
            </View>
          </View>

          {/* Extras title */}
          <Text style={styles.sectionTitle}>Extras</Text>

          {/* Group Buttons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.groupButtons}
          >
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

          {/* Extras */}
          <View style={styles.extrasContainer}>
            {extrasGroups
              ?.find((g) => g.id === selectedGroup)
              ?.options.map((extra) => {
                const selected =
                  selectedExtras[selectedGroup!]?.includes(extra.id) || false;
                const multi =
                  extrasGroups.find((g) => g.id === selectedGroup)?.multi ||
                  false;

                return (
                  <Pressable
                    key={extra.id}
                    style={[
                      styles.extraOption,
                      selected && styles.extraSelected,
                    ]}
                    onPress={() =>
                      toggleExtra(selectedGroup!, extra.id, multi)
                    }
                  >
                    <Text style={styles.extraText}>
                      {extra.name} (+R{extra.price})
                    </Text>
                  </Pressable>
                );
              })}
          </View>
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  imageContainer: {
    position: "relative",
    marginBottom: 1,
  },

  image: {
    width: "100%",
    aspectRatio: 1,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: "hidden",
  },

logoBadge: {
  position: "absolute",
  top: 15,
  right: 15,
  width: 80,
  height: 80,
  backgroundColor: "#fff",
  borderRadius: 30,
  alignItems: "center",
  justifyContent: "center",
  elevation: 6,
},


logoText: {
  fontWeight: "bold",
  fontSize: 14,
},


  priceOverlay: {
    position: "absolute",
    bottom: 15,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 25,
  },

  priceText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 15,
    textAlign: "center",
  },

groupButtons: {
  flexGrow: 1,
  flexDirection: "row",
  justifyContent: "space-evenly",
  paddingHorizontal: 10,
},


  groupButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#f2f2f2",
    borderRadius: 25,
  },

  groupButtonSelected: {
    backgroundColor: "#007bff",
  },

  groupButtonText: {
    fontSize: 16,
  },

  groupButtonTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },

  extrasContainer: {
    marginHorizontal: 10,
    marginTop: 10,
  },

  extraOption: {
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginVertical: 5,
  },

  extraSelected: {
    backgroundColor: "#cce5ff",
  },

  extraText: {
    fontSize: 16,
  },

floatingOrderBtn: {
  position: "absolute",
  right: 20,
  bottom: -25, // sits on the image edge
  width: 130,
  shadowColor: "#007bff",
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.4,
  shadowRadius: 15,
  elevation: 12,
},


});
