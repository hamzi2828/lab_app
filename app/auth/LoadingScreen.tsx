import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/mainlogo.png")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingScreen;
