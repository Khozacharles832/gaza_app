import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import * as SplashScreen from "expo-splash-screen";
import { MotiView, MotiText } from "moti";

SplashScreen.preventAutoHideAsync();

const AnimatedSplash = ({ onAnimationFinish }: { onAnimationFinish: () => void }) => {
  useEffect(() => {
    const start = async () => {
      // Wait for 300ms before hiding native splash so Lottie is ready
      await new Promise((resolve) => setTimeout(resolve, 300));
      await SplashScreen.hideAsync(); // hides native splash right before animation starts
    };

    start();

    const timeout = setTimeout(() => {
      onAnimationFinish();
    }, 2800); // total animation duration

    return () => clearTimeout(timeout);
  }, []);

  return (
    <LinearGradient colors={["#FE8C00", "#F83600"]} style={styles.container}>
      {/* Animated Lottie logo */}
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 1000 }}
        style={styles.animationContainer}
      >
        <LottieView
          source={require("../../assets/animations/Delivery.json")}
          autoPlay
          loop={false}
          style={styles.animation}
        />
      </MotiView>

      {/* App name fade in */}
      <MotiText
        from={{ opacity: 0, translateY: 15 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 1500, duration: 800 }}
        style={styles.text}
      >
        Gaza Kitchen
      </MotiText>
    </LinearGradient>
  );
};

export default AnimatedSplash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animationContainer: {
    width: 220,
    height: 220,
  },
  animation: {
    width: "100%",
    height: "100%",
  },
  text: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginTop: 20,
    letterSpacing: 1,
  },
});
