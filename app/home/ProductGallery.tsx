import React, { useState } from "react";
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const productData = [
  { id: "1", image: require("../../assets/images/iphone.png") },
  { id: "2", image: require("../../assets/images/samsung.png") },
  { id: "3", image: require("../../assets/images/iphone.png") },
  { id: "4", image: require("../../assets/images/samsung.png") },
  { id: "5", image: require("../../assets/images/samsung.png") },
  { id: "6", image: require("../../assets/images/iphone.png") },
];

const ProductGallery = () => {
  const [selectedImage, setSelectedImage] = useState(productData[0].image); // Default to the first image
  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      {/* Main Image Display */}
      <View style={styles.mainImageContainer}>
        <Image
          source={selectedImage}
          style={[styles.mainImage, { width: screenWidth }]}
        />
      </View>

      {/* Thumbnail List */}
      <FlatList
        data={productData}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.thumbnailList}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedImage(item.image)}>
            <Image source={item.image} style={styles.thumbnail} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    justifyContent: "center",
  },
  mainImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  mainImage: {
    height: 280,
    resizeMode: "contain", // Ensures the image fits without cropping
  },
  thumbnailList: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  thumbnail: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#ddd",
  },
});

export default ProductGallery;
