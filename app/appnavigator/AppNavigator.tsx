import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";

import HomePage from "../home/HomePage";
import Profile from "../profile/Profile";
import Categories from "../categories/Categories";
import Cart from "../cart/Cart";
import AllProducts from "../home/AllProducts";

type RootParamList = {
  Home: undefined;
  Categories: undefined;
  Cart: undefined;
  Profile: undefined;
  Explore: undefined;
};

const Tab = createBottomTabNavigator<RootParamList>();

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

type IconName =
  | "home"
  | "home-outline"
  | "grid"
  | "grid-outline"
  | "cart"
  | "cart-outline"
  | "person"
  | "person-outline"
  | "navigate"
  | "navigate-outline";

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({
        route,
      }: {
        route: RouteProp<RootParamList, keyof RootParamList>;
      }) => ({
        tabBarIcon: ({ focused, color, size }: TabBarIconProps) => {
          let iconName: IconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Categories") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "Explore") {
            iconName = focused ? "navigate" : "navigate-outline";
          } else if (route.name === "Cart") {
            iconName = focused ? "cart" : "cart-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = "home";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#0d9b1e",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
        tabBarStyle: {
          width: "100%",
          alignItems: "center",
          paddingVertical: 5,
          backgroundColor: "white",
          elevation: 5,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Categories" component={Categories} />
      <Tab.Screen name="Explore" component={AllProducts} />
      <Tab.Screen name="Cart" component={Cart} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
