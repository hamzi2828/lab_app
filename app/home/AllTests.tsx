import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import TestSearchHeader, { TabKey } from "./TestSearchHeader";
import { styles } from "../../styles/alltest/AllTests.styles";
import { fetchAllTests, AllTest, Pagination } from "../../services/testsService";
import { BRAND_GREEN } from "../../constants/Colors";

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

  const getTypeForTab = (tab: TabKey): string => {
    switch (tab) {
      case "all-tests":
        return "all";
      case "blood-tests":
        return "general";
      case "radiology":
        return "pathology";
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
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.code}>{item.code}</Text>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.price}>Rs {item.price.toLocaleString()}</Text>
              </View>
              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() => console.log("Book test:", item.name)}
                activeOpacity={0.8}
              >
                <Text style={styles.bookText}>Book</Text>
              </TouchableOpacity>
            </View>
          )}
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
    </View>
  );
};

export default AllTests;
