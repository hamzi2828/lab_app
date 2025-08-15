import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CartItem = ({ item }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <View style={styles.container}>
      {/* Left Checkbox */}
      <View style={styles.checkboxContainer}>
        <View style={styles.checkbox}>
          <Ionicons name="checkmark" size={16} color="#fff" />
        </View>
      </View>

      {/* Product Image */}
      <Image
        source={
          typeof item.image === "string"
            ? { uri: item.image } // For remote image URIs
            : item.image // For local images using require()
        }
        style={styles.productImage}
      />

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.variantText}>Variant: {item.variant}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{item.price}</Text>
          {/* Quantity Controls */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              style={styles.quantityButton}
            >
              <Ionicons name="remove" size={18} color="black" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              onPress={() => setQuantity(quantity + 1)}
              style={styles.quantityButton}
            >
              <Ionicons name="add" size={18} color="black" />
            </TouchableOpacity>
            {/* Delete Button */}
            <TouchableOpacity style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={18} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  checkboxContainer: {
    marginRight: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkbox: {
    width: 20,
    height: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  variantText: {
    fontSize: 12,
    color: "gray",
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    marginTop: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 15,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  deleteButton: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CartItem;
