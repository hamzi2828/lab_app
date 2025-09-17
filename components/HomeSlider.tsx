import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Image, ActivityIndicator } from "react-native";
import Swiper from "react-native-swiper";
import { fetchAppHomeAssets, Banner, AppAssets } from "../services/assetsService";
import { useFocusEffect } from "@react-navigation/native";


const HomeSlider = () => {
  const [assets, setAssets] = useState<AppAssets | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeAssets();
  }, []);

  // Refresh tests and booking status every time the home screen is focused
  useFocusEffect(
    React.useCallback(() => {
      console.log('Home screen focused - refreshing tests and booking status');
      loadHomeAssets();
    }, [])
  );

  const loadHomeAssets = async (forceRefresh: boolean = false) => {
    try {
      setLoading(true);
      const response = await fetchAppHomeAssets(forceRefresh);

      if (response.success) {
        setAssets(response.data);
      }
    } catch (err: any) {
      console.error('Unexpected error in loadHomeAssets:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.sliderContainer, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0d9b1e" />
      </View>
    );
  }

  if (!assets?.banners || assets.banners.length === 0) {
    return null;
  }

  return (
    <View style={styles.sliderContainer}>
      <Swiper
        autoplay
        autoplayTimeout={5000}
        showsPagination
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
        paginationStyle={styles.paginationStyle}
        loop
      >
        {assets.banners.map((banner) => (
          <View key={banner.id} style={styles.slide}>
            <Image
              source={{ uri: banner.image_url }}
              style={styles.image}
              resizeMode="cover"
              onError={(e) => {
                console.log('Failed to load banner:', banner.image_url, e.nativeEvent.error);
              }}
            />
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    width: "100%",
    height: 200,
    marginTop: 0,
    padding: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  dotStyle: {
    backgroundColor: "#ccc",
  },
  activeDotStyle: {
    backgroundColor: "#0d9b1e",
  },
  paginationStyle: {
    bottom: -15,
  },
});

export default HomeSlider;
