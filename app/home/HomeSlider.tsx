import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Image, ActivityIndicator } from "react-native";
import Swiper from "react-native-swiper";
import { fetchAppHomeAssets } from "../../services/testsService";
import { useFocusEffect } from "@react-navigation/native";

interface Banner {
  id: number;
  banner_number: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

interface AppAssets {
  logo: {
    logo_url: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
  banners: Banner[];
}

const HomeSlider = () => {
  const [assets, setAssets] = useState<AppAssets | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

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

  const loadHomeAssets = async () => {
    try {
      setLoading(true);
      const response = await fetchAppHomeAssets();

      if (response.success) {
        setAssets(response.data);
        setUsingFallback(false);
      }
    } catch (err: any) {
      console.error('Unexpected error in loadHomeAssets:', err);
      // This should not happen since the service handles all errors
    } finally {
      setLoading(false);
    }
  };

  // Fallback to local images if no banners are available from API
  const fallbackBanners = [
    require("../../assets/images/homesliderimg1.jpg"),
    require("../../assets/images/homesliderimg2.jpg")
  ];

  if (loading) {
    return (
      <View style={[styles.sliderContainer, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0d9b1e" />
      </View>
    );
  }

  // Use API banners if available, otherwise use fallback
  const bannersToShow = (assets?.banners && assets.banners.length > 0)
    ? assets.banners 
    : fallbackBanners.map((_, index) => ({
        id: index,
        image_url: '',
        banner_number: index,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isFallback: true
      } as Banner));

  return (
    <View style={styles.sliderContainer}>
      <Swiper
        autoplay
        autoplayTimeout={5000} // 5 seconds
        showsPagination
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
        paginationStyle={styles.paginationStyle}
        loop
      >
        {bannersToShow.map((banner) => (
          <View key={banner.id} style={styles.slide}>
            <Image
              source={
                banner.image_url 
                  ? { uri: banner.image_url } 
                  : fallbackBanners[banner.id % fallbackBanners.length]
              }
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
