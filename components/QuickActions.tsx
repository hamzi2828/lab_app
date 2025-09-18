import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BRAND_GREEN } from "../constants/Colors";
import LoginRequiredModal from "./LoginRequiredModal";
import reportsIcon from "../assets/icons/reports.png";
import riderIcon from "../assets/icons/rider.png";
import mybookingsIcon from "../assets/icons/mybooking.png";
import feedbackIcon from "../assets/icons/feedback.png";


const actions = [
  {
    key: "reports",
    labelTop: "View Reports",
    Icon: (color: string, size: number) => (
      <Image source={reportsIcon} style={{ width: size, height: size }} />
    ),
    onPress: () => {},
  },
  {
    key: "homeSampling",
    labelTop: "Free Home Sampling",
    Icon: (color: string, size: number) => (
      <Image source={riderIcon} style={{ width: size, height: size }} />
    ),
    onPress: () => {},
  },
  {
    key: "bookings",
    labelTop: "My Bookings",
        Icon: (color: string, size: number) => (
      <Image source={mybookingsIcon} style={{ width: size, height: size }} />
    ),
    onPress: () => {},
  },
  {
    key: "feedback",
    labelTop: "Feedback",
    Icon: (color: string, size: number) => (
      <Image source={feedbackIcon} style={{ width: size, height: size }} />
    ),
    onPress: () => {},
  },
];

const QuickActions = () => {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Mock function to check if user is logged in
  // Replace this with your actual authentication logic
  const isUserLoggedIn = () => {
    // For now, returning false to demonstrate the modal
    // You should replace this with your actual auth check
    return false;
  };

  const handleMyBookingsPress = () => {
    if (isUserLoggedIn()) {
      // User is logged in, navigate to previous bookings
      router.push('/profile/PreviousBookings');
    } else {
      // User is not logged in, show login modal
      setShowLoginModal(true);
    }
  };

  const handleActionPress = (actionKey: string) => {
    switch (actionKey) {
      case 'bookings':
        handleMyBookingsPress();
        break;
      case 'reports':
        // Handle reports action
        console.log('Reports pressed');
        break;
      case 'homeSampling':
        // Handle home sampling action
        console.log('Home sampling pressed');
        break;
      case 'feedback':
        // Handle feedback action
        console.log('Feedback pressed');
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {actions.map(({ key, labelTop, Icon }) => (
          <TouchableOpacity
            key={key}
            style={styles.card}
            onPress={() => handleActionPress(key)}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrap}>{Icon(BRAND_GREEN, 28)}</View>
            <Text style={styles.label}>
              {labelTop}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Login Required Modal */}
      <LoginRequiredModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Login Required"
        subtitle="Please sign in to view your booking history"
        redirectPath="/profile/PreviousBookings"
        benefits={[
          "View all your past bookings",
          "Track booking status and results",
          "Download reports and invoices"
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fff",
    paddingVertical: 8,
  },
  row: {
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
  },
  card: {
    width: "23%",
    height: 110,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    justifyContent: "center",
    alignItems: "center",
    // light shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrap: {
    width: 48,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  label: {
    textAlign: "center",
    fontSize: 10,
    color: "#111",
    fontWeight: "600",
    lineHeight: 18,
  },
});

export default QuickActions;
