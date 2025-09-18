import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { BRAND_GREEN } from "../../constants/Colors";
import { styles } from "../../styles/cart/BookingSummaryPage.styles";
import bookingService, { Address, DateItem } from "../../services/bookingService";
import LoginRequiredModal from "../../components/LoginRequiredModal";

const { width } = Dimensions.get('window');

const BookingSummaryPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [submitting, setSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [address, setAddress] = useState<string>("");
  const [bookedTests, setBookedTests] = useState<any[]>([]);
  const [days, setDays] = useState<DateItem[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    loadBookingData();
  }, []);

  const loadBookingData = async () => {
    try {
      const data = await bookingService.getBookingData();
      setBookingData(data);
      setSelectedDate(data.selectedDate);
      setSelectedTime(data.selectedTime);
      setSelectedAddress(data.selectedAddress);
      setAddress(data.address);
      setBookedTests(data.bookedTests);
      setDays(data.dates);
    } catch (error) {
      console.error('Error loading booking data:', error);
    }
  };

  const getSelectedDateInfo = () => {
    return days.find(day => day.id === selectedDate);
  };

  const calculateTotalPrice = () => {
    return bookedTests.reduce((total, test) => total + (test.price || 0), 0);
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    await bookingService.handleCompleteBookingSubmission(
      selectedDate,
      selectedTime,
      address,
      selectedAddress,
      bookedTests,
      // On success
      (bookingId) => {
        setSubmitting(false);
        Alert.alert(
          'Booking Successful!',
          `Your booking has been submitted successfully. Booking ID: ${bookingId}`,
          [
            {
              text: 'OK',
              onPress: () => router.push('/home/HomePageScreen'),
            }
          ]
        );
      },
      // On login required
      () => {
        setSubmitting(false);
        setShowLoginModal(true);
      },
      // On error
      (message) => {
        setSubmitting(false);
        Alert.alert('Booking Failed', message);
      },
      // On validation error
      (message) => {
        setSubmitting(false);
        Alert.alert('Incomplete Information', message);
      }
    );
  };

  const handleBack = () => {
    router.back();
  };


  const selectedDateInfo = getSelectedDateInfo();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND_GREEN} />

      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.headerBackground} />
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Booking Summary</Text>
            <Text style={styles.headerSubtitle}>Review your booking details</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >


        {/* Tests Summary */}
        <View style={styles.summarySection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <View style={[styles.sectionIconContainer, { backgroundColor: '#2196F320' }]}>
                <Ionicons name="flask" size={24} color="#2196F3" />
              </View>
              <Text style={styles.sectionTitle}>Selected Tests</Text>
              <View style={styles.testCountBadge}>
                <Text style={styles.testCountText}>{bookedTests.length}</Text>
              </View>
            </View>
          </View>

          <View style={styles.testsContainer}>
            {bookedTests.map((test, index) => (
              <View key={index} style={[
                styles.testItem,
                index === bookedTests.length - 1 && styles.lastTestItem
              ]}>
                <View style={styles.testIconContainer}>
                  <Ionicons name="medical" size={18} color={BRAND_GREEN} />
                </View>
                <View style={styles.testInfo}>
                  <Text style={styles.testName}>{test.name}</Text>
                  <Text style={styles.testDescription}>{test.description}</Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.testPrice}>Rs. {test.price}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.totalContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Collection Fee:</Text>
              <Text style={styles.freeText}>Free</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.grandTotalLabel}>Total Amount:</Text>
              <Text style={styles.totalPrice}>Rs. {calculateTotalPrice()}</Text>
            </View>
          </View>
        </View>

        {/* Date & Time Summary */}
        <View style={styles.summarySection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <View style={[styles.sectionIconContainer, { backgroundColor: '#9C27B020' }]}>
                <Ionicons name="time" size={24} color="#9C27B0" />
              </View>
              <Text style={styles.sectionTitle}>Schedule</Text>
            </View>
          </View>

          <View style={styles.scheduleContainer}>
            <View style={styles.scheduleCard}>
              <View style={styles.scheduleIconContainer}>
                <Ionicons name="calendar-outline" size={24} color={BRAND_GREEN} />
              </View>
              <View style={styles.scheduleInfo}>
                <Text style={styles.scheduleLabel}>Collection Date</Text>
                <Text style={styles.scheduleValue}>
                  {selectedDateInfo ? `${selectedDateInfo.day}, ${selectedDateInfo.date} ${selectedDateInfo.month}` : 'Not selected'}
                </Text>
              </View>
            </View>

            <View style={styles.scheduleCard}>
              <View style={styles.scheduleIconContainer}>
                <Ionicons name="time-outline" size={24} color={BRAND_GREEN} />
              </View>
              <View style={styles.scheduleInfo}>
                <Text style={styles.scheduleLabel}>Time Slot</Text>
                <Text style={styles.scheduleValue}>{selectedTime}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Address Summary */}
        <View style={styles.summarySection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <View style={[styles.sectionIconContainer, { backgroundColor: '#FF980020' }]}>
                <Ionicons name="location" size={24} color="#FF9800" />
              </View>
              <Text style={styles.sectionTitle}>Collection Address</Text>
            </View>
          </View>

          {selectedAddress ? (
            <View style={styles.addressCard}>
              <View style={styles.addressMainContent}>
                <View style={styles.addressIconContainer}>
                  <Ionicons name="home" size={24} color={BRAND_GREEN} />
                </View>
                <View style={styles.addressDetails}>
                  <View style={styles.addressTypeContainer}>
                    <View style={styles.addressTypeTag}>
                      <Text style={styles.addressTypeText}>{selectedAddress.type}</Text>
                    </View>
                  </View>
                  <Text style={styles.addressText}>{selectedAddress.completeAddress}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.noAddressContainer}>
              <Ionicons name="location-outline" size={48} color="#ddd" />
              <Text style={styles.noAddressText}>No address selected</Text>
            </View>
          )}
        </View>


        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              styles.submitButtonEnabled
            ]}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.8}
          >
            {submitting ? (
              <View style={styles.submitButtonContent}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.submitButtonText}>Processing...</Text>
              </View>
            ) : (
              <View style={styles.submitButtonContent}>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Confirm Booking</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Login Required Modal */}
      <LoginRequiredModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Login Required"
        subtitle="Please sign in to complete your booking"
        redirectPath="/cart/BookingSummaryPage"
        benefits={[
          "Your booking details will be saved",
          "Track your booking history",
          "Faster future bookings"
        ]}
      />
    </View>
  );
};

export default BookingSummaryPage;