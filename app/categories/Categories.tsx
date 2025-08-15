import React, { useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import Header from "../common/Header";

const { width } = Dimensions.get("window");

// Dummy Data for Categories and Products
const categories = [
  { id: "1", name: "Infinix", icon: "https://via.placeholder.com/50" },
  { id: "2", name: "Apple", icon: "https://via.placeholder.com/50" },
  { id: "3", name: "Samsung", icon: "https://via.placeholder.com/50" },
  { id: "4", name: "Xiomi", icon: "https://via.placeholder.com/50" },
  { id: "5", name: "Huawei", icon: "https://via.placeholder.com/50" },
  { id: "6", name: "Nokia", icon: "https://via.placeholder.com/50" },
  { id: "7", name: "OnePlus", icon: "https://via.placeholder.com/50" },
  { id: "8", name: "LG", icon: "https://via.placeholder.com/50" },
  { id: "9", name: "Google", icon: "https://via.placeholder.com/50" },
  { id: "10", name: "Sony", icon: "https://via.placeholder.com/50" },
  { id: "11", name: "Motorola", icon: "https://via.placeholder.com/50" },
  { id: "12", name: "Realme", icon: "https://via.placeholder.com/50" },
  { id: "13", name: "Oppo", icon: "https://via.placeholder.com/50" },
  { id: "14", name: "Asus", icon: "https://via.placeholder.com/50" },
  { id: "15", name: "Vivo", icon: "https://via.placeholder.com/50" },
];

const products = [
  {
    id: "1",
    categoryId: "1",
    name: "Product 1",
    image: "https://via.placeholder.com/80",
  },
  {
    id: "2",
    categoryId: "1",
    name: "Product 2",
    image: "https://via.placeholder.com/80",
  },
  {
    id: "3",
    categoryId: "2",
    name: "Product 3",
    image: "https://via.placeholder.com/80",
  },
  {
    id: "4",
    categoryId: "3",
    name: "Product 4",
    image: "https://via.placeholder.com/80",
  },
  {
    id: "5",
    categoryId: "4",
    name: "Product 5",
    image: "https://via.placeholder.com/80",
  },
  {
    id: "6",
    categoryId: "5",
    name: "Product 6",
    image: "https://via.placeholder.com/80",
  },
  {
    id: "7",
    categoryId: "6",
    name: "Product 7",
    image: "https://via.placeholder.com/80",
  },
  {
    id: "8",
    categoryId: "7",
    name: "Product 8",
    image: "https://via.placeholder.com/80",
  },
  {
    id: "9",
    categoryId: "8",
    name: "Product 9",
    image: "https://via.placeholder.com/80",
  },
  {
    id: "10",
    categoryId: "9",
    name: "Product 10",
    image: "https://via.placeholder.com/80",
  },
  {
    id: "11",
    categoryId: "10",
    name: "Product 11",
    image: "https://via.placeholder.com/80",
  },
  {
    id: "12",
    categoryId: "11",
    name: "Product 12",
    image: "https://via.placeholder.com/80",
  },
  {
    id: "13",
    categoryId: "12",
    name: "Product 13",
    image: "https://via.placeholder.com/80",
  },
  {
    id: "14",
    categoryId: "13",
    name: "Product 14",
    image: "https://via.placeholder.com/80",
  },
  {
    id: "15",
    categoryId: "14",
    name: "Product 15",
    image: "https://via.placeholder.com/80",
  },
];

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Filter products based on selected category
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.categoryId === selectedCategory)
    : products;

  return (
    <View>
      <Header />
      <View style={styles.container}>
        {/* Left Container (Categories List) */}
        <View style={styles.leftContainer}>
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  selectedCategory === item.id && styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory(item.id)}
              >
                <Image
                  source={{ uri: item.icon }}
                  style={styles.categoryIcon}
                />
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        {/* Right Container (Products List) */}
        <View style={styles.rightContainer}>
          <FlatList
            data={filteredProducts}
            numColumns={2}
            renderItem={({ item }) => (
              <View style={styles.productItem}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.productImage}
                />
                <Text style={styles.productName}>{item.name}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // marginTop: StatusBar.currentHeight || 0,
  },
  leftContainer: {
    flex: 2,
    padding: 10,
    backgroundColor: "#f4f4f4",
  },
  rightContainer: {
    flex: 5,
    padding: 10,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  categoryItem: {
    alignItems: "center",
    padding: 5,
    marginBottom: 10,
    backgroundColor: "transparent",
    borderRadius: 8,
  },
  selectedCategory: {
    borderLeftWidth: 5,
    borderLeftColor: "#0d9b1e",
  },
  categoryIcon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  productItem: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 15,
    // borderBottomWidth: 1,
    // borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 15,
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    color: "#333",
  },
});

export default Categories;
