import { View, Text, ActivityIndicator, ImageBackground, StyleSheet } from "react-native";
import React from "react";
import Button from "@/components/Button";
import { Link, Redirect } from "expo-router";
import { UseAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";

const index = () => {
  const { session, loading, isAdmin } = UseAuth();

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!session) {
    return <Redirect href={"/sign-in"} />;
  }

  if (!isAdmin) {
    return <Redirect href={"/(user)"} />;
  }

  return (
    <ImageBackground
      source={require("../../assets/images/logo.png")}
      style={styles.background}
      resizeMode="repeat"
    >
      <View style={styles.container}>
        <Link href={"/(user)"} asChild>
          <Button text="User" />
        </Link>
        <Link href={"/(admin)"} asChild>
          <Button text="Admin" />
        </Link>

        <Button onPress={() => supabase.auth.signOut()} text="Sign out" />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
});

export default index;
