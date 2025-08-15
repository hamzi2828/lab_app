// TrendingProducts.js
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For the calendar icon

const TrendingProducts = () => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Trending Products</Text>
        <View style={styles.dateContainer}>
          <Ionicons
            name="calendar"
            size={16}
            color="white"
            style={styles.icon}
          />
          <Text style={styles.dateText}>Last Date 29/02/22</Text>
        </View>
      </View>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>View all →</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FF6C87",
    borderRadius: 10,
    padding: 16,
    margin: 16,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  dateText: {
    color: "white",
    fontSize: 14,
  },
  button: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default TrendingProducts;
