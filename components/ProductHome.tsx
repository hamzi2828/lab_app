import React from "react";
import { Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { BRAND_GREEN } from "../constants/Colors";
import ProductCard from "./ProductCard";

const productData = [
  {
    id: "1",
    title: "Samsung Galaxy S24",
    image: require("../assets/images/iphone.png"),
    originalPrice: "£449",
    discountedPrice: "£299.99",
    badges: ["50% off", "Refurbished"],
    rating: "★★★★★",
  },
  {
    id: "2",
    title: "iPhone 14 Pro Max",
    image: require("../assets/images/samsung.png"),
    originalPrice: "£999",
    discountedPrice: "£799.99",
    badges: ["30% off", "Refurbished"],
    rating: "★★★★★",
  },
  {
    id: "3",
    title: "Google Pixel 7 Pro",
    image: require("../assets/images/iphone.png"),
    originalPrice: "£599",
    discountedPrice: "£499.99",
    badges: ["20% off", "Refurbished"],
    rating: "★★★★☆",
  },
  {
    id: "4",
    title: "OnePlus 11",
    image: require("../assets/images/samsung.png"),
    originalPrice: "£699",
    discountedPrice: "£599.99",
    badges: ["10% off", "Refurbished"],
    rating: "★★★★☆",
  },
  {
    id: "5",
    title: "Samsung Galaxy Z Fold 5",
    image: require("../assets/images/samsung.png"),
    originalPrice: "£1,299",
    discountedPrice: "£1,099.99",
    badges: ["15% off", "Brand New"],
    rating: "★★★★★",
  },
  {
    id: "6",
    title: "Xiaomi Mi 13 Ultra",
    image: require("../assets/images/iphone.png"),
    image2: require("../assets/images/iphone.png"),
    originalPrice: "£899",
    discountedPrice: "£699.99",
    badges: ["20% off", "Brand New"],
    rating: "★★★★☆",
  },
];

const ProductHome = () => {
  const router = useRouter();

  const renderItem = ({ item }: { item: any }) => (
    <ProductCard
      title={item.title}
      image={item.image}
      originalPrice={item.originalPrice}
      discountedPrice={item.discountedPrice}
      badges={item.badges}
      onPress={() => router.push({ pathname: "/home/ProductDetail", params: item })}
      onBookPress={() => router.push({ pathname: "/home/ProductDetail", params: item })}
    />
  );

  return (
    <FlatList
      data={productData.slice(0, 6)}
      renderItem={renderItem}
      keyExtractor={(item: any) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
      ListFooterComponent={() => (
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => router.push("/home/AllTests")}
          activeOpacity={0.85}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      )}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  row: {
    justifyContent: "space-between",
  },
  viewAllButton: {
    marginTop: 8,
    marginHorizontal: 10,
    marginBottom: 16,
    height: 40,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: BRAND_GREEN,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  viewAllText: {
    color: BRAND_GREEN,
    fontSize: 14,
    fontWeight: "700",
  },
});

export default ProductHome;
