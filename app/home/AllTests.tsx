import React, { useMemo, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import TestSearchHeader, { TabKey } from "./TestSearchHeader";
import { styles } from "../../styles/alltest/AllTests.styles";

const categories: TabKey[] = ["general", "packages", "diseases"]; // "all" is computed
const mockData = Array.from({ length: 20 }).map((_, i) => ({
  id: String(i + 1),
  title: `Test ${i + 1}`,
  price: `${(i + 1) * 1000} Rs`,
  category: categories[i % categories.length] as Exclude<TabKey, "all">,
}));

const AllTests = () => {
  const router = useRouter();
  const [city, setCity] = useState("Islamabad");
  const [activeTab, setActiveTab] = useState<TabKey>("packages");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mockData.filter((x: any) => {
      const matchesSearch = x.title.toLowerCase().includes(q);
      const matchesTab = activeTab === "all" ? true : x.category === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [search, activeTab]);

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
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
            <TouchableOpacity
              style={styles.bookBtn}
              onPress={() => console.log("ProductDetail removed - TODO: Add new navigation")}
              activeOpacity={0.8}
            >
              <Text style={styles.bookText}>Book</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default AllTests;
