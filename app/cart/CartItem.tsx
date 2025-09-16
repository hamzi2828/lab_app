import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type CartItemData = {
  id: string;
  title: string;
  price?: string; // Make price optional
  originalPrice?: string;
  discountedPrice?: string;
  image: string | ImageSourcePropType;
  badges?: string[];
  rating?: string;
};

type Props = {
  item: CartItemData;
  onRemove?: () => void;
};

const CartItem: React.FC<Props> = ({ item, onRemove }) => {

  return (
    <View style={styles.container}>
      {/* Delete Button */}
      <TouchableOpacity style={styles.deleteButton} onPress={onRemove}>
        <Ionicons name="trash-outline" size={20} color="#ff4444" />
      </TouchableOpacity>

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
          <View style={styles.priceContainer}>
            {item.discountedPrice ? (
              <>
                <Text style={styles.discountedPrice}>{item.discountedPrice}</Text>
                <Text style={styles.originalPrice}>{item.originalPrice}</Text>
              </>
            ) : (
              <Text style={styles.itemPrice}>{item.price}</Text>
            )}
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
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
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
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  deleteButton: {
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
}); 

export default CartItem;
