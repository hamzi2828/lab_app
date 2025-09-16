import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons"; // Ensure this package is installed
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import CartItem from "./CartItem";
import { useRouter } from "expo-router";
import { styles } from "../../styles/cart/Cart.styles";
import { getTestImage } from "../../services/testsService";

const Cart = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bookedTests, setBookedTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadBookedTests();
  }, []);

  // Check for booked tests every time the cart screen is focused/navigated to
  useFocusEffect(
    React.useCallback(() => {
      console.log('Cart screen focused - checking for booked tests');
      setLoading(true);
      loadBookedTests();
    }, [])
  );

  const loadBookedTests = async () => {
    try {
      const stored = await AsyncStorage.getItem('bookedTestsDetails');
      if (stored) {
        const tests = JSON.parse(stored);
        setBookedTests(tests);
      }
    } catch (error) {
      console.error('Error loading booked tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (testId: number) => {
    try {
      const updatedTests = bookedTests.filter(test => test.id !== testId);
      setBookedTests(updatedTests);
      await AsyncStorage.setItem('bookedTestsDetails', JSON.stringify(updatedTests));
    } catch (error) {
      console.error('Error removing test from cart:', error);
    }
  };

  const calculateTotal = () => {
    return bookedTests.reduce((total, test) => {
      const price = parseFloat(test.discountedPrice?.replace(/[^\d.]/g, '') || test.price || 0);
      return total + price;
    }, 0);
  };

  // Navigate to the checkout screen
  const handleNavigate = () => {
    setIsModalVisible(false); // Close the Modal first
    setTimeout(() => {
      return router.push("/cart/NewAddress");
    }, 200);
  };
  const handleNavigatee = () => {
    setIsModalVisible(false); // Close the Modal first
    setTimeout(() => {
      return router.push("/cart/PaymentMethod");
    }, 200);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading cart...</Text>
      </View>
    );
  }

  if (bookedTests.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, color: '#666' }}>Your cart is empty</Text>
        <TouchableOpacity
          style={{ marginTop: 20, backgroundColor: '#4CAF50', padding: 15, borderRadius: 10 }}
          onPress={() => router.push('/home/AllTests')}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>Browse Tests</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar />
      <FlatList
        data={bookedTests}
        renderItem={({ item }) => (
          <CartItem
            item={{
              id: item.id.toString(),
              title: item.name,
              image: getTestImage(item),
              originalPrice: item.originalPrice,
              discountedPrice: item.discountedPrice,
              badges: item.badges
            }}
            onRemove={() => removeFromCart(item.id)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
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
          <Text style={styles.summaryText}>Rs.{calculateTotal().toFixed(2)}</Text>
        </View>
        <View style={styles.orderSummary}>
          <Text style={[styles.summaryText, styles.totalText]}>Totals</Text>
          <Text style={[styles.summaryText, styles.totalText]}>Rs.{(calculateTotal() + 8).toFixed(2)}</Text>
        </View>
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={[styles.actionSegment, styles.actionLeft]}
            onPress={() => router.push("/home/AllTests")}
          >
            <Text style={[styles.actionText, styles.actionTextMuted]}>Add Test(s)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionSegment, styles.actionRight]}
            onPress={() => router.push("/cart/BookingScreen" as any)}
          >
            <Text style={[styles.actionText, styles.actionTextPrimary]}>Next</Text>
          </TouchableOpacity>
        </View>
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


export default Cart;
