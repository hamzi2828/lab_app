import React, { useState, useEffect } from "react";
import { Text, FlatList, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { BRAND_GREEN } from "../constants/Colors";
import ProductCard from "./ProductCard";
import {
  fetchAppHomeTests,
  Test,
  formatPrice,
  calculateDiscountedPrice,
  calculateDiscount,
  getTestImage
} from "../services/testsService";
import { styles } from "../styles/components/ProductHome.styles";

const ProductHome = () => {
  const router = useRouter();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      const response = await fetchAppHomeTests(6); // Limit to 6 tests

      if (response.success) {
        setTests(response.data);
        setUsingFallback(response.usingFallback || false);
      }
    } catch (err: any) {
      console.error('Unexpected error in loadTests:', err);
      // This should not happen since the service handles all errors
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Test }) => {
    const discountedPrice = item.price * 0.8; // 20% discount
    const discount = calculateDiscount(item.price, discountedPrice);

    return (
      <ProductCard
        title={item.name}
        image={getTestImage(item, usingFallback)}
        originalPrice={formatPrice(item.price)}
        discountedPrice={calculateDiscountedPrice(item.price, 20)}
        badges={[discount]}
        onPress={() => console.log("Test selected:", item.name)}
        onBookPress={() => console.log("Book test:", item.name)}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={BRAND_GREEN} />
        <Text style={styles.loadingText}>Loading tests...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tests}
      renderItem={renderItem}
      keyExtractor={(item: Test) => item.id.toString()}
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

export default ProductHome;
