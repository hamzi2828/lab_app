import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import ProductDetailHeader from "../common/ProductDetailHeader";
import ProductGallery from "./ProductGallery";
import { FontAwesome } from "@expo/vector-icons"; // For star icons
import AccordionList from "./AccordionList";
import RecommendedCard from "./RecommendedCard";

const ProductDetail = () => {
  const params = useLocalSearchParams();
  const {
    title = "Default Title",
    image = null,
    originalPrice = "N/A",
    discountedPrice = "N/A",
    badges = [],
    rating = "Not Rated",
  } = params;
  const router = useRouter();
  const [selectedCondition, setSelectedCondition] = useState("Excellent");
  const [selectedColor, setSelectedColor] = useState("Gold");
  const [activeStorage, setActiveStorage] = useState("128GB");
  const [activeAccessory, setActiveAccessory] = useState("Adopter");

  return (
    <View>
      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProductDetailHeader navigation={undefined} />
        <ProductGallery />

        {/* Product Information Section */}
        <View style={styles.infoContainer}>
          {/* Product Title */}
          <View style={styles.brandContainer}>
            <Image
              source={require("../../assets/images/category_icon.png")}
              style={styles.categoryicon}
            />
            <Text style={styles.brand}>Samsung</Text>
          </View>
          <Text style={styles.title}>
            Samsung S23 Ultra - Unlocked 32GB Black Excellent
          </Text>

          {/* Ratings, Reviews, and Sold Info */}
          <View style={styles.mainrow}>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>5.00 Ratings</Text>
            </View>
            <Text style={styles.infoText}>2.3k Reviews</Text>
            <Text style={styles.infoText}>2.9k+ Sold</Text>
          </View>

          {/* Features/Attributes */}
          <View style={styles.features}>
            <View style={styles.featureRow}>
              <Image
                source={require("../../assets/images/delivery_icon.png")}
                style={styles.icon}
              />
              <Text style={styles.featureText}>
                Free Delivery by 19 Oct - 22 Oct
              </Text>
            </View>
            <View style={styles.featureRow}>
              <Image
                source={require("../../assets/images/verify_icon.png")}
                style={styles.icon}
              />
              <Text style={styles.featureText}>
                Free 30 Days Return{"\n"}
                18 Months Replacement Warranty
              </Text>
            </View>

            <View style={styles.featureRow}>
              <Image
                source={require("../../assets/images/sim_icon.png")}
                style={styles.icon}
              />
              <Text style={styles.featureText}>Dual Sim (Physical + eSIM)</Text>
            </View>
            <View style={styles.featureRow}>
              <Image
                source={require("../../assets/images/Refurbished_icon.png")}
                style={styles.icon}
              />
              <Text style={styles.featureText}>Verified Refurbished</Text>
            </View>
          </View>
        </View>

        {/* Condition and Color Selection Section */}
        <View style={styles.selectionContainer}>
          {/* Condition Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Condition</Text>
              <Text style={styles.link}>See Guide</Text>
            </View>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[
                  styles.option,
                  selectedCondition === "Excellent" && styles.selectedOption,
                ]}
                onPress={() => setSelectedCondition("Excellent")}
              >
                <Text style={styles.optionText}>Excellent</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.oldPrice}>£1000</Text>
                  <Text style={styles.currentPrice}>£719</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.option,
                  selectedCondition === "Good" && styles.selectedOption,
                ]}
                onPress={() => setSelectedCondition("Good")}
              >
                <Text style={styles.optionText}>Good</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.oldPrice}>£1000</Text>
                  <Text style={styles.currentPrice}>£719</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Color Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Color</Text>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[
                  styles.option,
                  selectedColor === "Gold" && styles.selectedOption,
                ]}
                onPress={() => setSelectedColor("Gold")}
              >
                <View style={styles.priceContainer}>
                  <Text style={styles.optionText}>Gold</Text>
                  <View style={styles.colorIndicatorGold}></View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.option,
                  selectedColor === "Silver" && styles.selectedOption,
                ]}
                onPress={() => setSelectedColor("Silver")}
              >
                <View style={styles.priceContainer}>
                  <Text style={styles.optionText}>Silver</Text>
                  <View style={styles.colorIndicatorSilver}></View>
                  {selectedColor === "Silver" && (
                    <Text style={styles.soldOutLabel}>Sold Out</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Storage</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.option,
                  activeStorage === "128GB" && styles.selectedOption,
                ]}
                onPress={() => setActiveStorage("128GB")}
              >
                <Text
                  style={[
                    styles.optionText,
                    activeStorage === "128GB" && styles.activeOptionText,
                  ]}
                >
                  128GB
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.option,
                  activeStorage === "256GB" && styles.selectedOption,
                ]}
                onPress={() => setActiveStorage("256GB")}
              >
                <Text
                  style={[
                    styles.optionText,
                    activeStorage === "256GB" && styles.activeOptionText,
                  ]}
                >
                  256GB
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Comes With Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Comes With</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.option,
                  activeAccessory === "Adopter" && styles.selectedOption,
                ]}
                onPress={() => setActiveAccessory("Adopter")}
              >
                <View style={styles.accessoryRow}>
                  <FontAwesome
                    name="plug"
                    size={16}
                    color={activeAccessory === "Adopter" ? "#34C759" : "#000"}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      activeAccessory === "Adopter" && styles.activeOptionText,
                    ]}
                  >
                    Powerful Adopter
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.option,
                  activeAccessory === "Cable" && styles.selectedOption,
                ]}
                onPress={() => setActiveAccessory("Cable")}
              >
                <View style={styles.accessoryRow}>
                  <FontAwesome
                    name="usb"
                    size={16}
                    color={activeAccessory === "Cable" ? "#34C759" : "#000"}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      activeAccessory === "Cable" && styles.activeOptionText,
                    ]}
                  >
                    Powerful Adopter
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <AccordionList />
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>Recently Viewed</Text>
        </View>
        <RecommendedCard />
        {/* Uncomment and adjust as needed */}
        {/* Other Product Details */}
        {/* {image && (
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.productImage} />
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.originalPrice}>{originalPrice}</Text>
        <Text style={styles.discountedPrice}>{discountedPrice}</Text>
      </View>
      <Text style={styles.rating}>{rating}</Text>
      <View style={styles.badgeContainer}>
        {Array.isArray(badges) &&
          badges.map((badge, index) => (
            <View key={index} style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ))}
      </View> */}
      </ScrollView>

      {/* Fixed Bottom UI */}
      <View style={styles.fixedBottomBar}>
        <Text style={styles.totalPriceText}>Total Price</Text>
        <Text style={styles.price}>£399</Text>
        <TouchableOpacity
          style={styles.buyNowButton}
          onPress={() => router.push("/cart/Cart")} // Navigate to SignupScreen
        >
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  brand: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  mainrow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "space-between",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  ratingText: {
    fontSize: 14,
    color: "#000",
    marginLeft: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginRight: 16,
  },
  features: {
    marginTop: 8,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  categoryicon: {
    width: 15,
    height: 15,
    marginRight: 8,
  },
  icon: {
    width: 45,
    height: 45,
    marginRight: 8,
    borderRadius: 8,
  },
  featureText: {
    fontSize: 14,
    color: "#000",
  },
  selectionContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  link: {
    fontSize: 14,
    color: "green",
    textDecorationLine: "underline",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  option: {
    flex: 1,
    padding: 6,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedOption: {
    borderColor: "green",
    backgroundColor: "#eaffea",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  // priceContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  oldPrice: {
    fontSize: 12,
    color: "#888",
    textDecorationLine: "line-through",
  },
  currentPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "green",
    marginLeft: 8,
  },
  colorIndicatorGold: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "gold",
    marginLeft: 8,
  },
  colorIndicatorSilver: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "silver",
    marginLeft: 8,
  },
  soldOutLabel: {
    position: "absolute",
    top: -13,
    right: -47,
    backgroundColor: "red",
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionBox: {
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
  },
  activeOptionBox: {
    borderColor: "#34C759",
  },
  activeOptionText: {
    color: "#34C759",
  },
  accessoryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  scrollContent: {
    paddingBottom: 60, // Ensure enough space for the fixed bottom bar
  },
  fixedBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // Space between Total Price and Amount
  },

  totalPriceText: {
    fontSize: 16,
    color: "#888",
  },

  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
  },

  buyNowButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#000",
  },

  iconSection: {
    backgroundColor: "green",
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  buyNowText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});

export default ProductDetail;
