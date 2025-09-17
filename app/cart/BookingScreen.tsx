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
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { styles } from "../../styles/cart/BookingScreen.styles";

// Define the date type
interface DateItem {
  day: string;
  date: number;
  month: string;
  id: number;
  fullDate: string;
  isToday: boolean;
}

// Define the address type
interface Address {
  id: string;
  type: string; // Custom address type entered by user
  completeAddress: string;
  isDefault?: boolean;
}

const BookingScreen = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<number>(1); // Default to first date
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

  // Generate time slots for 24 hours
  const timeSlots = [
    "12:00 AM - 1:00 AM",
    "1:00 AM - 2:00 AM",
    "2:00 AM - 3:00 AM",
    "3:00 AM - 4:00 AM",
    "4:00 AM - 5:00 AM",
    "5:00 AM - 6:00 AM",
    "6:00 AM - 7:00 AM",
    "7:00 AM - 8:00 AM",
    "8:00 AM - 9:00 AM",
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
    "5:00 PM - 6:00 PM",
    "6:00 PM - 7:00 PM",
    "7:00 PM - 8:00 PM",
    "8:00 PM - 9:00 PM",
    "9:00 PM - 10:00 PM",
    "10:00 PM - 11:00 PM",
    "11:00 PM - 12:00 AM",
  ];

  // Generate 30 days starting from today
  const generate30Days = (): DateItem[] => {
    const dates: DateItem[] = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      dates.push({
        day: dayNames[currentDate.getDay()],
        date: currentDate.getDate(),
        month: monthNames[currentDate.getMonth()],
        id: i + 1,
        fullDate: currentDate.toDateString(),
        isToday: i === 0,
      });
    }
    return dates;
  };

  // Initialize with 30 days starting from today and load addresses
  React.useEffect(() => {
    const thirtyDays = generate30Days();
    setDays(thirtyDays);
    loadSavedAddresses();
    addDummyAddresses();
  }, []);

  // Add dummy addresses for demonstration
  const addDummyAddresses = async () => {
    try {
      const dummyAddresses: Address[] = [
        {
          id: "dummy1",
          type: "Home",
          completeAddress: "House No. 123, Street 45, Sector F-11/4, Islamabad, Pakistan 44000",
          isDefault: true,
        },
        {
          id: "dummy2",
          type: "Office",
          completeAddress: "Office Suite 205, 2nd Floor, Plaza Tower, Blue Area, G-8 Markaz, Islamabad, Pakistan 44000",
          isDefault: false,
        },
        {
          id: "dummy3",
          type: "Parents House",
          completeAddress: "Villa No. 78, Block B, PWD Housing Society, Rawalpindi, Pakistan 46000",
          isDefault: false,
        }
      ];

      const stored = await AsyncStorage.getItem('savedAddresses');
      if (!stored || JSON.parse(stored).length === 0) {
        await AsyncStorage.setItem('savedAddresses', JSON.stringify(dummyAddresses));
        setSavedAddresses(dummyAddresses);
        setSelectedAddress(dummyAddresses[0]);
        setAddress(dummyAddresses[0].completeAddress);
      }
    } catch (error) {
      console.error('Error adding dummy addresses:', error);
    }
  };

  // Load saved addresses from AsyncStorage
  const loadSavedAddresses = async () => {
    try {
      const stored = await AsyncStorage.getItem('savedAddresses');
      if (stored) {
        const addresses = JSON.parse(stored);
        setSavedAddresses(addresses);
        // Set the default address if available
        const defaultAddr = addresses.find((addr: Address) => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr);
          setAddress(defaultAddr.completeAddress);
        }
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  // Save new address
  const saveNewAddress = async () => {
    if (!newAddress.type || !newAddress.completeAddress) {
      Alert.alert('Error', 'Please fill in all address fields');
      return;
    }

    try {
      const addressToSave: Address = {
        id: Date.now().toString(),
        type: newAddress.type,
        completeAddress: newAddress.completeAddress,
        isDefault: savedAddresses.length === 0,
      };

      const updatedAddresses = [...savedAddresses, addressToSave];
      await AsyncStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
      setSavedAddresses(updatedAddresses);
      setSelectedAddress(addressToSave);
      setAddress(addressToSave.completeAddress);
      setShowNewAddressForm(false);
      setShowAddressModal(false);
      setNewAddress({ type: "", completeAddress: "" });
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Failed to save address');
    }
  };

  // Delete an address
  const deleteAddress = async (addressId: string) => {
    try {
      const updatedAddresses = savedAddresses.filter(addr => addr.id !== addressId);
      await AsyncStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
      setSavedAddresses(updatedAddresses);
      if (selectedAddress?.id === addressId) {
        setSelectedAddress(null);
        setAddress("");
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  // Select an address
  const selectAddress = (addr: Address) => {
    setSelectedAddress(addr);
    setAddress(addr.completeAddress);
    setShowAddressModal(false);
  };

  // Handle navigation to the next screen
  const handleNext = () => {
    // Save booking details to AsyncStorage or pass as params
    router.push("/profile/ChangePaymentMethods" as any);
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
    try {
      setLocationLoading(true);

      // Request permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        setLocationLoading(false);
        return;
      }

      // Get current position
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Reverse geocode to get address
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const fullAddress = `${address.name || ''} ${address.street || ''} ${address.city || ''} ${address.region || ''} ${address.country || ''} ${address.postalCode || ''}`.trim();

        // Update the new address form with the location
        setNewAddress({
          ...newAddress,
          completeAddress: fullAddress || `Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}`,
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your current location');
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

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
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
