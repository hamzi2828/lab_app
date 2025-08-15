import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Importing icons from Expo
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
const deliveredOrders = [
  {
    id: "1",
    orderNumber: "ORD12345",
    product: "iPhone 14 Pro Max",
    image: require("../../assets/images/iphone.png"),
    deliveryDate: "Dec 10, 2024",
    status: "Delivered",
  },
  {
    id: "2",
    orderNumber: "ORD12346",
    product: "Samsung Galaxy S24 Ultra",
    image: require("../../assets/images/samsung.png"),
    deliveryDate: "Dec 8, 2024",
    status: "Delivered",
  },
  {
    id: "3",
    orderNumber: "ORD12347",
    product: "Google Pixel 7 Pro",
    image: require("../../assets/images/iphone.png"),
    deliveryDate: "Dec 5, 2024",
    status: "Delivered",
  },
];

const DeliveredOrders = ({ navigation }) => {
  const router = useRouter();

  const renderOrderCard = ({ item }) => (
    <Pressable style={styles.card}>
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.cardDetails}>
        <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
        <Text style={styles.productName}>{item.product}</Text>
        <Text style={styles.deliveryDate}>
          Delivered on: {item.deliveryDate}
        </Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <StatusBar />
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivered Orders</Text>
      </View>

      {/* List of Delivered Orders */}
      <FlatList
        data={deliveredOrders}
        renderItem={renderOrderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight || 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#000",
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 16,
    padding: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    resizeMode: "contain",
    marginRight: 16,
  },
  cardDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  deliveryDate: {
    fontSize: 14,
    color: "gray",
  },
  status: {
    fontSize: 14,
    color: "green",
    fontWeight: "bold",
  },
});

export default DeliveredOrders;
