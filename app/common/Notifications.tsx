import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const notificationsData = [
  {
    id: "1",
    message:
      "Gilbert, you placed an order. Check your order history for full details.",
  },
  {
    id: "2",
    message:
      "Gilbert, you placed an order. Check your order history for full details.",
  },
  {
    id: "3",
    message:
      "Gilbert, you placed an order. Check your order history for full details.",
  },
];

const Notifications = () => {
  const navigation = useNavigation();

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Ionicons
        name="notifications-outline"
        size={24}
        color="black"
        style={styles.notificationIcon}
      />
      <Text style={styles.notificationText}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {/* Notification List */}
      <FlatList
        data={notificationsData}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: StatusBar.currentHeight || 20, // Ensure the header is not hidden by the StatusBar
    backgroundColor: "#fff",
    elevation: 3,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 16,
    zIndex: 1, // Ensures it is above the title
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },
  notificationIcon: {
    marginRight: 12,
  },
  notificationText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
});

export default Notifications;
