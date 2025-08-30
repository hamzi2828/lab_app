import React from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { useRouter } from "expo-router";

const categories = [
  { id: "1", name: "Samsung", image: require("../../assets/images/icon.png") },
  {
    id: "2",
    name: "Infinix",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "3",
    name: "Xiomi",
    image: require("../../assets/images/mainlogo.jpg"),
  },
  { id: "4", name: "Pixel", image: require("../../assets/images/splash.png") },
  {
    id: "5",
    name: "Pixel 2",
    image: require("../../assets/images/splash.png"),
  },
];

const CategoryList = () => {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} />
      </View>
      <Text style={styles.label}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        contentContainerStyle={styles.listContainer}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 26,
    paddingBottom: 26,
    backgroundColor: "#fff",
  },
  listContainer: {
    paddingHorizontal: 5,
  },
  itemContainer: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
});

export default CategoryList;
