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
  booking_reference?: string;
  booking_type?: string;
  status?: string;
  selected_time?: string;
  selected_date?: number;
  delivery_address?: string;
  delivery_address_type?: string;
  total_amount?: number | string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  created_at?: string;
  updated_at?: string;
  tests?: Test[];
}

interface Test {
  id: number;
  test_name?: string;
  test_code?: string;
  test_price?: number | string;
  test_category?: string;
  status?: string;
}


const PreviousBookings = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setError(null);

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

      console.log("=== API Response Debug ===");
      console.log("Response success:", response.success);
      console.log("Response message:", response.message);
      console.log("Response data:", JSON.stringify(response.data, null, 2));
      console.log("Response count:", response.count);

      if (response.success) {
        const bookings = response.data || [];
        console.log("Setting bookings:", bookings.length, "items");
        setBookings(bookings);
      } else {
        setError(response.message || "Failed to load bookings");
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Unable to connect to server. Please check your internet connection.");
      setBookings([]);
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
    const status = booking.status || 'pending';
    const statusColor = bookingService.getStatusColor(status);
    const formattedDate = booking.selected_date
      ? bookingService.formatBookingDate(booking.selected_date)
      : 'Date not available';
    const timeRemaining = booking.selected_date && booking.selected_time
      ? bookingService.getTimeRemaining(booking.selected_date, booking.selected_time)
      : 'Time not available';

    return (
      <TouchableOpacity
        key={booking.id}
        style={styles.bookingCard}
        onPress={() => handleBookingPress(booking)}
        activeOpacity={0.7}
      >
        <View style={styles.bookingHeader}>
          <View style={styles.referenceContainer}>
            <Text style={styles.bookingReference}>
              {booking.booking_reference || `Booking #${booking.id}`}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <MaterialIcons
                name={getStatusIcon(status)}
                size={14}
                color="#fff"
              />
              <Text style={styles.statusText}>{status.toUpperCase()}</Text>
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
            <Text style={styles.infoText}>{booking.selected_time || 'Time not available'}</Text>
            {status !== "completed" && status !== "cancelled" && timeRemaining !== 'Time not available' && (
              <Text style={styles.timeRemaining}>• {timeRemaining}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={16} color="#666" />
            <Text style={styles.infoText} numberOfLines={1}>
              {booking.delivery_address || 'Address not available'}
            </Text>
          </View>

          <View style={styles.testsContainer}>
            <Text style={styles.testsLabel}>
              Tests ({booking.tests?.length || 0}):
            </Text>
            <Text style={styles.testsList} numberOfLines={2}>
              {booking.tests?.length
                ? booking.tests.map((test) => test.test_name || 'Unknown Test').join(", ")
                : 'No tests listed'
              }
            </Text>
          </View>

          <View style={styles.bookingFooter}>
            <Text style={styles.totalAmount}>
              ₹{booking.total_amount ? Number(booking.total_amount).toFixed(2) : "0.00"}
            </Text>
            <Text style={styles.bookingType}>
              {booking.booking_type ? booking.booking_type.replace("_", " ").toUpperCase() : 'BOOKING'}
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
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>
                Total Bookings: {bookings.length}
              </Text>
            </View>
            {bookings.map(renderBookingCard)}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default PreviousBookings;