import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState, useMemo } from "react";
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

  const [extrasOpen, setExtrasOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const [selectedExtras, setSelectedExtras] = useState<{
    [groupId: string]: { [extraId: string]: number };
  }>({});

  const changeExtraQty = (groupId: string, extraId: string, delta: number) => {
    setSelectedExtras((prev) => {
      const group = prev[groupId] || {};
      const current = group[extraId] || 0;
      const next = current + delta;

      if (next <= 0) {
        const { [extraId]: _, ...rest } = group;
        return { ...prev, [groupId]: rest };
      }

      return {
        ...prev,
        [groupId]: {
          ...group,
          [extraId]: next,
        },
      };
    });
  }; 

  const buildCartExtras = () => {
  if (!extrasGroups) return [];

  const extras: {
    id: string;
    name: string;
    price: number;
    qty: number;
  }[] = [];

  for (const group of extrasGroups) {
    for (const option of group.options) {
      const qty = selectedExtras[group.id]?.[option.id] ?? 0;

      if (qty > 0) {
        extras.push({
          id: option.id,
          name: option.name,
          price: option.price,
          qty,
        });
      }
    }
  }

  return extras;
};


  const livePrice = useMemo(() => {
    if (!product || !extrasGroups) return 0;

    let total = product.price;

    for (const group of extrasGroups) {
      for (const extra of group.options) {
        const qty = selectedExtras[group.id]?.[extra.id] || 0;
        total += qty * extra.price;
      }
    }

    return total;
  }, [product, extrasGroups, selectedExtras]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, buildCartExtras());
    router.push("/cart");
  };

  if (isLoading) return <ActivityIndicator style={{ marginTop: 50 }} />;
  if (error) return <Text>Failed to fetch product</Text>;
  if (!product) return <Text>Product not found</Text>;

  return (
    <Pressable style={{ flex: 1 }} onPress={() => setExtrasOpen(false)}>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Stack.Screen options={{ title: product.name }} />

            {/* Image */}
            <View style={styles.imageContainer}>
              <RemoteImage
                path={product.image}
                fallback={defaultPizzaImage}
                style={styles.image}
              />

              <View style={styles.logoBadge}>
                <Text style={styles.logoText}>Gaza Kitchen</Text>
              </View>

              <View style={styles.priceOverlay}>
                <Text style={styles.priceText}>R{livePrice.toFixed(2)}</Text>
              </View>

              <View style={styles.floatingOrderBtn}>
                <Button onPress={handleAddToCart} text="Order" />
              </View>
            </View>

            <Pressable onPress={(e) => e.stopPropagation()}>
              <Text
                style={styles.sectionTitle}
                onPress={() => setExtrasOpen(!extrasOpen)}
              >
                Extras
              </Text>

              {extrasOpen && (
                <>
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
                          selectedGroup === group.id &&
                            styles.groupButtonSelected,
                        ]}
                        onPress={() => setSelectedGroup(group.id)}
                      >
                        <Text
                          style={[
                            styles.groupButtonText,
                            selectedGroup === group.id &&
                              styles.groupButtonTextSelected,
                          ]}
                        >
                          {group.name}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>

                  <View style={styles.extrasContainer}>
                    {extrasGroups
                      ?.find((g) => g.id === selectedGroup)
                      ?.options.map((extra) => {
                        const qty =
                          selectedExtras[selectedGroup!]?.[extra.id] || 0;

                        return (
                          <View key={extra.id} style={styles.extraRow}>
                            <Text style={styles.extraText}>
                              {extra.name} (+R{extra.price})
                            </Text>

                            <View style={styles.qtyControls}>
                              <Pressable
                                style={styles.qtyBtn}
                                onPress={() =>
                                  changeExtraQty(
                                    selectedGroup!,
                                    extra.id,
                                    -1
                                  )
                                }
                              >
                                <Text style={styles.qtyText}>−</Text>
                              </Pressable>

                              <Text style={styles.qtyNumber}>{qty}</Text>

                              <Pressable
                                style={styles.qtyBtn}
                                onPress={() =>
                                  changeExtraQty(
                                    selectedGroup!,
                                    extra.id,
                                    1
                                  )
                                }
                              >
                                <Text style={styles.qtyText}>+</Text>
                              </Pressable>
                            </View>
                          </View>
                        );
                      })}
                  </View>
                </>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 120 },

  imageContainer: { position: "relative" },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  logoBadge: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 60,
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },

  logoText: { fontWeight: "bold", fontSize: 14 },

  priceOverlay: {
    position: "absolute",
    bottom: 15,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 25,
  },

  priceText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  floatingOrderBtn: {
    position: "absolute",
    right: 20,
    bottom: -25,
    width: 130,
    shadowColor: "#51ff00ff",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 12,

  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
  },

  groupButtons: {
    flexGrow: 1,
    justifyContent: "space-evenly",
    paddingHorizontal: 10,
  },

  groupButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#f2f2f2",
    borderRadius: 25,
  },

  groupButtonSelected: { backgroundColor: "#007bff" },
  groupButtonText: { fontSize: 16 },
  groupButtonTextSelected: { color: "#fff", fontWeight: "bold" },

  extrasContainer: { padding: 10 },

  extraRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginVertical: 6,
  },

  extraText: { fontSize: 16 },

  qtyControls: { flexDirection: "row", alignItems: "center" },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
  },

  qtyText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  qtyNumber: { marginHorizontal: 10, fontSize: 16, fontWeight: "bold" },
});
