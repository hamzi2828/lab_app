import React, { useState, useEffect } from "react";
import { Text, FlatList, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
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

  // Refresh tests and booking status every time the home screen is focused
  useFocusEffect(
    React.useCallback(() => {
      console.log('Home screen focused - refreshing tests and booking status');
      loadTests();
    }, [])
  );

  const loadTests = async () => {
    try {
      setLoading(true);
      const response = await fetchAppHomeTests(6); // Limit to 6 tests

      if (response.success) {
        setTests(response.data);
        setUsingFallback(false);
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
        image={getTestImage(item)}
        originalPrice={formatPrice(item.price)}
        discountedPrice={calculateDiscountedPrice(item.price, 20)}
        badges={[discount]}
        onPress={() => console.log("Test selected:", item.name)}
        onBookPress={() => console.log("Book test:", item.name)}
        testId={typeof item.id === 'string' ? parseInt(item.id, 10) : item.id}
        testData={item}
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
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ProductHome;
