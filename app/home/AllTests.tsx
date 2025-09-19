import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import TestSearchHeader, { TabKey } from "./TestSearchHeader";
import { styles } from "../../styles/alltest/AllTests.styles";
import { fetchAllTests, AllTest, Pagination, formatPrice, calculateDiscountedPrice } from "../../services/testsService";
import { BRAND_GREEN } from "../../constants/Colors";
import { cartService } from "../../services/cartService";

const AllTests = () => {
  const router = useRouter();
  const [city, setCity] = useState("Islamabad");
  const [activeTab, setActiveTab] = useState<TabKey>("all-tests");
  const [search, setSearch] = useState("");
  const [tests, setTests] = useState<AllTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookedTests, setBookedTests] = useState<number[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);

  const getTypeForTab = (tab: TabKey): string => {
    switch (tab) {
      case "all-tests":
        return "all";
      case "blood-tests":
        return "general";
      case "radiology":
        return "radiology";
      case "all-packages":
        return "all"; // Will be filtered client-side anyway
      default:
        return "all";
    }
  };

  const loadTests = async (page: number = 1, showLoader: boolean = true) => {
    try {
      if (showLoader) setLoading(true);

      const response = await fetchAllTests({
        page,
        limit: 20,
        type: getTypeForTab(activeTab)
      });

      if (response.success) {
        if (page === 1) {
          setTests(response.data);
        } else {
          setTests(prev => [...prev, ...response.data]);
        }
        setPagination(response.pagination);
        setCurrentPage(page);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset page to 1 and clear tests when switching tabs
    setCurrentPage(1);
    setTests([]);
    setPagination(null);
    loadTests(1);
  }, [activeTab]);

  // Load booked tests and cart count when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadBookedTests();
      loadCartCount();
    }, [])
  );

  // Setup cart change listener for real-time updates
  useEffect(() => {
    const updateCartData = () => {
      loadBookedTests();
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

  const loadBookedTests = async () => {
    try {
      const bookedIds = await cartService.getBookedTestIds();
      setBookedTests(bookedIds);
    } catch (error) {
      console.error('Error loading booked tests:', error);
    }
  };

  const loadCartCount = async () => {
    try {
      const count = await cartService.getCartCount();
      setCartCount(count);
    } catch (error) {
      console.error('Error loading cart count:', error);
      setCartCount(0);
    }
  };

  const handleBookPress = async (test: AllTest) => {
    try {
      const originalPrice = formatPrice(test.price);
      const discountPercent = test.discount_percentage || 20;
      const discountedPrice = calculateDiscountedPrice(test.price, discountPercent);
      const badges = [`${discountPercent}% off`];

      const success = await cartService.toggleBooking(test, originalPrice, discountedPrice, badges);

      if (success) {
        // Reload booked test IDs to update UI
        const updatedBookedIds = await cartService.getBookedTestIds();
        setBookedTests(updatedBookedIds);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const handleLoadMore = () => {
    if (pagination?.has_next && !loading && !loadingMore) {
      setLoadingMore(true);
      loadTests(currentPage + 1, false).finally(() => {
        setLoadingMore(false);
      });
    }
  };

  const filteredTests = tests.filter(test => {
    // Apply search filter
    const matchesSearch = test.name.toLowerCase().includes(search.toLowerCase()) ||
      test.code.toLowerCase().includes(search.toLowerCase());

    // For packages tab, show no results (since we don't have packages)
    if (activeTab === "all-packages") {
      return false;
    }

    return matchesSearch;
  });

  const renderFooter = () => {
    if (!pagination?.has_next) return null;

    return (
      <View style={styles.loadMoreContainer}>
        <ActivityIndicator size="small" color={BRAND_GREEN} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <TestSearchHeader
        selectedCity={city}
        onBack={() => router.back()}
        onCityPress={() => {}}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        search={search}
        onSearchChange={setSearch}
      />

      {loading && currentPage === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading tests...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTests}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          renderItem={({ item }) => {
            const isBooked = bookedTests.includes(item.id);
            const discountPercent = item.discount_percentage || 20; // Use API discount or default to 20%
            const discountedPrice = item.price * (1 - discountPercent / 100);

            return (
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{item.name}</Text>
                  <Text style={styles.category}>{item.category}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.originalPrice}>Rs {item.price.toLocaleString()}</Text>
                    <Text style={styles.discountedPrice}>Rs {Math.round(discountedPrice).toLocaleString()}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.bookBtn, isBooked && styles.cancelBtn]}
                  onPress={() => handleBookPress(item)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.bookText, isBooked && styles.cancelText]}>
                    {isBooked ? 'Cancel' : 'Book'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      {pagination && (
        <View style={styles.paginationInfo}>
          <Text style={styles.paginationText}>
            Page {pagination.current_page} of {pagination.total_pages}
            ({pagination.total} total tests)
          </Text>
        </View>
      )}

      {/* Proceed Button - Shows when cart has items */}
      {cartCount > 0 && (
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
      )}
    </View>
  );
};

export default AllTests;
