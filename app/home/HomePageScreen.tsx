import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import Header from "../common/Header";
import HomeSlider from "../../components/HomeSlider";
import DealOfTheDay from "./DealOfTheDay";
import ProductCardHome from "../../components/ProductHome";
import QuickActions from "../../components/QuickActions";
import { cartService } from "../../services/cartService";

const HomePage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const router = useRouter();

  const handleSeeAll = () => {
    router.push("/home/AllTests");
  };

  // Load cart count and setup listener for real-time updates
  useEffect(() => {
    const updateCartData = () => {
      loadCartCount();
    };

    // Add listener for cart changes
    cartService.addCartChangeListener(updateCartData);

    // Initial load
    updateCartData();

    // Cleanup listener on unmount
    return () => {
      cartService.removeCartChangeListener(updateCartData);
    };
  }, []);

  // Load cart count when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadCartCount();
    }, [])
  );

  const loadCartCount = async () => {
    try {
      const count = await cartService.getCartCount();
      setCartCount(count);
    } catch (error) {
      console.error('Error loading cart count:', error);
      setCartCount(0);
    }
  };

  // Data for FlatList
  const sections = [
    { key: "header", component: <Header /> },
    { key: "slider", component: <HomeSlider /> },
    { key: "quickActions", component: <QuickActions /> },

    { key: "dealOfTheDay", component: <DealOfTheDay /> },
    {
      key: "productCards",
      component: (
        <View>
          <View style={styles.header}>
            <Text style={styles.headerText}>Discounted Tests </Text>
          </View>
          <ProductCardHome />
        </View>
      ),
    },
    // Proceed Button Section - Only show when cart has items
    ...(cartCount > 0 ? [{
      key: "proceedButton",
      component: (
        <View style={styles.proceedButtonContainer}>
          <TouchableOpacity
            onPress={() => router.push('/cart/Cart')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#3c5e45', '#0d9b1e']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.proceedButton}
            >
              <Text style={styles.proceedButtonText}>
                Proceed ({cartCount} {cartCount === 1 ? 'test' : 'tests'})
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ),
    }] : []),
  ];

  return (
    <FlatList
      data={sections}
      renderItem={({ item }) => <View>{item.component}</View>}
      keyExtractor={(item) => item.key}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Ensures the content scrolls
    backgroundColor: "#fff",
    paddingBottom: 20, // Add some padding for better scroll experience
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAllText: {
    fontSize: 16,
    color: "gray",
  },
  proceedButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 24,
    backgroundColor: "#fff",
  },
  proceedButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  proceedButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default HomePage;
