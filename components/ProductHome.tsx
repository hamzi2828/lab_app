import React from "react";
import { Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { BRAND_GREEN } from "../constants/Colors";
import ProductCard from "./ProductCard";

const productData = [
  {
    id: "1",
    title: "Complete Blood Count",
    image: require("../assets/tests/CBC.png"),
    originalPrice: "Rs.449",
    discountedPrice: "Rs.299.99",
    badges: ["50% off"],
    rating: "★★★★★",
  },
  {
    id: "2",
    title: "Hemoglobin A1C",
    image: require("../assets/tests/HBA1C.png"),
    originalPrice: "Rs.999",
    discountedPrice: "Rs.799.99",
    badges: ["30% off"],
    rating: "★★★★★",
  },
  {
    id: "3",
    title: "LFT",
    image: require("../assets/tests/LFT.png"),
    originalPrice: "Rs.599",
    discountedPrice: "Rs.499.99",
    badges: ["20% off"],
    rating: "★★★★☆",
  },
  {
    id: "4",
    title: "Lipid Profile",
    image: require("../assets/tests/LP.png"),
    originalPrice: "Rs.699",
    discountedPrice: "Rs.599.99",
    badges: ["10% off"],
    rating: "★★★★☆",
  },
  {
    id: "5",
    title: "Renal Function Test",
    image: require("../assets/tests/RFT.png"),
    originalPrice: "Rs.1,299",
    discountedPrice: "Rs.1,099.99",
    badges: ["15% off"],
    rating: "★★★★★",
  },
  {
    id: "6",
    title: "TSH",
    image: require("../assets/tests/TSH.png"),
    originalPrice: "Rs.899",
    discountedPrice: "Rs.699.99",
    badges: ["20% off"],
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
      onPress={() => console.log("ProductDetail removed - TODO: Add new navigation")}
      onBookPress={() => console.log("ProductDetail removed - TODO: Add new navigation")}
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
