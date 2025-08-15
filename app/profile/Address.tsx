import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // For icons
import { useRouter } from "expo-router";
import AddressCard from "./AddressCard";

const Address = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* StatusBar */}
      <StatusBar translucent backgroundColor="transparent" style="dark" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Address</Text>
      </View>
      <AddressCard />
      {/* Address Card */}
      {/* <View style={styles.addressCard}>
        <Text style={styles.addressText}>2715 Ash Dr. San Jose, South...</Text>
        <TouchableOpacity>
          <Text
            style={styles.editText}
            onPress={() => router.push("/profile/EditAddress")}
          >
            Edit
          </Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, // Add padding only on Android
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
    flex: 1,
    textAlign: "center",
    marginRight: 40, // Offset to center the title
  },
  addressCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginHorizontal: 15,
    borderRadius: 8,
    marginTop: 20,
    elevation: 1,
  },
  addressText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  editText: {
    fontSize: 16,
    color: "#0d9b1e",
    fontWeight: "600",
  },
});

export default Address;
