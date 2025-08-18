import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { BRAND_GREEN } from "../../constants/Colors";
import TestSearchHeader, { TabKey } from "../../components/TestSearchHeader";

const mockData = Array.from({ length: 20 }).map((_, i) => ({
  id: String(i + 1),
  title: `Test ${i + 1}`,
  price: `${(i + 1) * 1000} PKR`,
}));

const AllTests = () => {
  const router = useRouter();
  const [city, setCity] = useState("Islamabad");
  const [activeTab, setActiveTab] = useState<TabKey>("packages");
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      mockData.filter((x) =>
        x.title.toLowerCase().includes(search.trim().toLowerCase())
      ),
    [search]
  );

  return (
    <View style={styles.container}>
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
              onPress={() => router.push({ pathname: "/home/ProductDetail", params: item })}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },
  price: {
    marginTop: 4,
    fontSize: 12,
    color: BRAND_GREEN,
    fontWeight: "700",
  },
  bookBtn: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: BRAND_GREEN,
    justifyContent: "center",
    alignItems: "center",
  },
  bookText: {
    color: BRAND_GREEN,
    fontSize: 12,
    fontWeight: "700",
  },
});

export default AllTests;
