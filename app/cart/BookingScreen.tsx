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
import bookingService, { BookingData, DateItem, Address } from "../../services/bookingService";
import addressService, { UserAddress } from "../../services/addressService";
import { isUserLoggedIn, getUserData } from "../../services/loginValidation";
import * as Location from 'expo-location';


const BookingScreen = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<number>(1);
  const [selectedTime, setSelectedTime] = useState<string>("10:00 AM - 11:00 AM");
  const [address, setAddress] = useState<string>("");
  const [days, setDays] = useState<DateItem[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address_type: 'home' as 'home' | 'work' | 'other',
    complete_address: "",
    is_default: false,
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
      // Load booking data (dates, times, booked tests)
      const data = await bookingService.initializeBookingData();
      setDays(data.dates);
      setTimeSlots(data.timeSlots);
      setSelectedDate(data.defaultDate);
      setSelectedTime(data.defaultTime);
      setBookedTests(data.bookedTests);

      // Load user addresses from API
      await loadUserAddresses();
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  };

  const loadUserAddresses = async () => {
    try {
      const isLoggedIn = await isUserLoggedIn();
      if (!isLoggedIn) {
        console.log('User not logged in, skipping address loading');
        return;
      }

      const response = await addressService.getCurrentUserAddresses();
      if (response.success && Array.isArray(response.data)) {
        setSavedAddresses(response.data);

        // Find and set default address
        const defaultAddress = response.data.find(addr => addr.is_default);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
          setAddress(defaultAddress.complete_address);
        }
      } else {
        console.log('No addresses found or API error:', response.message);
        setSavedAddresses([]);
      }
    } catch (error) {
      console.error('Error loading user addresses:', error);
      setSavedAddresses([]);
    }
  };

  // Save new address using API
  const saveNewAddress = async () => {
    try {
      if (!newAddress.complete_address.trim()) {
        Alert.alert('Error', 'Please enter a complete address');
        return;
      }

      const result = await addressService.createAddressForCurrentUser(
        newAddress.address_type,
        newAddress.complete_address,
        newAddress.is_default
      );

      if (result.success) {
        Alert.alert('Success', 'Address saved successfully!');
        setShowNewAddressForm(false);
        setShowAddressModal(false);
        setNewAddress({
          address_type: 'home',
          complete_address: "",
          is_default: false,
        });
        // Reload addresses
        await loadUserAddresses();
      } else {
        Alert.alert('Error', result.message || 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Failed to save address. Please try again.');
    }
  };

  // Delete an address using API
  const deleteAddress = async (addressId: number) => {
    try {
      const result = await addressService.deleteAddressForCurrentUser(addressId);

      if (result.success) {
        Alert.alert('Success', 'Address deleted successfully');
        // If deleted address was selected, clear selection
        if (selectedAddress?.id === addressId) {
          setSelectedAddress(null);
          setAddress('');
        }
        // Reload addresses
        await loadUserAddresses();
      } else {
        Alert.alert('Error', result.message || 'Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      Alert.alert('Error', 'Failed to delete address. Please try again.');
    }
  };

  // Select an address
  const selectAddress = (addr: UserAddress) => {
    setSelectedAddress(addr);
    setAddress(addr.complete_address);
    setShowAddressModal(false);
  };

  // Convert UserAddress to Address format for backward compatibility
  const convertToLegacyAddress = (userAddr: UserAddress | null): Address | null => {
    if (!userAddr) return null;
    return {
      id: userAddr.id.toString(),
      type: userAddr.address_type,
      completeAddress: userAddr.complete_address,
      isDefault: userAddr.is_default,
    };
  };

  // Check if submit button should be enabled
  const isSubmitEnabled = (): boolean => {
    return bookingService.isSubmitEnabled({
      selectedDate,
      selectedTime,
      selectedAddress: convertToLegacyAddress(selectedAddress),
      address,
      bookedTests,
    });
  };

  // Handle next button (navigate to summary page)
  const handleNext = async () => {
    if (!isSubmitEnabled()) {
      Alert.alert('Incomplete Information', 'Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);

      // Save current booking data
      await bookingService.saveCurrentBookingData(
        selectedDate,
        selectedTime,
        address,
        convertToLegacyAddress(selectedAddress),
        bookedTests
      );

      setSubmitting(false);

      // Navigate to booking summary page
      router.push('/cart/BookingSummaryPage');
    } catch (error) {
      setSubmitting(false);
      Alert.alert('Error', 'Failed to save booking data. Please try again.');
    }
  };

  // Handle navigation back
  const handleBack = () => {
    router.back();
  };

  // Handle edit location
  const handleEditLocation = () => {
    setShowAddressModal(true);
  };

  // Get current location using Expo Location
  const getCurrentLocation = async () => {
    setLocationLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is needed to get your current address automatically.'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const addressData = reverseGeocode[0];
        const addressParts = [
          addressData.name,
          addressData.street,
          addressData.city,
          addressData.region,
          addressData.country,
          addressData.postalCode
        ].filter(part => part && part.trim());

        const fullAddress = addressParts.length > 0
          ? addressParts.join(', ')
          : `Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}`;

        setNewAddress({
          ...newAddress,
          complete_address: fullAddress,
        });
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Error', 'Failed to get your current location. Please check if location services are enabled.');
    } finally {
      setLocationLoading(false);
    }
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
            <Text style={styles.addressTitle}>Location Address / مکمل پتہ</Text>
            <TouchableOpacity onPress={handleEditLocation}>
              <Text style={styles.changeAddressText}>
                {selectedAddress ? 'Change' : 'Select'} <Ionicons name="chevron-forward" size={16} color={BRAND_GREEN} />
              </Text>
            </TouchableOpacity>
          </View>

          {selectedAddress ? (
            <View style={styles.selectedAddressCard}>
              <View style={styles.addressTypeTag}>
                <Text style={styles.addressTypeText}>{selectedAddress.address_type.toUpperCase()}</Text>
              </View>
              <Text style={styles.selectedAddressDetails}>{selectedAddress.complete_address}</Text>
              {selectedAddress.is_default && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                </View>
              )}
            </View>
          ) : (
            <TouchableOpacity style={styles.selectAddressPrompt} onPress={handleEditLocation}>
              <Ionicons name="location-outline" size={24} color={BRAND_GREEN} />
              <Text style={styles.selectAddressPromptText}>Tap to select Location</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitEnabled() ? styles.submitButtonEnabled : styles.submitButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!isSubmitEnabled() || submitting}
        >
          {submitting ? (
            <View style={styles.submitButtonContent}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.submitButtonText}>Processing...</Text>
            </View>
          ) : (
            <Text style={[
              styles.submitButtonText,
              !isSubmitEnabled() && styles.submitButtonTextDisabled
            ]}>
              Next
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
                <View style={styles.addressTypeSelector}>
                  {(['home', 'work', 'other'] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeButton,
                        newAddress.address_type === type && styles.selectedTypeButton,
                      ]}
                      onPress={() => setNewAddress({ ...newAddress, address_type: type })}
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          newAddress.address_type === type && styles.selectedTypeButtonText,
                        ]}
                      >
                        {type.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

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
                  value={newAddress.complete_address}
                  onChangeText={(text) => setNewAddress({ ...newAddress, complete_address: text })}
                />

                <TouchableOpacity
                  style={styles.defaultToggle}
                  onPress={() => setNewAddress({ ...newAddress, is_default: !newAddress.is_default })}
                >
                  <View style={[styles.checkbox, newAddress.is_default && styles.checkboxSelected]}>
                    {newAddress.is_default && (
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.defaultToggleText}>Set as default address</Text>
                </TouchableOpacity>

                <View style={styles.formButtons}>
                  <TouchableOpacity
                    style={[styles.formButton, styles.cancelButton]}
                    onPress={() => {
                      setShowNewAddressForm(false);
                      setNewAddress({
                        address_type: 'home',
                        complete_address: "",
                        is_default: false,
                      });
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
                {savedAddresses.length === 0 ? (
                  <View style={styles.emptyAddressList}>
                    <Ionicons name="location-outline" size={48} color="#ccc" />
                    <Text style={styles.emptyAddressText}>No saved addresses</Text>
                    <Text style={styles.emptyAddressSubtext}>Add a new address to get started</Text>
                  </View>
                ) : (
                  savedAddresses.map((addr) => (
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
                          <View style={[
                            styles.addressTypeTag,
                            { backgroundColor: addressService.getAddressTypeBackgroundColor(addr.address_type) }
                          ]}>
                            <Text style={[
                              styles.addressTypeText,
                              { color: addressService.getAddressTypeColor(addr.address_type) }
                            ]}>
                              {addr.address_type.toUpperCase()}
                            </Text>
                          </View>
                          {addr.is_default && (
                            <View style={styles.defaultBadge}>
                              <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                            </View>
                          )}
                          {selectedAddress?.id === addr.id && (
                            <Ionicons name="checkmark-circle" size={20} color={BRAND_GREEN} />
                          )}
                        </View>
                        <Text style={styles.addressItemDetails}>{addr.complete_address}</Text>
                        <Text style={styles.addressCreatedDate}>
                          Added: {new Date(addr.created_at).toLocaleDateString()}
                        </Text>
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
                  ))
                )}

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
