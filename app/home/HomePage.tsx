import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import Header from "../common/Header";
import HomeSlider from "./HomeSlider";
import DealOfTheDay from "./DealOfTheDay";
import ProductCardHome from "../../components/ProductHome";
import QuickActions from "../../components/QuickActions";

const HomePage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();

  const handleSeeAll = () => {
    router.push("/home/AllProducts");
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
            <Text style={styles.headerText}>Tests </Text>
          </View>
          <ProductCardHome />
        </View>
      ),
    },
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
});

export default HomePage;
