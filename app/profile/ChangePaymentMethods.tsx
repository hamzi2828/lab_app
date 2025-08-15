import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
  StatusBar,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const paymentMethods = [
  { id: 1, name: "Visa", logo: "https://via.placeholder.com/40?text=Visa" },
  { id: 2, name: "MasterCard", logo: "https://via.placeholder.com/40?text=MC" },
  {
    id: 3,
    name: "American Express",
    logo: "https://via.placeholder.com/40?text=AMEX",
  },
  { id: 4, name: "PayPal", logo: "https://via.placeholder.com/40?text=PayPal" },
  { id: 5, name: "Diners", logo: "https://via.placeholder.com/40?text=Diners" },
];

const ChangePaymentMethods = () => {
  const router = useRouter();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.paymentOption}
      onPress={() =>
        router.push(`/profile/AddPaymentMethod?method=${item.name}`)
      } // Navigate with the method name
    >
      <View style={styles.paymentInfo}>
        <Image source={{ uri: item.logo }} style={styles.paymentLogo} />
        <Text style={styles.paymentText}>{item.name}</Text>
      </View>
      <MaterialIcons name="keyboard-arrow-right" size={24} color="#777" />
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        {
          marginTop:
            Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
        },
      ]}
    >
      <StatusBar />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Payment Methods</Text>
      </View>

      {/* Payment Methods List */}
      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
    color: "#000",
  },
  listContainer: {
    padding: 20,
  },
  paymentOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 1,
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 15,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});

export default ChangePaymentMethods;
