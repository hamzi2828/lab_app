import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router"; // Import the router for navigation

const RecommendedCard = () => {
  const router = useRouter(); // Initialize the router
  const productData = [
    {
      id: "1",
      title: "Samsung Galaxy S24 Ultra",
      image: require("../../assets/images/iphone.png"),
      originalPrice: "£449",
      discountedPrice: "£299.99",
      badges: ["50% off", "Refurbished"],
      rating: "★★★★★",
    },
    {
      id: "2",
      title: "iPhone 14 Pro Max",
      image: require("../../assets/images/samsung.png"),
      originalPrice: "£999",
      discountedPrice: "£799.99",
      badges: ["30% off", "Refurbished"],
      rating: "★★★★★",
    },
    {
      id: "3",
      title: "Google Pixel 7 Pro",
      image: require("../../assets/images/iphone.png"),
      originalPrice: "£599",
      discountedPrice: "£499.99",
      badges: ["20% off", "Refurbished"],
      rating: "★★★★☆",
    },
    {
      id: "4",
      title: "OnePlus 11",
      image: require("../../assets/images/samsung.png"),
      originalPrice: "£699",
      discountedPrice: "£599.99",
      badges: ["10% off", "Refurbished"],
      rating: "★★★★☆",
    },
  ];

  return (
    <View style={styles.container}>
      {productData.slice(0, 2).map((item) => (
        <Pressable
          key={item.id}
          style={styles.card}
          onPress={() =>
            router.push({ pathname: "/home/ProductDetail", params: item })
          } // Pass product details
        >
          <View style={styles.badgeContainer}>
            {(item.badges || []).map((badge, index) => (
              <View key={index} style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>

          <Image source={item.image} style={styles.productImage} />

          <View>
            <Text style={styles.productTitle}>{item.title}</Text>
            <View style={styles.cardBottom}>
              <View>
                <Text
                  style={styles.originalPrice}
                >{`From ${item.originalPrice}`}</Text>
                <Text style={styles.discountedPrice}>
                  {item.discountedPrice}
                </Text>
              </View>
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap", // Allows wrapping if cards exceed the row
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    maxWidth: "48%", // Ensures two cards fit in one row
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    margin: 5,
    padding: 10,
    overflow: "hidden",
  },
  badgeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  badge: {
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  productImage: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
    height: 35,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  originalPrice: {
    fontSize: 12,
    color: "gray",
    textDecorationLine: "line-through",
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  rating: {
    fontSize: 14,
    color: "orange",
  },
});

export default RecommendedCard;
