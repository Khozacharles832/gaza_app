// components/AnimatedCheckoutButton.tsx
import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

type AnimatedCheckoutButtonProps = {
  title?: string;
  onPress: () => void;
};

export const AnimatedCheckoutButton = ({
  title = "Proceed >>",
  onPress,
}: AnimatedCheckoutButtonProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withTiming(0.95, { duration: 100, easing: Easing.out(Easing.ease) });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 100, easing: Easing.out(Easing.ease) });
      }}
      onPress={onPress}
    >
      <Animated.View style={[styles.button, animatedStyle]}>
        <Text style={styles.text}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#10B981", // Emerald green
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#059669", // darker green shadow
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
