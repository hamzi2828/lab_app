import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons"; // Ensure this package is installed
import CartHeader from "./CartHeader";
import DeliverHeader from "./DeliveryHeader";
import CartItem from "./CartItem";
import { useRouter } from "expo-router";

const productData = [
  {
    id: "1",
    title: "Samsung S24 ultra - Unlocked 32GB Black Excellent",
    variant: "Grey",
    price: "£399.99",
    image: require("../../assets/images/samsung.png"),
  },
  {
    id: "2",
    title: "Samsung S24 ultra - Unlocked 32GB Black Excellent",
    variant: "Grey",
    price: "£399.99",
    image: require("../../assets/images/samsung.png"),
  },
];

const Cart = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  // Navigate to the checkout screen
  const handleNavigate = () => {
    setIsModalVisible(false); // Close the Modal first
    setTimeout(() => {
      return router.push("cart/NewAddress");
    }, 200);
  };
  const handleNavigatee = () => {
    setIsModalVisible(false); // Close the Modal first
    setTimeout(() => {
      return router.push("cart/PaymentMethod");
    }, 200);
  };

  return (
    <View style={styles.container}>
      <StatusBar />
      <CartHeader />
      <DeliverHeader />
      <FlatList
        data={productData}
        renderItem={({ item }) => <CartItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContainer}
      />
      <View style={styles.footer}>
        <View style={styles.couponContainer}>
          <TextInput placeholder="Coupon Code" style={styles.couponInput} />
          <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply Code</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.orderSummary}>
          <Text style={styles.summaryText}>Subtotals</Text>
          <Text style={styles.summaryText}>£4562.99</Text>
        </View>
        <View style={styles.orderSummary}>
          <Text style={styles.summaryText}>Shipping Cost</Text>
          <Text style={styles.summaryText}>£8.00</Text>
        </View>
        <View style={styles.orderSummary}>
          <Text style={[styles.summaryText, styles.totalText]}>Totals</Text>
          <Text style={[styles.summaryText, styles.totalText]}>£4570.99</Text>
        </View>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
      {/* Modal for Address Selection */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <View style={styles.closeContainer}>
              <Text style={styles.modalHeader}>Change Address</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.addressItem}>
              <View>
                <Text style={styles.addressType}>Home</Text>
                <Text style={styles.addressName}>David Guetta</Text>
                <Text style={styles.addressDetails}>
                  2972 Westheimer Rd, Santa Ana, United Kingdom 85495
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addressItem}>
              <View>
                <Text style={styles.addressType}>Office</Text>
                <Text style={styles.addressName}>Gotta Pawla</Text>
                <Text style={styles.addressDetails}>
                  2972 Westheimer Rd, Santa Ana, United Kingdom 85495
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNavigate}>
              <Text style={styles.addNewAddress}>+ Add New Address</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleNavigatee}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flatListContainer: {
    paddingBottom: 150, // Add bottom padding to avoid overlap with footer
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  couponContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  closeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  applyButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  applyButtonText: {
    color: "#333",
  },
  orderSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 14,
    color: "#333",
  },
  totalText: {
    fontWeight: "bold",
  },
  continueButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalHeader: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addressItem: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  addressType: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  addressName: {
    fontSize: 14,
    color: "#333",
  },
  addressDetails: {
    fontSize: 12,
    color: "#666",
  },
  addNewAddress: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 15,
  },
});

export default Cart;
