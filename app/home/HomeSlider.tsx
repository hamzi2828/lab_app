import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import Swiper from "react-native-swiper";
const HomeSlider = () => {
  // No routing needed for banners

  return (
    <View style={styles.sliderContainer}>
      <Swiper
        autoplay
        autoplayTimeout={5}
        showsPagination
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
        paginationStyle={styles.paginationStyle} // Custom position for dots
      >
        {/* Slide 1 */}
        <View style={styles.slide}>
          <Image
            source={require("../../assets/images/homesliderimg1.jpeg")}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Slide 2 */}
        <View style={styles.slide}>
          <Image
            source={require("../../assets/images/homesliderimg2.jpeg")}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    width: "100%",
    height: 200,
    marginTop: 0,
    padding: 16,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  dotStyle: {
    backgroundColor: "#ccc",
  },
  activeDotStyle: {
    backgroundColor: "#0d9b1e",
  },
  paginationStyle: {
    bottom: -15,
  },
});

export default HomeSlider;
