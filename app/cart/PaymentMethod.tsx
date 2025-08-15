import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Modal,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";
import { useRouter } from "expo-router";
import PaymentOptions from "./PaymentOptions";

const PaymentMethod = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current; // Initial animation value
  const router = useRouter();

  const handleContinue = () => {
    // Trigger modal and animation
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1, // Slide up
      duration: 300, // Animation duration in milliseconds
      useNativeDriver: true,
    }).start();
  };

  const handleCloseModal = () => {
    // Close the modal and navigate to AllProducts
    Animated.timing(slideAnim, {
      toValue: 0, // Slide down
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false); // Hide the modal after animation
      router.push("home/AllProducts"); // Navigate to AllProducts page
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      {/* Header */}
      <ScrollView contentContainerStyle={{ paddingBottom: 220 }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              alert("Back button pressed");
              navigation?.goBack();
            }}
            style={styles.iconLeft}
          >
            <Ionicons name="arrow-back" size={24} color="#495057" />
          </TouchableOpacity>
          <Text style={styles.title}>Payment Methods</Text>
        </View>
        <PaymentOptions />
      </ScrollView>
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
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
      {/* Modal */}
      {isModalVisible && (
        <Modal transparent visible={isModalVisible} animationType="none">
          <TouchableWithoutFeedback onPress={handleCloseModal}>
            <View style={styles.modalBackground}>
              <Animated.View
                style={[
                  styles.modalContent,
                  {
                    transform: [
                      {
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [300, 0], // Start at bottom, slide to top
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.modalIcon}>
                  <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
                </View>
                <Text style={styles.modalText}>
                  Congrats! Your payment is successfully!
                </Text>
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={handleCloseModal}
                >
                  <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    marginTop: StatusBar.currentHeight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#212529",
    flex: 1,
    textAlign: "center",
  },
  iconLeft: {
    padding: 8,
    position: "absolute",
    left: 10,
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
    alignItems: "center",
    width: "100%", // Full width
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    elevation: 5,
    width: "100%", // Ensures the content respects full width
  },
  modalIcon: {
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default PaymentMethod;
