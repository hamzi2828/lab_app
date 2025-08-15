import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const EditAddress = () => {
  return (
    <View style={styles.container}>
      {/* StatusBar */}
      <StatusBar translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Address</Text>
      </View>

      {/* Form */}
      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            defaultValue="David Guetta"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            defaultValue="David Guetta"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            defaultValue="abcd@gmail.com"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            defaultValue="+1 202 555 0142"
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Flat No, Street Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Flat No, Street Details"
            defaultValue="38921 Rnachiiswe Dr. Richardson, California 62639"
            multiline
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Landmark</Text>
          <TextInput
            style={styles.input}
            placeholder="Landmark"
            defaultValue="Walmart"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>State</Text>
          <TextInput
            style={styles.input}
            placeholder="State"
            defaultValue="98380"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>City/District</Text>
          <TextInput
            style={styles.input}
            placeholder="City/District"
            defaultValue="98380"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pincode</Text>
          <TextInput
            style={styles.input}
            placeholder="Pincode"
            defaultValue="Los Angeles"
          />
        </View>
      </ScrollView>

      {/* Save Button (Fixed at the bottom) */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, // Apply margin only on Android
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
    textAlign: "center",
    flex: 1,
    marginRight: 30,
  },
  formContainer: {
    padding: 15,
    paddingBottom: 70,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f9f9f9",
  },
  saveButton: {
    backgroundColor: "#0d9b1e",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    position: "absolute",
    bottom: 20, // Fixed at the bottom of the screen
    left: 15,
    right: 15,
  },
  saveButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "600",
  },
});

export default EditAddress;
