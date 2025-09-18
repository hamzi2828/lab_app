import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { styles } from "../../styles/profile/BookingDetails.styles";
import bookingService from "../../services/bookingService";

interface Test {
  id: number;
  test_name: string;
  test_code: string;
  test_price: string;
  test_category: string;
  status: string;
}

interface BookingData {
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

const BookingDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.bookingData) {
      try {
        const parsedData = JSON.parse(params.bookingData as string);
        setBooking(parsedData);
      } catch (error) {
        console.error("Error parsing booking data:", error);
        Alert.alert("Error", "Failed to load booking details");
        router.back();
      }
    } else {
      Alert.alert("Error", "No booking data available");
      router.back();
    }
    setLoading(false);
  }, [params.bookingData]);

  const handleShare = async () => {
    if (!booking) return;

    try {
      const message = `
Booking Details
Reference: ${booking.booking_reference}
Status: ${booking.status.toUpperCase()}
Date: ${bookingService.formatBookingDate(booking.selected_date)}
Time: ${booking.selected_time}
Total Amount: ₹${booking.total_amount}
Tests: ${booking.tests.map((t) => t.test_name).join(", ")}
      `.trim();

      await Share.share({
        message: message,
        title: `Booking ${booking.booking_reference}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleCallSupport = () => {
    const phoneNumber = "tel:+1234567890"; // Replace with actual support number
    Linking.openURL(phoneNumber).catch((err) => {
      Alert.alert("Error", "Unable to make phone call");
    });
  };

  const handleCancelBooking = () => {
    if (!booking || booking.status === "cancelled" || booking.status === "completed") {
      return;
    }

    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => {
            Alert.alert("Info", "Booking cancellation will be available soon");
          },
        },
      ]
    );
  };

  const handleReschedule = () => {
    if (!booking || booking.status === "cancelled" || booking.status === "completed") {
      return;
    }
    Alert.alert("Info", "Booking rescheduling will be available soon");
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

  if (loading || !booking) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const statusColor = bookingService.getStatusColor(booking.status);
  const formattedDate = bookingService.formatBookingDate(booking.selected_date);
  const canModify = booking.status !== "cancelled" && booking.status !== "completed";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <TouchableOpacity onPress={handleShare}>
          <MaterialIcons name="share" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <View style={[styles.statusCard, { backgroundColor: statusColor }]}>
          <MaterialIcons
            name={getStatusIcon(booking.status)}
            size={48}
            color="#fff"
          />
          <Text style={styles.statusTitle}>{booking.status.toUpperCase()}</Text>
          <Text style={styles.bookingRef}>{booking.booking_reference}</Text>
        </View>

        {/* Booking Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Information</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{formattedDate}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Time Slot</Text>
            <Text style={styles.infoValue}>{booking.selected_time}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Booking Type</Text>
            <Text style={styles.infoValue}>
              {booking.booking_type.replace("_", " ").toUpperCase()}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Created On</Text>
            <Text style={styles.infoValue}>
              {new Date(booking.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Address Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Collection Address</Text>
          <View style={styles.addressContainer}>
            <MaterialIcons name="location-on" size={20} color="#0d9b1e" />
            <View style={styles.addressTextContainer}>
              <Text style={styles.addressType}>
                {booking.delivery_address_type.toUpperCase()}
              </Text>
              <Text style={styles.addressText}>{booking.delivery_address}</Text>
            </View>
          </View>
        </View>

        {/* User Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Information</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{booking.user_name}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{booking.user_email}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{booking.user_phone}</Text>
          </View>
        </View>

        {/* Tests Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tests ({booking.tests.length})</Text>
          {booking.tests.map((test, index) => (
            <View key={test.id} style={styles.testCard}>
              <View style={styles.testHeader}>
                <Text style={styles.testNumber}>#{index + 1}</Text>
                <Text style={styles.testCode}>{test.test_code}</Text>
              </View>
              <Text style={styles.testName}>{test.test_name}</Text>
              <View style={styles.testFooter}>
                <Text style={styles.testCategory}>{test.test_category}</Text>
                <Text style={styles.testPrice}>₹{test.test_price}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Total Amount */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>₹{booking.total_amount}</Text>
        </View>

        {/* Action Buttons */}
        {canModify && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.rescheduleButton}
              onPress={handleReschedule}
            >
              <MaterialIcons name="schedule" size={20} color="#0d9b1e" />
              <Text style={styles.rescheduleButtonText}>Reschedule</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelBooking}
            >
              <MaterialIcons name="cancel" size={20} color="#fff" />
              <Text style={styles.cancelButtonText}>Cancel Booking</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Support Section */}
        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>Need Help?</Text>
          <TouchableOpacity style={styles.supportButton} onPress={handleCallSupport}>
            <MaterialIcons name="phone" size={20} color="#0d9b1e" />
            <Text style={styles.supportButtonText}>Call Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default BookingDetails;