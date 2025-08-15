import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Expo Icons for Back Arrow
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

const InProgressOrders = () => {
  const router = useRouter();

  const inProgressOrders = [
    {
      id: "1",
      productName: "iPhone 15 Pro Max",
      status: "In-progress",
      date: "Dec 10, 2024",
    },
    {
      id: "2",
      productName: "Samsung Galaxy S24 Ultra",
      status: "In-progress",
      date: "Dec 9, 2024",
    },
  ];

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.productName}>{item.productName}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>
      <Text style={styles.date}>Ordered on: {item.date}</Text>
      <TouchableOpacity style={styles.trackButton}>
        <Text style={styles.trackButtonText}>Track Order</Text>
      </TouchableOpacity>
    </View>
  );

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
        <Text style={styles.heading}>In-progress Orders</Text>
      </View>

      {/* Orders List */}
      {inProgressOrders.length > 0 ? (
        <FlatList
          data={inProgressOrders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyMessage}>No orders in progress.</Text>
          <TouchableOpacity style={styles.exploreButton}>
            <Text style={styles.exploreButtonText}>Explore Products</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: Platform.OS === "android" ? 80 : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  orderCard: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  status: {
    fontSize: 14,
    color: "#0d9b1e",
    fontWeight: "600",
  },
  date: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  trackButton: {
    backgroundColor: "#0d9b1e",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  trackButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyMessage: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: "#0d9b1e",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default InProgressOrders;
