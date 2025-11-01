import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { Tables } from "../types";
import { Link } from "expo-router";
import RemoteImage from "./RemoteImage";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient"; // ✅ updated import

const { width } = Dimensions.get("window");

export const defaultPizzaImage =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";

type ProductListItemProps = {
  product: Tables<"products">;
};

const ProductListItem = ({ product }: ProductListItemProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  return (
<Link href={`/menu/${product.id}`} asChild>
  <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
    <Animated.View style={[styles.card, animatedStyle]}>
      <View style={styles.imageWrapper}>
        <RemoteImage
          path={product.image}
          fallback={defaultPizzaImage}
          style={styles.image}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.5)"]}
          style={styles.gradientOverlay}
        />
        <Text style={styles.price}>R{product.price}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {product.name}
        </Text>
      </View>
    </Animated.View>
  </Pressable>
</Link>

  );
};

export default ProductListItem;

const styles = StyleSheet.create({
  card: {
    width: width * 1,
    marginVertical: 16,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    overflow: "hidden",
  },
  imageWrapper: {
    width: "100%",
    height: 220,
    position: "relative",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "40%",
  },
  info: {
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  price: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    fontWeight: "700",
    fontSize: 20,
    color: "red",
  },
});
