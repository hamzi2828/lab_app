import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Make sure to install @expo/vector-icons
import { useRouter } from "expo-router";
import ProfileTopComponent from "./ProfileTopComponent";

const Profile = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <ProfileTopComponent />
      {/* Profile Section */}
      {/* <View style={styles.profileSection}>
        <Image
          source={{
            uri: "https://via.placeholder.com/80", // Replace with your profile image
          }}
          style={styles.profileImage}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>Gilbert Jones</Text>
          <Text style={styles.email}>Gilbertjones001@gmail.com</Text>
          <Text style={styles.phone}>121-224-7890</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.edit}>Edit</Text>
        </TouchableOpacity>
      </View> */}

      {/* Options */}
      <TouchableOpacity
        style={styles.option}
        onPress={() => router.push("/profile/Address")}
      >
        <Text style={styles.optionText}>Address</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="#777" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={() => router.push("/profile/ChangePaymentMethods")}
      >
        <Text style={styles.optionText}>Payment</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="#777" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Help</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="#777" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Support</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="#777" />
      </TouchableOpacity>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ddd",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#777",
    marginVertical: 2,
  },
  phone: {
    fontSize: 14,
    color: "#777",
  },
  edit: {
    fontSize: 14,
    color: "#0d9b1e",
    fontWeight: "600",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 1,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  signOut: {
    marginTop: 20,
    alignItems: "center",
  },
  signOutText: {
    fontSize: 16,
    color: "#ff0000",
    fontWeight: "600",
  },
});

export default Profile;
