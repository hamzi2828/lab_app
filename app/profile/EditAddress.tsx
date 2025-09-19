import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import addressService, { UserAddress } from "../../services/addressService";
import { isUserLoggedIn, getUserData } from "../../services/loginValidation";
import * as Location from 'expo-location';
import loginModalService from "../../services/loginModalService";

const EditAddress = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  // Form state
  const [addressType, setAddressType] = useState<'home' | 'work' | 'other'>('home');
  const [completeAddress, setCompleteAddress] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    checkLoginStatusAndLoadData();
  }, []);

  const checkLoginStatusAndLoadData = async () => {
    try {
      const loggedIn = await isUserLoggedIn();
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        const data = await getUserData();
        setUserData(data);

        if (isEditing && id) {
          await loadAddressData(parseInt(id as string));
        }
      } else {
        Alert.alert(
          'Login Required',
          'Please sign in to manage addresses',
          [{ text: 'OK', onPress: () => router.replace('/auth/LoginScreen') }]
        );
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      Alert.alert('Error', 'Failed to load user information');
    }
  };

  const loadAddressData = async (addressId: number) => {
    try {
      setLoading(true);
      const result = await addressService.getAddressById(addressId);

      if (result.success && result.data && !Array.isArray(result.data)) {
        const address = result.data as UserAddress;
        setAddressType(address.address_type);
        setCompleteAddress(address.complete_address);
        setIsDefault(address.is_default);
      } else {
        Alert.alert('Error', result.message || 'Failed to load address');
        router.back();
      }
    } catch (error) {
      console.error('Error loading address:', error);
      Alert.alert('Error', 'Failed to load address');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleGetCurrentLocation = async () => {
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

        if (addressParts.length > 0) {
          setCompleteAddress(addressParts.join(', '));
        } else {
          setCompleteAddress(`Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}`);
        }
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Error', 'Failed to get your current location. Please check if location services are enabled.');
    } finally {
      setLocationLoading(false);
    }
  };

  const validateForm = (): { isValid: boolean; message?: string } => {
    return addressService.validateAddressData(addressType, completeAddress);
  };

  const handleSave = async () => {
    if (!isLoggedIn) {
      loginModalService.showForAddresses('save addresses');
      return;
    }

    const validation = validateForm();
    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.message);
      return;
    }

    setSaving(true);

    try {
      let result;

      if (isEditing && id) {
        // Update existing address
        result = await addressService.updateAddress(parseInt(id as string), {
          address_type: addressType,
          complete_address: completeAddress,
          is_default: isDefault,
        });
      } else {
        // Create new address
        result = await addressService.createAddressForCurrentUser(
          addressType,
          completeAddress,
          isDefault
        );
      }

      if (result.success) {
        Alert.alert(
          'Success',
          isEditing ? 'Address updated successfully!' : 'Address saved successfully!',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Error', result.message || 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Failed to save address. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderAddressTypeSelector = () => {
    const types: Array<{ key: 'home' | 'work' | 'other'; label: string; icon: string }> = [
      { key: 'home', label: 'Home', icon: 'home' },
      { key: 'work', label: 'Work', icon: 'business' },
      { key: 'other', label: 'Other', icon: 'location-on' },
    ];

    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Address Type *</Text>
        <View style={styles.typeSelector}>
          {types.map((type) => (
            <TouchableOpacity
              key={type.key}
              style={[
                styles.typeOption,
                addressType === type.key && styles.typeOptionSelected,
              ]}
              onPress={() => setAddressType(type.key)}
            >
              <MaterialIcons
                name={type.icon as any}
                size={20}
                color={addressType === type.key ? '#fff' : '#0d9b1e'}
              />
              <Text
                style={[
                  styles.typeOptionText,
                  addressType === type.key && styles.typeOptionTextSelected,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0d9b1e" />
        <Text style={styles.loadingText}>Loading address...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Address' : 'Add New Address'}
        </Text>
      </View>

      {/* Form */}
      <ScrollView
        contentContainerStyle={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderAddressTypeSelector()}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Complete Address *</Text>
          <View style={styles.addressInputContainer}>
            <TextInput
              style={styles.addressInput}
              placeholder="Enter your complete address"
              value={completeAddress}
              onChangeText={setCompleteAddress}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[styles.locationButton, locationLoading && styles.locationButtonDisabled]}
              onPress={handleGetCurrentLocation}
              disabled={locationLoading}
            >
              {locationLoading ? (
                <ActivityIndicator size="small" color="#0d9b1e" />
              ) : (
                <MaterialIcons name="my-location" size={20} color="#0d9b1e" />
              )}
              <Text style={styles.locationButtonText}>
                {locationLoading ? 'Getting...' : 'Use Current'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>
            Include street, area, city, state, and postal code
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <TouchableOpacity
            style={styles.defaultToggle}
            onPress={() => setIsDefault(!isDefault)}
          >
            <View style={[styles.checkbox, isDefault && styles.checkboxSelected]}>
              {isDefault && (
                <MaterialIcons name="check" size={16} color="#fff" />
              )}
            </View>
            <Text style={styles.defaultToggleText}>Set as default address</Text>
          </TouchableOpacity>
          <Text style={styles.helperText}>
            Default address will be pre-selected for bookings
          </Text>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update Address' : 'Save Address'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    flex: 1,
    marginRight: 34,
  },
  formContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  typeSelector: {
    flexDirection: "row",
    gap: 8,
  },
  typeOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: "#0d9b1e",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  typeOptionSelected: {
    backgroundColor: "#0d9b1e",
  },
  typeOptionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#0d9b1e",
  },
  typeOptionTextSelected: {
    color: "#fff",
  },
  addressInputContainer: {
    position: "relative",
  },
  addressInput: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f9f9f9",
    minHeight: 100,
  },
  locationButton: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  locationButtonDisabled: {
    opacity: 0.6,
  },
  locationButtonText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#0d9b1e",
    fontWeight: "500",
  },
  helperText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    lineHeight: 16,
  },
  defaultToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 4,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#0d9b1e",
    borderColor: "#0d9b1e",
  },
  defaultToggleText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  saveButton: {
    backgroundColor: "#0d9b1e",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "600",
  },
});

export default EditAddress;