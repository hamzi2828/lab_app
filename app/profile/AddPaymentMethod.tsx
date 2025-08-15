import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const AddPaymentMethod = () => {
  const router = useRouter();

  // State for card details
  const [cardHolderName, setCardHolderName] = useState("John Henry");
  const [cardNumber, setCardNumber] = useState("**** **** **** 3947");
  const [expiryMonth, setExpiryMonth] = useState("05");
  const [expiryYear, setExpiryYear] = useState("23");
  const [cvc, setCvc] = useState("123");
  const [isDefault, setIsDefault] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Payment Methods</Text>
      </View>

      {/* Card Preview */}
      <View style={styles.cardPreview}>
        <View style={styles.cardTop}>
          <MaterialIcons name="credit-card" size={32} color="#FFD700" />
          <Text style={styles.cardNumber}>{cardNumber}</Text>
        </View>
        <View style={styles.cardDetails}>
          <View>
            <Text style={styles.cardLabel}>Card Holder Name</Text>
            <Text style={styles.cardInfo}>{cardHolderName}</Text>
          </View>
          <View>
            <Text style={styles.cardLabel}>Expiry Date</Text>
            <Text style={styles.cardInfo}>
              {expiryMonth}/{expiryYear}
            </Text>
          </View>
        </View>
        <Image
          source={{ uri: "https://via.placeholder.com/40?text=MC" }}
          style={styles.cardLogo}
        />
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Cardholder name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Henry"
          value={cardHolderName}
          onChangeText={(text) => setCardHolderName(text)} // Update cardHolderName in state
        />

        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="**** **** **** 3947"
          value={cardNumber}
          onChangeText={(text) => setCardNumber(text)} // Update cardNumber in state
          keyboardType="numeric"
        />

        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Exp Month</Text>
            <TextInput
              style={styles.input}
              placeholder="05"
              value={expiryMonth}
              onChangeText={(text) => setExpiryMonth(text)} // Update expiryMonth in state
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Exp Year</Text>
            <TextInput
              style={styles.input}
              placeholder="23"
              value={expiryYear}
              onChangeText={(text) => setExpiryYear(text)} // Update expiryYear in state
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={styles.label}>CVC</Text>
        <TextInput
          style={styles.input}
          placeholder="123"
          value={cvc}
          onChangeText={(text) => setCvc(text)} // Update CVC in state
          keyboardType="numeric"
        />

        {/* Default Payment Toggle */}
        <View style={styles.defaultToggle}>
          <Text style={styles.label}>Set as default payment method</Text>
          <Switch
            value={isDefault}
            onValueChange={(value) => setIsDefault(value)}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
    color: "#000",
  },
  cardPreview: {
    backgroundColor: "#2C2C2C",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  cardNumber: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardLabel: {
    color: "#B0B0B0",
    fontSize: 12,
  },
  cardInfo: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },
  cardLogo: {
    width: 40,
    height: 40,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInputContainer: {
    width: "48%",
  },
  defaultToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  saveButton: {
    backgroundColor: "#00C853",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddPaymentMethod;
