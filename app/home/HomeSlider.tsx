import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import Swiper from "react-native-swiper";
import { useRouter } from "expo-router";

const HomeSlider = () => {
  const router = useRouter();

  const handleSlideClick = (targetRoute) => {
    router.push(targetRoute); // Navigate to the desired route
  };

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
        <TouchableOpacity
          style={styles.slide}
          onPress={() => handleSlideClick("/home/Product1")}
        >
          <Image
            source={require("../../assets/images/homesliderimg1.jpeg")}
            style={styles.image}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* Slide 2 */}
        <TouchableOpacity
          style={styles.slide}
          onPress={() => handleSlideClick("/home/NewArrivals")}
        >
          <Image
            source={require("../../assets/images/homesliderimg2.jpeg")}
            style={styles.image}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    width: "100%",
    height: 200,
    marginTop: 20,
    padding: 16,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
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
