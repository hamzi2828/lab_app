import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import LoginScreen from "./auth/LoginScreen";
import LoadingScreen from "./auth/LoadingScreen";
import AppNavigator from "./appnavigator/AppNavigator";
const Index = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" />
      {loading ? <LoadingScreen /> : <LoginScreen />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#fff",
  },
});

export default Index;
