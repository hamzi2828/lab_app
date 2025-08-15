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

const CartHeader = ({ navigation, title = "Your Cart" }) => {
  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1, // Border at the top
    borderBottomWidth: 1, // Border at the bottom
    borderColor: "#e0e0e0", // Light gray border color
    position: "relative",
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    flex: 1,
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

export default CartHeader;
