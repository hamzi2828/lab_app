import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { isUserLoggedIn, getUserData } from './loginValidation';

// Date and time interfaces
export interface DateItem {
  day: string;
  date: number;
  month: string;
  id: number;
  fullDate: string;
  isToday: boolean;
}

// Address interfaces
export interface Address {
  id: string;
  type: string;
  completeAddress: string;
  isDefault?: boolean;
}

// Location interfaces
export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

// Booking interfaces
export interface BookingData {
  selectedDate: number;
  selectedTime: string;
  address: string;
  selectedAddress: Address | null;
  bookedTests: any[];
}

export interface UserSession {
  isLoggedIn: boolean;
  token?: string;
  userId?: string;
  userEmail?: string;
  userData?: any; // Full user data from login
}
const API_BASE_URL = 'https://hmis.rapidreporting.us';
class BookingService {
  private readonly dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  private readonly monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Date and time generation methods
  generateDates(numberOfDays: number = 30): DateItem[] {
    const dates: DateItem[] = [];
    const today = new Date();

    for (let i = 0; i < numberOfDays; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      dates.push({
        day: this.dayNames[currentDate.getDay()],
        date: currentDate.getDate(),
        month: this.monthNames[currentDate.getMonth()],
        id: i + 1,
        fullDate: currentDate.toDateString(),
        isToday: i === 0,
      });
    }

    return dates;
  }

  getTimeSlots(): string[] {
    return [
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
  }

  getDefaultTimeSlot(): string {
    return "10:00 AM - 11:00 AM";
  }

  getDefaultDate(): number {
    return 1;
  }

  // Address management methods
  async loadSavedAddresses(): Promise<Address[]> {
    try {
      const stored = await AsyncStorage.getItem('savedAddresses');
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    } catch (error) {
      console.error('Error loading addresses:', error);
      return [];
    }
  }

  async getDefaultAddress(): Promise<Address | null> {
    try {
      const addresses = await this.loadSavedAddresses();
      return addresses.find(addr => addr.isDefault) || null;
    } catch (error) {
      console.error('Error getting default address:', error);
      return null;
    }
  }

  async saveAddress(addressData: { type: string; completeAddress: string }): Promise<{ success: boolean; address?: Address; message?: string }> {
    if (!addressData.type || !addressData.completeAddress) {
      return { success: false, message: 'Please fill in all address fields' };
    }

    try {
      const existingAddresses = await this.loadSavedAddresses();

      const newAddress: Address = {
        id: Date.now().toString(),
        type: addressData.type,
        completeAddress: addressData.completeAddress,
        isDefault: existingAddresses.length === 0,
      };

      const updatedAddresses = [...existingAddresses, newAddress];
      await AsyncStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));

      return { success: true, address: newAddress };
    } catch (error) {
      console.error('Error saving address:', error);
      return { success: false, message: 'Failed to save address' };
    }
  }

  async deleteAddress(addressId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const addresses = await this.loadSavedAddresses();
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      await AsyncStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
      return { success: true };
    } catch (error) {
      console.error('Error deleting address:', error);
      return { success: false, message: 'Failed to delete address' };
    }
  }

  async loadAddressesWithoutDefaults(): Promise<Address[]> {
    try {
      // Load existing addresses and filter out any dummy addresses
      const addresses = await this.loadSavedAddresses();
      const cleanAddresses = addresses.filter(addr => !addr.id.startsWith('dummy'));

      // If we removed dummy addresses, save the cleaned list
      if (cleanAddresses.length !== addresses.length) {
        await AsyncStorage.setItem('savedAddresses', JSON.stringify(cleanAddresses));
      }

      return cleanAddresses;
    } catch (error) {
      console.error('Error loading addresses:', error);
      return [];
    }
  }

  // Location methods
  async getCurrentLocationWithAddress(): Promise<{ success: boolean; location?: LocationData; message?: string }> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        return {
          success: false,
          message: 'Location permission is required to get your current address automatically.'
        };
      }

      // Create a timeout promise for better error handling
      const locationPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Location request timed out')), 15000);
      });

      const location = await Promise.race([locationPromise, timeoutPromise]) as any;

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      let address = `Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}`;

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
          address = addressParts.join(', ');
        }
      }

      return {
        success: true,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: address
        }
      };
    } catch (error) {
      console.error('Error getting current location with address:', error);
      return {
        success: false,
        message: 'Failed to get your current location. Please check if location services are enabled.'
      };
    }
  }

  // Initialize booking data
  async initializeBookingData(): Promise<{
    dates: DateItem[];
    timeSlots: string[];
    defaultDate: number;
    defaultTime: string;
    addresses: Address[];
    defaultAddress: Address | null;
    bookedTests: any[];
  }> {
    try {
      const dates = this.generateDates(30);
      const timeSlots = this.getTimeSlots();
      const defaultDate = this.getDefaultDate();
      const defaultTime = this.getDefaultTimeSlot();

      // Load existing addresses (no dummy addresses)
      let addresses = await this.loadAddressesWithoutDefaults();
      const defaultAddress = await this.getDefaultAddress();

      // Load booked tests
      const bookedTests = await this.loadBookedTests();

      return {
        dates,
        timeSlots,
        defaultDate,
        defaultTime,
        addresses,
        defaultAddress,
        bookedTests,
      };
    } catch (error) {
      console.error('Error initializing booking data:', error);
      return {
        dates: [],
        timeSlots: [],
        defaultDate: 1,
        defaultTime: "10:00 AM - 11:00 AM",
        addresses: [],
        defaultAddress: null,
        bookedTests: [],
      };
    }
  }

  // Load booked tests from AsyncStorage
  async loadBookedTests(): Promise<any[]> {
    try {
      const stored = await AsyncStorage.getItem('bookedTestsDetails');
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    } catch (error) {
      console.error('Error loading booked tests:', error);
      return [];
    }
  }

  // Address management methods
  async loadAddresses(): Promise<Address[]> {
    return await this.loadSavedAddresses();
  }

  async saveNewAddress(addressData: { type: string; completeAddress: string }): Promise<{ success: boolean; address?: Address; message?: string }> {
    return await this.saveAddress(addressData);
  }

  // Location methods
  async getCurrentLocation(): Promise<{ success: boolean; address?: string; message?: string }> {
    try {
      const result = await this.getCurrentLocationWithAddress();
      if (result.success && result.location) {
        return {
          success: true,
          address: result.location.address
        };
      }
      return {
        success: false,
        message: result.message || 'Failed to get location'
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return {
        success: false,
        message: 'Failed to get your current location'
      };
    }
  }

  // Check if user is logged in (using same logic as Profile.tsx)
  async checkUserSession(): Promise<UserSession> {
    try {
      const loggedIn = await isUserLoggedIn();

      if (loggedIn) {
        const userData = await getUserData();
        return {
          isLoggedIn: true,
          token: userData?.token || 'no-token', // API doesn't use tokens
          userId: userData?.user_id,
          userEmail: userData?.email,
          userData: userData // Include full user data
        };
      }

      return { isLoggedIn: false };
    } catch (error) {
      console.error('Error checking user session:', error);
      return { isLoggedIn: false };
    }
  }

  // Validate booking data
  validateBookingData(bookingData: BookingData): { isValid: boolean; message?: string } {
    if (!bookingData.selectedDate) {
      return { isValid: false, message: 'Please select a date' };
    }

    if (!bookingData.selectedTime) {
      return { isValid: false, message: 'Please select a time slot' };
    }

    if (!bookingData.selectedAddress || !bookingData.address) {
      return { isValid: false, message: 'Please select a delivery address' };
    }

    if (!bookingData.bookedTests || bookingData.bookedTests.length === 0) {
      return { isValid: false, message: 'No tests found in cart' };
    }

    return { isValid: true };
  }

  // Save booking data to storage
  async saveBookingData(bookingData: BookingData): Promise<void> {
    try {
      await AsyncStorage.setItem('pendingBookingData', JSON.stringify(bookingData));
    } catch (error) {
      console.error('Error saving booking data:', error);
      throw new Error('Failed to save booking data');
    }
  }

  // Get saved booking data
  async getSavedBookingData(): Promise<BookingData | null> {
    try {
      const saved = await AsyncStorage.getItem('pendingBookingData');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error getting saved booking data:', error);
      return null;
    }
  }

  // Save current booking data for navigation to summary page
  async saveCurrentBookingData(
    selectedDate: number,
    selectedTime: string,
    address: string,
    selectedAddress: Address | null,
    bookedTests: any[]
  ): Promise<void> {
    try {
      const bookingData: BookingData = {
        selectedDate,
        selectedTime,
        address,
        selectedAddress,
        bookedTests,
      };
      await AsyncStorage.setItem('currentBookingData', JSON.stringify(bookingData));
    } catch (error) {
      console.error('Error saving current booking data:', error);
      throw new Error('Failed to save booking data');
    }
  }

  // Get current booking data with additional details
  async getBookingData(): Promise<{
    selectedDate: number;
    selectedTime: string;
    address: string;
    selectedAddress: Address | null;
    bookedTests: any[];
    dates: DateItem[];
  }> {
    try {
      const saved = await AsyncStorage.getItem('currentBookingData');
      const bookingData = saved ? JSON.parse(saved) : null;

      if (!bookingData) {
        // Fallback to initialize new data
        const initData = await this.initializeBookingData();
        return {
          selectedDate: initData.defaultDate,
          selectedTime: initData.defaultTime,
          address: initData.defaultAddress?.completeAddress || '',
          selectedAddress: initData.defaultAddress,
          bookedTests: initData.bookedTests,
          dates: initData.dates,
        };
      }

      // Add dates for display
      const dates = this.generateDates(30);

      return {
        ...bookingData,
        dates,
      };
    } catch (error) {
      console.error('Error getting booking data:', error);
      // Return fallback data
      const initData = await this.initializeBookingData();
      return {
        selectedDate: initData.defaultDate,
        selectedTime: initData.defaultTime,
        address: initData.defaultAddress?.completeAddress || '',
        selectedAddress: initData.defaultAddress,
        bookedTests: initData.bookedTests,
        dates: initData.dates,
      };
    }
  }

  // Clear saved booking data
  async clearSavedBookingData(): Promise<void> {
    try {
      await AsyncStorage.removeItem('pendingBookingData');
    } catch (error) {
      console.error('Error clearing booking data:', error);
    }
  }

  // Submit booking to API
  async submitBooking(bookingData: BookingData, userSession: UserSession): Promise<{ success: boolean; message: string; bookingId?: string }> {
    try {
      console.log('=== BOOKING SUBMISSION DETAILS ===');
      console.log('📅 Selected Date ID:', bookingData.selectedDate);
      console.log('⏰ Selected Time:', bookingData.selectedTime);
      console.log('📍 Selected Address:', bookingData.selectedAddress);
      console.log('🧪 Booked Tests Count:', bookingData.bookedTests.length);
      console.log('👤 User Session:', {
        isLoggedIn: userSession.isLoggedIn,
        userId: userSession.userId,
        userEmail: userSession.userEmail,
        userData: userSession.userData
      });

      console.log('🧪 Test Details:');
      bookingData.bookedTests.forEach((test, index) => {
        console.log(`  Test ${index + 1}:`, {
          id: test.id,
          name: test.name,
          code: test.code,
          originalPrice: test.originalPrice,
          discountedPrice: test.discountedPrice,
          category: test.category,
          type: test.type
        });
      });

      // Prepare booking payload with proper structure
      const bookingPayload = {
        user_id: userSession.userId,
        user_name: userSession.userData?.name,
        user_email: userSession.userData?.email,
        user_phone: userSession.userData?.phone,
        selected_date: bookingData.selectedDate,
        selected_time: bookingData.selectedTime,
        delivery_address: {
          type: bookingData.selectedAddress?.type,
          complete_address: bookingData.selectedAddress?.completeAddress,
        },
        tests: bookingData.bookedTests.map(test => ({
          id: test.id,
          name: test.name,
          code: test.code,
          price: parseFloat(test.discountedPrice?.replace(/[^\\d.]/g, '') || test.price?.toString() || '0'),
          category: test.category || test.type || 'General',
        })),
        total_amount: this.calculateTotal(bookingData.bookedTests),
        booking_date_time: new Date().toISOString(),
        booking_type: 'home_collection',
        status: 'pending'
      };

      console.log('💰 Total Amount:', this.calculateTotal(bookingData.bookedTests));
      console.log('📋 Final Booking Payload:');
      console.log(JSON.stringify(bookingPayload, null, 2));

      // Console log exact payload for Postman testing
      console.log('🧪 COPY THIS PAYLOAD FOR POSTMAN TESTING:');
      console.log('=== URL ===');
      console.log(`${API_BASE_URL}/api/bookings`);
      console.log('=== METHOD ===');
      console.log('POST');
      console.log('=== HEADERS ===');
      console.log(JSON.stringify({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }, null, 2));
      console.log('=== BODY (copy this exact JSON) ===');
      console.log(JSON.stringify(bookingPayload));
      console.log('=== END POSTMAN DATA ===');

      const response = await fetch(`${API_BASE_URL}/api/create-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });

      console.log('🔍 Booking response status:', response.status);
      console.log('🔍 Response headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));

      const responseText = await response.text();
      console.log('🔍 Raw booking response:', responseText);

      // Detailed error analysis
      if (response.status === 403) {
        console.log('❌ 403 FORBIDDEN ERROR ANALYSIS:');
        console.log('- User authenticated:', !!userSession.userData);
        console.log('- User ID:', userSession.userId);
        console.log('- Response content type:', response.headers.get('content-type'));
        console.log('- Is HTML response:', responseText.includes('<!DOCTYPE html>'));

        if (responseText.includes('<!DOCTYPE html>')) {
          console.log('🚨 Server returned HTML error page instead of JSON');
          console.log('🔧 POSSIBLE CAUSES:');
          console.log('  1. API endpoint disabled or moved');
          console.log('  2. CSRF token required');
          console.log('  3. Missing authentication header');
          console.log('  4. User permissions insufficient');
          console.log('  5. Request validation failed');
        }
      }

      // Check if it's HTML error page
      if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
        if (responseText.includes('The action you have requested is not allowed')) {
          throw new Error('Booking service unavailable. Please try again later.');
        }
        throw new Error('Service temporarily unavailable.');
      }

      // Parse JSON response
      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse booking response:', parseError);
        throw new Error('Invalid response from server');
      }

      console.log('Parsed booking response:', result);

      if (response.ok && result.success) {
        // Clear cart and booking data after successful submission
        await this.clearSavedBookingData();
        await AsyncStorage.removeItem('bookedTestsDetails');

        return {
          success: true,
          message: result.message || 'Booking submitted successfully!',
          bookingId: result.data?.booking_reference || result.booking_reference || `BK${String(result.data?.booking_id || result.booking_id || '').padStart(6, '0')}`,
        };
      } else {
        return {
          success: false,
          message: result.message || 'Failed to submit booking',
        };
      }
    } catch (error) {
      console.error('Error submitting booking:', error);

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return {
          success: false,
          message: 'Cannot connect to server. Please check your internet connection.',
        };
      }

      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
      };
    }
  }

  // Calculate total amount
  private calculateTotal(bookedTests: any[]): number {
    return bookedTests.reduce((total, test) => {
      const price = parseFloat(test.discountedPrice?.replace(/[^\d.]/g, '') || test.price || 0);
      return total + price;
    }, 0);
  }

  // Check if booking data is valid for submission
  isSubmitEnabled(bookingData: Partial<BookingData>): boolean {
    return !!(
      bookingData.selectedDate &&
      bookingData.selectedTime &&
      bookingData.selectedAddress &&
      bookingData.address &&
      bookingData.bookedTests &&
      bookingData.bookedTests.length > 0
    );
  }

  // Complete booking submission flow
  async handleCompleteBookingSubmission(
    selectedDate: number,
    selectedTime: string,
    address: string,
    selectedAddress: Address | null,
    bookedTests: any[],
    onSuccess: (bookingId?: string) => void,
    onLoginRequired: () => void,
    onError: (message: string) => void,
    onValidationError: (message: string) => void
  ): Promise<void> {
    try {
      const bookingData: BookingData = {
        selectedDate,
        selectedTime,
        address,
        selectedAddress,
        bookedTests,
      };

      // Validate booking data first
      if (!this.isSubmitEnabled(bookingData)) {
        onValidationError('Please fill in all required fields');
        return;
      }

      // Proceed with submission
      await this.handleBookingSubmission(bookingData, onSuccess, onLoginRequired, onError);
    } catch (error) {
      console.error('Error in complete booking submission:', error);
      onError('An unexpected error occurred. Please try again.');
    }
  }

  // Main booking submission handler
  async handleBookingSubmission(
    bookingData: BookingData,
    onSuccess: (bookingId?: string) => void,
    onLoginRequired: () => void,
    onError: (message: string) => void
  ): Promise<void> {
    try {
      // Validate booking data
      const validation = this.validateBookingData(bookingData);
      if (!validation.isValid) {
        onError(validation.message || 'Invalid booking data');
        return;
      }

      // Check user session
      const userSession = await this.checkUserSession();

      if (!userSession.isLoggedIn) {
        // Save booking data for after login
        await this.saveBookingData(bookingData);
        onLoginRequired();
        return;
      }

      // Submit booking
      const result = await this.submitBooking(bookingData, userSession);

      if (result.success) {
        onSuccess(result.bookingId);
      } else {
        onError(result.message);
      }
    } catch (error) {
      console.error('Error in booking submission:', error);
      onError('An unexpected error occurred. Please try again.');
    }
  }

  // Address selection logic
  selectAddress(
    address: Address,
    setSelectedAddress: (addr: Address | null) => void,
    setAddress: (addr: string) => void,
    setShowModal: (show: boolean) => void
  ): void {
    setSelectedAddress(address);
    setAddress(address.completeAddress);
    setShowModal(false);
  }

  // Reset new address form
  resetNewAddressForm(setNewAddress: (addr: Partial<Address>) => void): void {
    setNewAddress({ type: "", completeAddress: "" });
  }

  // Handle new address form submission
  async handleNewAddressSubmission(
    newAddress: Partial<Address>,
    setSavedAddresses: (addresses: Address[]) => void,
    setSelectedAddress: (addr: Address | null) => void,
    setAddress: (addr: string) => void,
    setShowNewAddressForm: (show: boolean) => void,
    setShowAddressModal: (show: boolean) => void,
    setNewAddress: (addr: Partial<Address>) => void,
    onError: (message: string) => void
  ): Promise<void> {
    const result = await this.saveNewAddress({
      type: newAddress.type || "",
      completeAddress: newAddress.completeAddress || ""
    });

    if (result.success && result.address) {
      const updatedAddresses = await this.loadAddresses();
      setSavedAddresses(updatedAddresses);
      setSelectedAddress(result.address);
      setAddress(result.address.completeAddress);
      setShowNewAddressForm(false);
      setShowAddressModal(false);
      setNewAddress({ type: "", completeAddress: "" });
    } else {
      onError(result.message || 'Failed to save address');
    }
  }

  // Handle address deletion
  async handleAddressDeletion(
    addressId: string,
    selectedAddress: Address | null,
    setSavedAddresses: (addresses: Address[]) => void,
    setSelectedAddress: (addr: Address | null) => void,
    setAddress: (addr: string) => void,
    onError: (message: string) => void
  ): Promise<void> {
    const result = await this.deleteAddress(addressId);

    if (result.success) {
      const updatedAddresses = await this.loadAddresses();
      setSavedAddresses(updatedAddresses);
      if (selectedAddress?.id === addressId) {
        setSelectedAddress(null);
        setAddress("");
      }
    } else {
      onError(result.message || 'Failed to delete address');
    }
  }

  // Handle location fetching
  async handleLocationFetch(
    newAddress: Partial<Address>,
    setNewAddress: (addr: Partial<Address>) => void,
    setLocationLoading: (loading: boolean) => void,
    onError: (message: string) => void
  ): Promise<void> {
    setLocationLoading(true);

    try {
      const result = await this.getCurrentLocation();

      if (result.success && result.address) {
        setNewAddress({
          ...newAddress,
          completeAddress: result.address,
        });
      } else {
        onError(result.message || 'Failed to get your current location');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      onError('Failed to get your current location');
    } finally {
      setLocationLoading(false);
    }
  }

  // Fetch user bookings from API
  async getUserBookings(userId: string | number): Promise<{
    success: boolean;
    data?: any[];
    message?: string;
    count?: number;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/get-user-bookings?user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const responseText = await response.text();

      // Check if it's HTML error page
      if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
        throw new Error('Service temporarily unavailable.');
      }

      // Parse JSON response
      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid response from server');
      }

      if (response.ok && result.success) {
        return {
          success: true,
          data: result.data || [],
          count: result.count || 0,
          message: result.message
        };
      } else {
        return {
          success: false,
          message: result.message || 'Failed to fetch bookings',
          data: []
        };
      }
    } catch (error) {
      console.error('Error fetching user bookings:', error);

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return {
          success: false,
          message: 'Cannot connect to server. Please check your internet connection.',
          data: []
        };
      }

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch bookings',
        data: []
      };
    }
  }

  // Format booking date for display
  formatBookingDate(timestamp: number): string {
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Get status color for booking status
  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      pending: '#FFA500',
      confirmed: '#4CAF50',
      completed: '#2196F3',
      cancelled: '#F44336',
      in_progress: '#9C27B0'
    };
    return statusColors[status.toLowerCase()] || '#757575';
  }

  // Calculate time remaining for a booking
  getTimeRemaining(timestamp: number, time: string): string {
    const now = new Date();
    const bookingDate = new Date(timestamp * 1000);

    // Parse time slot to get actual time
    const timeMatch = time.match(/(\d+):(\d+)\s*(AM|PM)/);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const period = timeMatch[3];

      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      bookingDate.setHours(hours, minutes, 0, 0);
    }

    const diff = bookingDate.getTime() - now.getTime();

    if (diff < 0) return 'Past';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} remaining`;

    return 'Today';
  }
}

export default new BookingService();