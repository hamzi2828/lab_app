import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "../../styles/profile/PreviousBookings.styles";
import bookingService from "../../services/bookingService";
import { getUserData, isUserLoggedIn } from "../../services/loginValidation";

interface Booking {
  id: number;
  booking_reference: string;
  booking_type: string;
  status: string;
  selected_time: string;
  selected_date: number;
  delivery_address: string;
  delivery_address_type: string;
  total_amount: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  created_at: string;
  updated_at: string;
  tests: Test[];
}

interface Test {
  id: number;
  test_name: string;
  test_code: string;
  test_price: string;
  test_category: string;
  status: string;
}

// Static fallback data for better UI when API fails
const staticBookings: Booking[] = [
  {
    id: 1,
    booking_reference: "BK000001",
    booking_type: "home_collection",
    status: "confirmed",
    selected_time: "10:00 AM - 12:00 PM",
    selected_date: Math.floor(Date.now() / 1000) + 86400, // Tomorrow
    delivery_address: "123 Main Street, Downtown Area, City Center, 12345",
    delivery_address_type: "home",
    total_amount: "2500.00",
    user_name: "John Doe",
    user_email: "john@example.com",
    user_phone: "+923001234567",
    created_at: "2024-01-15 10:30:00",
    updated_at: "2024-01-15 15:00:00",
    tests: [
      {
        id: 1,
        test_name: "Complete Blood Count (CBC)",
        test_code: "CBC001",
        test_price: "1500.00",
        test_category: "Hematology",
        status: "pending"
      },
      {
        id: 2,
        test_name: "Blood Sugar Fasting",
        test_code: "BSF001",
        test_price: "500.00",
        test_category: "Biochemistry",
        status: "pending"
      },
      {
        id: 3,
        test_name: "Vitamin D Test",
        test_code: "VTD001",
        test_price: "500.00",
        test_category: "Vitamins",
        status: "pending"
      }
    ]
  },
  {
    id: 2,
    booking_reference: "BK000002",
    booking_type: "lab_visit",
    status: "completed",
    selected_time: "2:00 PM - 4:00 PM",
    selected_date: Math.floor(Date.now() / 1000) - 172800, // 2 days ago
    delivery_address: "Lab Branch, Main Hospital, Medical District",
    delivery_address_type: "lab",
    total_amount: "3500.00",
    user_name: "John Doe",
    user_email: "john@example.com",
    user_phone: "+923001234567",
    created_at: "2024-01-13 14:20:00",
    updated_at: "2024-01-14 16:30:00",
    tests: [
      {
        id: 4,
        test_name: "Lipid Profile",
        test_code: "LP001",
        test_price: "2000.00",
        test_category: "Biochemistry",
        status: "completed"
      },
      {
        id: 5,
        test_name: "Thyroid Profile",
        test_code: "THY001",
        test_price: "1500.00",
        test_category: "Hormones",
        status: "completed"
      }
    ]
  },
  {
    id: 3,
    booking_reference: "BK000003",
    booking_type: "home_collection",
    status: "pending",
    selected_time: "9:00 AM - 11:00 AM",
    selected_date: Math.floor(Date.now() / 1000) + 259200, // 3 days from now
    delivery_address: "456 Oak Avenue, Residential Area, Suburb, 67890",
    delivery_address_type: "home",
    total_amount: "1200.00",
    user_name: "John Doe",
    user_email: "john@example.com",
    user_phone: "+923001234567",
    created_at: "2024-01-16 09:15:00",
    updated_at: "2024-01-16 09:15:00",
    tests: [
      {
        id: 6,
        test_name: "COVID-19 RT-PCR",
        test_code: "COV001",
        test_price: "1200.00",
        test_category: "Virology",
        status: "pending"
      }
    ]
  },
  {
    id: 4,
    booking_reference: "BK000004",
    booking_type: "home_collection",
    status: "cancelled",
    selected_time: "3:00 PM - 5:00 PM",
    selected_date: Math.floor(Date.now() / 1000) - 86400, // Yesterday
    delivery_address: "789 Pine Street, Business District, Metro City, 54321",
    delivery_address_type: "office",
    total_amount: "800.00",
    user_name: "John Doe",
    user_email: "john@example.com",
    user_phone: "+923001234567",
    created_at: "2024-01-12 11:45:00",
    updated_at: "2024-01-12 13:20:00",
    tests: [
      {
        id: 7,
        test_name: "Urine Analysis",
        test_code: "URN001",
        test_price: "800.00",
        test_category: "Pathology",
        status: "cancelled"
      }
    ]
  }
];

const PreviousBookings = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setError(null);
      setIsUsingFallback(false);

      const loggedIn = await isUserLoggedIn();

      if (!loggedIn) {
        setError("Please login to view your bookings");
        setLoading(false);
        return;
      }

      const user = await getUserData();
      setUserData(user);

      if (!user || !user.user_id) {
        setError("Unable to fetch user information");
        setLoading(false);
        return;
      }

      const response = await bookingService.getUserBookings(user.user_id);

      if (response.success) {
        setBookings(response.data || []);
        setIsUsingFallback(false);
      } else {
        // API failed, use static fallback data
        console.log("API failed, using static fallback data");
        setBookings(staticBookings);
        setIsUsingFallback(true);
        setError(null); // Clear error to show fallback data instead
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      // Network/connection error, use static fallback data
      console.log("Network error, using static fallback data");
      setBookings(staticBookings);
      setIsUsingFallback(true);
      setError(null); // Clear error to show fallback data instead
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleBookingPress = (booking: Booking) => {
    router.push({
      pathname: "/profile/BookingDetails",
      params: {
        bookingData: JSON.stringify(booking),
      },
    });
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: string } = {
      pending: "schedule",
      confirmed: "check-circle",
      completed: "done-all",
      cancelled: "cancel",
      in_progress: "autorenew",
    };
    return icons[status.toLowerCase()] || "info";
  };

  const renderEmptyState = () => {
    if (error) {
      return (
        <View style={styles.emptyStateContainer}>
          <MaterialIcons name="error-outline" size={64} color="#ccc" />
          <Text style={styles.emptyStateTitle}>Oops!</Text>
          <Text style={styles.emptyStateText}>{error}</Text>
          {error.includes("login") ? (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push("/auth/LoginScreen")}
            >
              <Text style={styles.loginButtonText}>Go to Login</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.retryButton} onPress={fetchBookings}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <View style={styles.emptyStateContainer}>
        <MaterialIcons name="receipt-long" size={64} color="#ccc" />
        <Text style={styles.emptyStateTitle}>No Bookings Yet</Text>
        <Text style={styles.emptyStateText}>
          Your booking history will appear here once you make your first booking
        </Text>
        <TouchableOpacity
          style={styles.newBookingButton}
          onPress={() => router.push("/home")}
        >
          <Text style={styles.newBookingButtonText}>Book a Test</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderBookingCard = (booking: Booking) => {
    const statusColor = bookingService.getStatusColor(booking.status);
    const formattedDate = bookingService.formatBookingDate(booking.selected_date);
    const timeRemaining = bookingService.getTimeRemaining(
      booking.selected_date,
      booking.selected_time
    );

    return (
      <TouchableOpacity
        key={booking.id}
        style={styles.bookingCard}
        onPress={() => handleBookingPress(booking)}
        activeOpacity={0.7}
      >
        <View style={styles.bookingHeader}>
          <View style={styles.referenceContainer}>
            <Text style={styles.bookingReference}>{booking.booking_reference}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <MaterialIcons
                name={getStatusIcon(booking.status)}
                size={14}
                color="#fff"
              />
              <Text style={styles.statusText}>{booking.status.toUpperCase()}</Text>
            </View>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#777" />
        </View>

        <View style={styles.bookingBody}>
          <View style={styles.infoRow}>
            <MaterialIcons name="calendar-today" size={16} color="#666" />
            <Text style={styles.infoText}>{formattedDate}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="access-time" size={16} color="#666" />
            <Text style={styles.infoText}>{booking.selected_time}</Text>
            {booking.status !== "completed" && booking.status !== "cancelled" && (
              <Text style={styles.timeRemaining}>• {timeRemaining}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={16} color="#666" />
            <Text style={styles.infoText} numberOfLines={1}>
              {booking.delivery_address}
            </Text>
          </View>

          <View style={styles.testsContainer}>
            <Text style={styles.testsLabel}>
              Tests ({booking.tests.length}):
            </Text>
            <Text style={styles.testsList} numberOfLines={2}>
              {booking.tests.map((test) => test.test_name).join(", ")}
            </Text>
          </View>

          <View style={styles.bookingFooter}>
            <Text style={styles.totalAmount}>₹{booking.total_amount}</Text>
            <Text style={styles.bookingType}>
              {booking.booking_type.replace("_", " ").toUpperCase()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0d9b1e" />
        <Text style={styles.loadingText}>Loading your bookings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Previous Bookings</Text>
        <TouchableOpacity onPress={onRefresh}>
          <MaterialIcons name="refresh" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#0d9b1e"]}
          />
        }
      >
        {bookings.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {isUsingFallback && (
              <View style={styles.fallbackBanner}>
                <MaterialIcons name="info" size={16} color="#ff9800" />
                <Text style={styles.fallbackText}>
                  Showing sample data. Unable to connect to server.
                </Text>
                <TouchableOpacity onPress={fetchBookings} style={styles.retryIconButton}>
                  <MaterialIcons name="refresh" size={16} color="#ff9800" />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>
                {isUsingFallback ? "Sample Bookings" : "Total Bookings"}: {bookings.length}
              </Text>
              {isUsingFallback && (
                <Text style={styles.fallbackNote}>
                  This is demo data for UI preview
                </Text>
              )}
            </View>
            {bookings.map(renderBookingCard)}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default PreviousBookings;