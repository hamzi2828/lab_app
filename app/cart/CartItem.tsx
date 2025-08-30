import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type CartItemData = {
  id: string;
  title: string;
  price: string;
  image: string | ImageSourcePropType;
};

type Props = { item: CartItemData };

const CartItem: React.FC<Props> = ({ item }) => {

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
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{item.price}</Text>
          {/* Delete Button */}
          <TouchableOpacity style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={18} color="black" />
          </TouchableOpacity>
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
  deleteButton: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CartItem;
