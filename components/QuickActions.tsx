import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BRAND_GREEN } from "../constants/Colors";
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
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {actions.map(({ key, labelTop, Icon, onPress }) => (
          <TouchableOpacity key={key} style={styles.card} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.iconWrap}>{Icon(BRAND_GREEN, 28)}</View>
            <Text style={styles.label}>
              {labelTop}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
