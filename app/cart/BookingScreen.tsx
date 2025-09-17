import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BRAND_GREEN } from "../../constants/Colors";
import { styles } from "../../styles/cart/BookingScreen.styles";
import bookingService, { BookingData, Address, DateItem } from "../../services/bookingService";


const BookingScreen = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<number>(1);
  const [selectedTime, setSelectedTime] = useState<string>("10:00 AM - 11:00 AM");
  const [address, setAddress] = useState<string>("");
  const [days, setDays] = useState<DateItem[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    type: "",
    completeAddress: "",
  });
  const [locationLoading, setLocationLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookedTests, setBookedTests] = useState<any[]>([]);

  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  // Initialize booking data
  React.useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      const data = await bookingService.initializeBookingData();
      setDays(data.dates);
      setTimeSlots(data.timeSlots);
      setSelectedDate(data.defaultDate);
      setSelectedTime(data.defaultTime);
      setSavedAddresses(data.addresses);
      setBookedTests(data.bookedTests);

      if (data.defaultAddress) {
        setSelectedAddress(data.defaultAddress);
        setAddress(data.defaultAddress.completeAddress);
      }
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  };

  // Save new address
  const saveNewAddress = async () => {
    await bookingService.handleNewAddressSubmission(
      newAddress,
      setSavedAddresses,
      setSelectedAddress,
      setAddress,
      setShowNewAddressForm,
      setShowAddressModal,
      setNewAddress,
      (message) => Alert.alert('Error', message)
    );
  };

  // Delete an address
  const deleteAddress = async (addressId: string) => {
    await bookingService.handleAddressDeletion(
      addressId,
      selectedAddress,
      setSavedAddresses,
      setSelectedAddress,
      setAddress,
      (message) => Alert.alert('Error', message)
    );
  };

  // Select an address
  const selectAddress = (addr: Address) => {
    bookingService.selectAddress(addr, setSelectedAddress, setAddress, setShowAddressModal);
  };

  // Check if submit button should be enabled
  const isSubmitEnabled = (): boolean => {
    return bookingService.isSubmitEnabled({
      selectedDate,
      selectedTime,
      selectedAddress,
      address,
      bookedTests,
    });
  };

  // Handle booking submission
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
        Alert.alert(
          'Login Required',
          'Please login to complete your booking. Your booking details will be saved.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Login',
              onPress: () => router.push('/auth/LoginScreen'),
            }
          ]
        );
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

  // Handle navigation back
  const handleBack = () => {
    router.back();
  };

  // Handle edit location
  const handleEditLocation = () => {
    setShowAddressModal(true);
  };

  // Get current location
  const getCurrentLocation = async () => {
    await bookingService.handleLocationFetch(
      newAddress,
      setNewAddress,
      setLocationLoading,
      (message) => Alert.alert('Location Error', message)
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={BRAND_GREEN} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Booking</Text>
          <Text style={styles.headerSubtitle}>Home Sample Collection</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image 
            source={require('../../assets/icons/rider.png')} 
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Date & Time Selection */}
        <View style={styles.selectionContainer}>
          <Text style={styles.sectionTitle}>Select Date & Time / وقت منتخب کریں</Text>
          
          {/* Date Selection */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateScrollView}
          >
            {days.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.dateItem,
                  selectedDate === item.id && styles.selectedDateItem,
                  item.isToday && styles.todayItem,
                ]}
                onPress={() => setSelectedDate(item.id)}
              >
                <Text
                  style={[
                    styles.dayText,
                    item.isToday && selectedDate !== item.id && styles.todayText,
                    selectedDate === item.id && styles.selectedDayText,
                  ]}
                >
                  {item.day}
                </Text>
                <Text
                  style={[
                    styles.dateText,
                    item.isToday && selectedDate !== item.id && styles.todayText,
                    selectedDate === item.id && styles.selectedDateText,
                  ]}
                >
                  {item.date}
                </Text>
                <Text
                  style={[
                    styles.monthText,
                    item.isToday && selectedDate !== item.id && styles.todayText,
                    selectedDate === item.id && styles.selectedMonthText,
                  ]}
                >
                  {item.month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Time Selection */}
          <Text style={styles.timeSectionLabel}>Select Time Slot</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.timeScrollView}
          >
            {timeSlots.map((slot, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSlot,
                  selectedTime === slot && styles.selectedTimeSlot,
                ]}
                onPress={() => setSelectedTime(slot)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedTime === slot && styles.selectedTimeSlotText,
                  ]}
                >
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>


        {/* Address Selection */}
        <View style={styles.addressContainer}>
          <View style={styles.addressHeader}>
            <Text style={styles.addressTitle}>Delivery Address / ڈیلیوری ایڈریس</Text>
            <TouchableOpacity onPress={handleEditLocation}>
              <Text style={styles.changeAddressText}>
                {selectedAddress ? 'Change' : 'Select'} <Ionicons name="chevron-forward" size={16} color={BRAND_GREEN} />
              </Text>
            </TouchableOpacity>
          </View>

          {selectedAddress ? (
            <View style={styles.selectedAddressCard}>
              <View style={styles.addressTypeTag}>
                <Text style={styles.addressTypeText}>{selectedAddress.type}</Text>
              </View>
              <Text style={styles.selectedAddressDetails}>{selectedAddress.completeAddress}</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.selectAddressPrompt} onPress={handleEditLocation}>
              <Ionicons name="location-outline" size={24} color={BRAND_GREEN} />
              <Text style={styles.selectAddressPromptText}>Tap to select delivery address</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitEnabled() ? styles.submitButtonEnabled : styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!isSubmitEnabled() || submitting}
        >
          {submitting ? (
            <View style={styles.submitButtonContent}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.submitButtonText}>Submitting...</Text>
            </View>
          ) : (
            <Text style={[
              styles.submitButtonText,
              !isSubmitEnabled() && styles.submitButtonTextDisabled
            ]}>
              Submit Booking
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Address Selection Modal */}
      <Modal
        visible={showAddressModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Address</Text>
              <TouchableOpacity onPress={() => setShowAddressModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {showNewAddressForm ? (
              <View style={styles.newAddressForm}>
                <Text style={styles.formLabel}>Address Type</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter address type (e.g., Home, Office, etc.)"
                  value={newAddress.type}
                  onChangeText={(text) => setNewAddress({ ...newAddress, type: text })}
                />

                <View style={styles.addressLabelContainer}>
                  <Text style={styles.formLabel}>Complete Address</Text>
                  <TouchableOpacity
                    style={styles.locationButton}
                    onPress={getCurrentLocation}
                    disabled={locationLoading}
                  >
                    {locationLoading ? (
                      <ActivityIndicator size="small" color={BRAND_GREEN} />
                    ) : (
                      <>
                        <Ionicons name="location" size={18} color={BRAND_GREEN} />
                        <Text style={styles.locationButtonText}>Use Current Location</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={[styles.formInput, styles.addressTextInput]}
                  placeholder="Enter complete address or tap location icon"
                  multiline={true}
                  numberOfLines={3}
                  value={newAddress.completeAddress}
                  onChangeText={(text) => setNewAddress({ ...newAddress, completeAddress: text })}
                />

                <View style={styles.formButtons}>
                  <TouchableOpacity
                    style={[styles.formButton, styles.cancelButton]}
                    onPress={() => {
                      setShowNewAddressForm(false);
                      setNewAddress({ type: "", completeAddress: "" });
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.formButton, styles.saveButton]}
                    onPress={saveNewAddress}
                  >
                    <Text style={styles.saveButtonText}>Save Address</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <ScrollView style={styles.addressList}>
                {savedAddresses.map((addr) => (
                  <TouchableOpacity
                    key={addr.id}
                    style={[
                      styles.addressItem,
                      selectedAddress?.id === addr.id && styles.selectedAddressItem,
                    ]}
                    onPress={() => selectAddress(addr)}
                  >
                    <View style={styles.addressItemContent}>
                      <View style={styles.addressItemHeader}>
                        <View style={styles.addressTypeTag}>
                          <Text style={styles.addressTypeText}>{addr.type}</Text>
                        </View>
                        {selectedAddress?.id === addr.id && (
                          <Ionicons name="checkmark-circle" size={20} color={BRAND_GREEN} />
                        )}
                      </View>
                      <Text style={styles.addressItemDetails}>{addr.completeAddress}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => {
                        Alert.alert(
                          "Delete Address",
                          "Are you sure you want to delete this address?",
                          [
                            { text: "Cancel", style: "cancel" },
                            { text: "Delete", onPress: () => deleteAddress(addr.id), style: "destructive" },
                          ]
                        );
                      }}
                    >
                      <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={styles.addNewAddressButton}
                  onPress={() => setShowNewAddressForm(true)}
                >
                  <Ionicons name="add-circle-outline" size={24} color={BRAND_GREEN} />
                  <Text style={styles.addNewAddressText}>Add New Address</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};


export default BookingScreen;
