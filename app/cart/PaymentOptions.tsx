import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from "react-native";

const PaymentOptions = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    "mastercard"
  );

  // Payment Options with Images
  const paymentOptions = [
    { id: "paypal", image: require("../../assets/images/Paypal.png") },
    { id: "visa", image: require("../../assets/images/Visa.png") },
    { id: "mastercard", image: require("../../assets/images/Mastercard.png") },
    { id: "dinersclub", image: require("../../assets/images/Diners.png") },
    { id: "amex", image: require("../../assets/images/Amex.png") },
  ];

  return (
    <View style={styles.container}>
      {/* Payment Options */}
      <Text style={styles.title}>Select Payment Method</Text>
      <FlatList
        data={paymentOptions}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.optionWrapper,
              selectedOption === item.id && styles.selectedOption,
            ]}
            onPress={() => setSelectedOption(item.id)}
          >
            <View style={styles.imageWrapper}>
              <Image source={item.image} style={styles.icon} />
              {selectedOption === item.id && (
                <View style={styles.tickContainer}>
                  <Text style={styles.tick}>✔</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Dynamic Input Fields */}
      {selectedOption && (
        <View style={styles.inputContainer}>
          {selectedOption === "paypal" && (
            <>
              <Text style={styles.inputLabel}>Cardholder Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter cardholder name"
              />

              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter card number"
                keyboardType="numeric"
              />

              <View style={styles.row}>
                <View style={styles.dropdownContainer}>
                  <Text style={styles.inputLabel}>Expiry Month</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM"
                    maxLength={2}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.dropdownContainer}>
                  <Text style={styles.inputLabel}>Expiry Year</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY"
                    maxLength={4}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>CVC</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter CVC"
                keyboardType="numeric"
              />
            </>
          )}

          {["visa", "mastercard", "dinersclub", "amex"].includes(
            selectedOption
          ) && (
            <>
              <Text style={styles.inputLabel}>Cardholder Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter cardholder name"
              />

              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter card number"
                keyboardType="numeric"
              />

              <View style={styles.row}>
                <View style={styles.dropdownContainer}>
                  <Text style={styles.inputLabel}>Expiry Month</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM"
                    maxLength={2}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.dropdownContainer}>
                  <Text style={styles.inputLabel}>Expiry Year</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY"
                    maxLength={4}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>CVC</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter CVC"
                keyboardType="numeric"
              />
            </>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  flatListContainer: {
    paddingVertical: 10,
  },
  optionWrapper: {
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedOption: {
    borderColor: "#007bff",
  },
  imageWrapper: {
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 70,
    height: 70,
  },
  tickContainer: {
    position: "absolute",
    top: 5,
    right: 10,
    backgroundColor: "#28a745",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  tick: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  inputContainer: {
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdownContainer: {
    flex: 1,
    marginRight: 10,
  },
});

export default PaymentOptions;
