import { StatusBar } from "react-native";
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";

const ProductDetailHeader = ({ navigation, title = "Product Detail" }) => {
  return (
    <SafeAreaView>
      <View
        style={[styles.container, { marginTop: StatusBar.currentHeight || 0 }]}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => {
            alert("Back button pressed");
            navigation.goBack();
          }}
          style={styles.iconLeft}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Cart Button */}
        <TouchableOpacity
          onPress={() => alert("Cart clicked")}
          style={styles.iconRight}
          accessibilityLabel="Cart"
          accessible={true}
        >
          <Ionicons name="cart-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    position: "relative", // Allows absolute positioning for icons
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    flex: 1, // Takes up the remaining space
  },
  iconLeft: {
    position: "absolute",
    left: 10,
    padding: 5,
  },
  iconRight: {
    position: "absolute",
    right: 10,
    padding: 5,
  },
});

export default ProductDetailHeader;
