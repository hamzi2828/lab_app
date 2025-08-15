import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Filters = () => {
  const [priceRange, setPriceRange] = useState([78, 178]);
  const [discountRange, setDiscountRange] = useState([0, 100]);
  const [condition, setCondition] = useState({
    Refurbished: false,
    New: true,
    Used: false,
  });
  const [ratings, setRatings] = useState({
    5: false,
    4: false,
    3: false,
    2: false,
    1: false,
  });
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              console.warn("No previous screen to go back to");
            }
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filters</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Price Range Section */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Price Range</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>£{priceRange[0]}</Text>
          <Slider
            style={styles.slider}
            minimumValue={78}
            maximumValue={178}
            step={1}
            minimumTrackTintColor="green"
            maximumTrackTintColor="#ddd"
            thumbTintColor="green"
            value={priceRange[0]}
            onValueChange={(value) => setPriceRange([value, priceRange[1]])}
          />
          <Text style={styles.sliderLabel}>£{priceRange[1]}</Text>
        </View>
      </View>

      {/* Discount Section */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Discount</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>{discountRange[0]}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            minimumTrackTintColor="green"
            maximumTrackTintColor="#ddd"
            thumbTintColor="green"
            value={discountRange[0]}
            onValueChange={(value) =>
              setDiscountRange([value, discountRange[1]])
            }
          />
          <Text style={styles.sliderLabel}>{discountRange[1]}%</Text>
        </View>
      </View>

      {/* Condition Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Condition</Text>
        {["Refurbished", "New", "Used"].map((item) => (
          <TouchableOpacity
            key={item}
            style={styles.checkboxContainer}
            onPress={() =>
              setCondition((prev) => ({ ...prev, [item]: !prev[item] }))
            }
          >
            <View
              style={[
                styles.customCheckbox,
                { backgroundColor: condition[item] ? "green" : "white" },
              ]}
            />
            <Text style={styles.checkboxLabel}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Ratings Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Ratings</Text>
        {[5, 4, 3, 2, 1].map((star) => (
          <TouchableOpacity
            key={star}
            style={styles.ratingContainer}
            onPress={() =>
              setRatings((prev) => ({ ...prev, [star]: !prev[star] }))
            }
          >
            <View
              style={[
                styles.customCheckbox,
                { backgroundColor: ratings[star] ? "green" : "white" },
              ]}
            />
            <View style={styles.starsContainer}>
              {Array.from({ length: star }, (_, index) => (
                <FontAwesome
                  key={index}
                  name="star"
                  size={20}
                  color="gold"
                  style={{ marginHorizontal: 1 }}
                />
              ))}
              {Array.from({ length: 5 - star }, (_, index) => (
                <FontAwesome
                  key={index}
                  name="star-o"
                  size={20}
                  color="grey"
                  style={{ marginHorizontal: 1 }}
                />
              ))}
            </View>
            <Text style={styles.checkboxLabel}>({star} Stars)</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonRow}>
        {/* Reset Filters Button */}
        <TouchableOpacity
          style={[styles.resetButton, styles.button]}
          onPress={() => {
            setPriceRange([78, 178]);
            setDiscountRange([0, 100]);
            setCondition({ Refurbished: false, New: true, Used: false });
            setRatings({ 5: false, 4: false, 3: false, 2: false, 1: false });
          }}
        >
          <Text style={styles.resetButtonText}>Reset Filters</Text>
        </TouchableOpacity>

        {/* Apply Filters Button */}
        <TouchableOpacity
          style={[styles.applyButton, styles.button]}
          onPress={() => {
            console.log("Applied Filters:", {
              priceRange,
              discountRange,
              condition,
              ratings,
            });
          }}
        >
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
    zIndex: 1,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginTop: StatusBar.currentHeight || 0,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 12,
  },
  placeholder: {
    width: 24,
  },
  filterSection: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  slider: {
    flex: 1,
    marginHorizontal: 8,
  },
  sliderLabel: {
    fontSize: 14,
    color: "black",
    width: 40,
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  customCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  starsContainer: {
    flexDirection: "row",
    marginLeft: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  resetButton: {
    padding: 12,
    backgroundColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: 14,
    color: "black",
  },
  applyButton: {
    padding: 12,
    backgroundColor: "green",
    borderRadius: 8,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default Filters;
