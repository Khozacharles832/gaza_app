import { Link, Stack } from "expo-router";
import { Pressable, Animated, Easing, View, StyleSheet } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useEffect, useRef } from "react";
import { useCart } from "@/providers/CartProvider";

export default function MenuStack() {
  const { items } = useCart();

  // Two pulse animations for continuous radar effect
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (items.length === 0) return;

    const animatePulse = (anim: Animated.Value, delay = 0) => {
      const run = () => {
        anim.setValue(0);
        Animated.timing(anim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(() => {
          setTimeout(run, 1800); // repeats every ~3s
        });
      };
      setTimeout(run, delay);
    };

    animatePulse(pulse1, 0);
    animatePulse(pulse2, 600); // stagger second pulse for smoother effect
  }, [items]);

  // Interpolations
  const getScale = (anim: Animated.Value) =>
    anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 2.5] });
  const getOpacity = (anim: Animated.Value) =>
    anim.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0.6, 0.3, 0] });

  return (
    <Stack
      screenOptions={{
        headerRight: () => (
          <Link href="/cart" asChild>
            <Pressable>
              {({ pressed }) => (
                <View style={{ marginRight: 15, alignItems: "center" }}>
                  <FontAwesome5
                    name="wallet"
                    size={25}
                    color={"#084137"}
                    style={{ opacity: pressed ? 0.5 : 1 }}
                  />

                  {items.length > 0 && (
                    <>
                      <Animated.View
                        style={[
                          styles.pulse,
                          {
                            transform: [{ scale: getScale(pulse1) }],
                            opacity: getOpacity(pulse1),
                          },
                        ]}
                      />
                      <Animated.View
                        style={[
                          styles.pulse,
                          {
                            transform: [{ scale: getScale(pulse2) }],
                            opacity: getOpacity(pulse2),
                          },
                        ]}
                      />
                    </>
                  )}
                </View>
              )}
            </Pressable>
          </Link>
        ),
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "bold",
          color: "#FE8C00",
          fontFamily: "inter",
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Menu" }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  pulse: {
    position: "absolute",
    top: -5,
    left: -5,
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    borderWidth: 2,
    borderColor: "red",
  },
});
