import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Import Material Icons from Expo
import { useRouter } from "expo-router";

export default function AddressCard() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addAddress}
        onPress={() => router.push("/profile/EditAddress")}
      >
        <Text style={styles.addAddressText}>+ Add address</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="location-on" size={24} color="#0d9b1e" />
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>Arsam Javed</Text>
          <Text style={styles.phone}>3329832805</Text>
          <Text style={styles.address}>Soan Gardens, Islamabad</Text>
          <Text style={styles.address}>
            Punjab, Rawalpindi - Soan Garden, F Block
          </Text>
          <View style={styles.tags}>
            <View style={styles.tagHome}>
              <Text style={styles.tagText}>HOME</Text>
            </View>
            <View style={styles.tagDefault}>
              <Text style={styles.tagDefaultText}>
                Default shipping address
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push("/profile/EditAddress")}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  addAddress: {
    backgroundColor: "#FFF",
    padding: 50,
    borderRadius: 8,
    borderColor: "#0d9b1e",
    borderWidth: 1,
    marginBottom: 16,
    alignItems: "center",
  },
  addAddressText: {
    color: "#0d9b1e",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    borderColor: "#DDD",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  tags: {
    flexDirection: "row",
    marginTop: 8,
  },
  tagHome: {
    backgroundColor: "#E8F5E9",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  tagText: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "bold",
  },
  tagDefault: {
    backgroundColor: "#FFE0E0",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  tagDefaultText: {
    color: "#D32F2F",
    fontSize: 12,
    fontWeight: "bold",
  },
  editButton: {
    marginLeft: 12,
  },
  editText: {
    color: "#0d9b1e",
    fontWeight: "bold",
    fontSize: 14,
  },
});
