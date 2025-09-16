import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import { BRAND_GREEN } from "../constants/Colors";


export type ProductCardProps = {
  title: string;
  image: ImageSourcePropType;
  originalPrice: string;
  discountedPrice: string;
  badges: string[];
  onPress: () => void;
  onBookPress?: () => void;
  testId: number;
  testData?: any; // Full test object for storage
};

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  image,
  originalPrice,
  discountedPrice,
  badges,
  onPress,
  onBookPress,
  testId,
  testData,
}) => {
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    checkBookingStatus();
  }, [testId]);

  const checkBookingStatus = async () => {
    try {
      const bookedTests = await AsyncStorage.getItem('bookedTestsDetails');
      if (bookedTests) {
        const bookedTestsArray = JSON.parse(bookedTests);
        setIsBooked(bookedTestsArray.some((test: any) => test.id === testId));
      }
    } catch (error) {
      console.error('Error checking booking status:', error);
    }
  };

  const handleBookPress = async () => {
    try {
      const bookedTests = await AsyncStorage.getItem('bookedTestsDetails');
      let bookedTestsArray = bookedTests ? JSON.parse(bookedTests) : [];

      if (isBooked) {
        // Cancel booking - remove from array
        bookedTestsArray = bookedTestsArray.filter((test: any) => test.id !== testId);
        setIsBooked(false);
      } else {
        // Book test - add complete test details to array
        if (testData && !bookedTestsArray.some((test: any) => test.id === testId)) {
          const testToAdd = {
            ...testData,
            originalPrice,
            discountedPrice,
            badges
          };
          bookedTestsArray.push(testToAdd);
        }
        setIsBooked(true);
      }

      await AsyncStorage.setItem('bookedTestsDetails', JSON.stringify(bookedTestsArray));

      if (onBookPress) {
        onBookPress();
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.badgeContainer}>
        {badges?.map((badge, index) => (
          <View key={index} style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ))}
      </View>

      <Image source={image} style={styles.productImage} />

      <View>
        <Text style={styles.productTitle} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.cardBottom}>
          <View style={styles.priceRow}>
            <Text style={styles.originalPrice}>{originalPrice}</Text>
            <Text style={styles.discountedPrice}>{discountedPrice}</Text>
          </View>
          <TouchableOpacity
            style={[styles.bookNowButton, isBooked && styles.cancelButton]}
            onPress={handleBookPress}
            activeOpacity={0.8}
          >
            <Text style={[styles.bookNowText, isBooked && styles.cancelText]}>
              {isBooked ? 'Cancel' : 'Book Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 10,
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
    lineHeight: 18,
    height: 36, // reserve exactly two lines
    textAlign: "center",
    marginBottom: 2,
  },
  cardBottom: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    alignSelf: "center",
  },
  originalPrice: {
    fontSize: 12,
    color: "gray",
    textDecorationLine: "line-through",
  },
  discountedPrice: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 6,
    },
  bookNowButton: {
    marginTop: 8,
    alignSelf: "stretch",
    height: 34,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: BRAND_GREEN,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  bookNowText: {
    color: BRAND_GREEN,
    fontSize: 13,
    fontWeight: "700",
  },
  cancelButton: {
    backgroundColor: BRAND_GREEN,
    borderColor: BRAND_GREEN,
  },
  cancelText: {
    color: "#fff",
  },
  rating: {
    fontSize: 14,
    color: "orange",
  },
});

export default ProductCard;
