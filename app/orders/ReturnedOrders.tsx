import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const ReturnedOrders = () => {
  const router = useRouter();

  const handleExploreProducts = () => {
    router.push("/home/AllProducts");
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.heading}>Returned Orders</Text>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {/* Empty Box Illustration */}
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1520038410233-7141be7e6f97?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Replace with the actual illustration URL or local asset
          }}
          style={styles.image}
        />
        {/* Message */}
        <Text style={styles.message}>There are no Orders</Text>
        {/* Explore Products Button */}
        <TouchableOpacity style={styles.button} onPress={handleExploreProducts}>
          <Text style={styles.buttonText}>Explore Products</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: StatusBar.currentHeight || 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 40, // Adjust for proper spacing on Android/iOS
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backButton: {
    marginRight: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "transparent",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#0d9b1e",
  },
  buttonText: {
    color: "#0d9b1e",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ReturnedOrders;
