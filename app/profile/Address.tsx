import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import addressService, { UserAddress } from "../../services/addressService";
import { isUserLoggedIn, getUserData } from "../../services/loginValidation";
import loginModalService from "../../services/loginModalService";

const Address = () => {
  const router = useRouter();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    checkLoginStatusAndLoadAddresses();
  }, []);

  const checkLoginStatusAndLoadAddresses = async () => {
    try {
      const loggedIn = await isUserLoggedIn();
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        const data = await getUserData();
        setUserData(data);
        await loadAddresses();
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      Alert.alert('Error', 'Failed to load user information');
    } finally {
      setLoading(false);
    }
  };

  const loadAddresses = async () => {
    try {
      const result = await addressService.getCurrentUserAddresses();
      if (result.success && Array.isArray(result.data)) {
        setAddresses(result.data);
      } else if (result.success && result.message === 'Login modal shown') {
        // Login modal is being shown, don't show error alert
        setAddresses([]);
      } else {
        console.error('Failed to load addresses:', result.message);
        Alert.alert('Error', result.message || 'Failed to load addresses');
        setAddresses([]);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      Alert.alert('Error', 'Failed to load addresses');
      setAddresses([]);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAddresses();
    setRefreshing(false);
  };

  const handleDeleteAddress = (addressId: number) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await addressService.deleteAddressForCurrentUser(addressId);
              if (result.success) {
                Alert.alert('Success', 'Address deleted successfully');
                await loadAddresses();
              } else {
                Alert.alert('Error', result.message || 'Failed to delete address');
              }
            } catch (error) {
              console.error('Error deleting address:', error);
              Alert.alert('Error', 'Failed to delete address');
            }
          }
        }
      ]
    );
  };

  const handleSetDefault = async (addressId: number) => {
    try {
      const result = await addressService.setDefaultAddressForCurrentUser(addressId);
      if (result.success) {
        Alert.alert('Success', 'Default address updated successfully');
        await loadAddresses();
      } else {
        Alert.alert('Error', result.message || 'Failed to set default address');
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      Alert.alert('Error', 'Failed to set default address');
    }
  };

  const renderAddressCard = (address: UserAddress) => (
    <View key={address.id} style={styles.addressCard}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="location-on" size={24} color="#0d9b1e" />
        </View>
        <View style={styles.addressDetails}>
          <View style={styles.addressMeta}>
            <View style={[
              styles.typeTag,
              { backgroundColor: addressService.getAddressTypeBackgroundColor(address.address_type) }
            ]}>
              <Text style={[
                styles.typeText,
                { color: addressService.getAddressTypeColor(address.address_type) }
              ]}>
                {addressService.formatAddressType(address.address_type)}
              </Text>
            </View>
            {address.is_default && (
              <View style={styles.defaultTag}>
                <Text style={styles.defaultText}>DEFAULT</Text>
              </View>
            )}
          </View>
          <Text style={styles.addressText}>{address.complete_address}</Text>
          <Text style={styles.addressDate}>
            Added: {new Date(address.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View style={styles.cardActions}>
        {!address.is_default && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetDefault(address.id)}
          >
            <MaterialIcons name="star-outline" size={20} color="#0d9b1e" />
            <Text style={styles.actionText}>Set Default</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push(`/profile/EditAddress?id=${address.id}`)}
        >
          <MaterialIcons name="edit" size={20} color="#2196F3" />
          <Text style={[styles.actionText, { color: '#2196F3' }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteAddress(address.id)}
        >
          <MaterialIcons name="delete-outline" size={20} color="#F44336" />
          <Text style={[styles.actionText, { color: '#F44336' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderGuestView = () => (
    <View style={styles.guestContainer}>
      <MaterialIcons name="location-off" size={64} color="#ccc" />
      <Text style={styles.guestTitle}>Sign In Required</Text>
      <Text style={styles.guestSubtitle}>
        Please sign in to manage your addresses
      </Text>
      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => router.push('/auth/LoginScreen')}
      >
        <MaterialIcons name="login" size={20} color="#fff" />
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="add-location" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Addresses Found</Text>
      <Text style={styles.emptySubtitle}>
        Add your first address to get started
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Addresses</Text>
        {isLoggedIn && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/profile/EditAddress')}
          >
            <MaterialIcons name="add" size={24} color="#0d9b1e" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0d9b1e" />
          <Text style={styles.loadingText}>Loading addresses...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#0d9b1e']} />
          }
          showsVerticalScrollIndicator={false}
        >
          {!isLoggedIn ? (
            renderGuestView()
          ) : addresses.length === 0 ? (
            renderEmptyState()
          ) : (
            <View style={styles.addressList}>
              {addresses.map(renderAddressCard)}
            </View>
          )}

          {/* Add Address Button (only for logged in users) */}
          {isLoggedIn && (
            <TouchableOpacity
              style={styles.addAddressButton}
              onPress={() => router.push('/profile/EditAddress')}
            >
              <MaterialIcons name="add" size={24} color="#0d9b1e" />
              <Text style={styles.addAddressText}>Add New Address</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    flex: 1,
    textAlign: "center",
    marginLeft: -34,
  },
  addButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  addressList: {
    padding: 16,
  },
  addressCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  addressDetails: {
    flex: 1,
  },
  addressMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  defaultTag: {
    backgroundColor: "#FFE0E0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultText: {
    color: "#D32F2F",
    fontSize: 12,
    fontWeight: "bold",
  },
  addressText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
    marginBottom: 4,
  },
  addressDate: {
    fontSize: 12,
    color: "#999",
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 12,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
    color: "#0d9b1e",
  },
  guestContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  guestSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0d9b1e",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  addAddressButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f8f8",
    borderWidth: 2,
    borderColor: "#0d9b1e",
    borderStyle: "dashed",
    paddingVertical: 24,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
  },
  addAddressText: {
    color: "#0d9b1e",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default Address;
