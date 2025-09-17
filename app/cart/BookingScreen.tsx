import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BRAND_GREEN } from "../../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  }, []);

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
    router.push("/cart/PaymentMethod" as any);
  };

  // Handle navigation back
  const handleBack = () => {
    router.back();
  };

  // Handle edit location
  const handleEditLocation = () => {
    setShowAddressModal(true);
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

                <Text style={styles.formLabel}>Complete Address</Text>
                <TextInput
                  style={[styles.formInput, styles.addressTextInput]}
                  placeholder="Enter complete address"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F7",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FFF5F7",
  },
  backButton: {
    padding: 5,
  },
  headerTextContainer: {
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  scrollView: {
    flex: 1,
  },
  illustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  illustration: {
    width: 200,
    height: 100,
  },
  selectionContainer: {
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: BRAND_GREEN,
    marginBottom: 15,
  },
  dateScrollView: {
    flexDirection: "row",
    marginBottom: 15,
  },
  dateItem: {
    width: 55,
    height: 80,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    paddingVertical: 8,
  },
  selectedDateItem: {
    backgroundColor: BRAND_GREEN,
  },
  todayItem: {
    borderWidth: 2,
    borderColor: BRAND_GREEN,
  },
  dayText: {
    fontSize: 12,
    color: "#666",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  monthText: {
    fontSize: 10,
    color: "#666",
    marginTop: 2,
  },
  selectedDayText: {
    color: "#fff",
  },
  selectedDateText: {
    color: "#fff",
  },
  selectedMonthText: {
    color: "#fff",
  },
  todayText: {
    color: BRAND_GREEN,
    fontWeight: "bold",
  },
  timeSectionLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginTop: 10,
    marginBottom: 10,
  },
  timeScrollView: {
    flexDirection: "row",
    marginBottom: 10,
  },
  timeSlot: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    minWidth: 130,
    alignItems: "center",
  },
  selectedTimeSlot: {
    backgroundColor: BRAND_GREEN,
  },
  timeSlotText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  selectedTimeSlotText: {
    color: "#fff",
    fontWeight: "600",
  },
  locationContainer: {
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  editText: {
    fontSize: 14,
    color: BRAND_GREEN,
  },
  mapContainer: {
    height: 150,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  mapPin: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -12,
    marginTop: -24,
    backgroundColor: "#4285F4",
    borderRadius: 15,
    padding: 5,
  },
  locationName: {
    position: "absolute",
    top: "50%",
    left: "50%",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  mapLogo: {
    position: "absolute",
    bottom: 10,
    left: 10,
    width: 80,
    height: 20,
  },
  addressContainer: {
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  changeAddressText: {
    fontSize: 14,
    color: BRAND_GREEN,
    fontWeight: "500",
  },
  selectedAddressCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: BRAND_GREEN,
  },
  addressTypeTag: {
    backgroundColor: BRAND_GREEN,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  addressTypeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  selectedAddressDetails: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  selectAddressPrompt: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "dashed",
  },
  selectAddressPromptText: {
    fontSize: 14,
    color: BRAND_GREEN,
    marginLeft: 10,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  addressList: {
    padding: 20,
  },
  addressItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedAddressItem: {
    borderColor: BRAND_GREEN,
    backgroundColor: "#f0fff4",
  },
  addressItemContent: {
    flex: 1,
    marginRight: 10,
  },
  addressItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  addressItemDetails: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  deleteButton: {
    padding: 8,
  },
  addNewAddressButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    borderWidth: 2,
    borderColor: BRAND_GREEN,
    borderStyle: "dashed",
  },
  addNewAddressText: {
    fontSize: 14,
    color: BRAND_GREEN,
    fontWeight: "600",
    marginLeft: 8,
  },
  newAddressForm: {
    padding: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 12,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
  },
  addressTextInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  formButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  formButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  saveButton: {
    backgroundColor: BRAND_GREEN,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  nextButton: {
    backgroundColor: BRAND_GREEN,
    margin: 15,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
    marginTop: 10,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default BookingScreen;
