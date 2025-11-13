import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { Tables } from "../types";
import { Link } from "expo-router";
import RemoteImage from "./RemoteImage";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";

const { width } = Dimensions.get("window");

export const defaultPizzaImage =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";

type ProductListItemProps = {
  product: Tables<"products">;
};

const ProductListItem = ({ product }: ProductListItemProps) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  // Animate in when rendered
  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
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

            {/* Vibrant gradient overlay */}
            <LinearGradient
              colors={[
                "rgba(0,0,0,0.1)",
                "rgba(0,0,0,0.4)",
                "rgba(0,0,0,0.75)",
              ]}
              style={styles.gradientOverlay}
            />

            {/* Floating price tag */}
            <Animated.View style={styles.priceContainer}>
              <Text style={styles.price}>R{product.price}</Text>
            </Animated.View>
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
    width: width * 0.5,
    alignSelf: "center",
    marginVertical: 16,
    borderRadius: 24,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    overflow: "hidden",
    padding: 2,
  },
  imageWrapper: {
    width: "100%",
    height: 220,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "60%",
    justifyContent: "flex-end",
  },
  info: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E1E1E",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  priceContainer: {
    position: "absolute",
    bottom: 18,
    right: 15,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.90,
    shadowRadius: 4,
    elevation: 9,
  },
  price: {
    fontWeight: "700",
    fontSize: 18,
    color: "#FF3B30",
  },
});
