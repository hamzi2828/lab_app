import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Ensure you install this package if you use Expo: `expo install @expo/vector-icons`

const DeliveryHeader = () => {
  return (
    <View style={styles.container}>
      {/* Left Text */}
      <Text style={styles.textLeft}>Delivery to</Text>

      {/* Right Icon and Text */}
      <View style={styles.rightContainer}>
        <MaterialIcons name="location-on" size={20} color="black" />
        <Text style={styles.textRight}>United Kingdom</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1, // Bottom border
    borderColor: "#e0e0e0", // Light gray border
    width: "100%",
  },
  textLeft: {
    fontSize: 16,
    color: "black",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textRight: {
    fontSize: 16,
    color: "black",
    marginLeft: 5,
  },
});

export default DeliveryHeader;
