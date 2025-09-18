import React from "react";
import { TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { useRouter } from "expo-router";

import HomePage from "../home/HomePageScreen";
import Profile from "../profile/Profile";
import Categories from "../categories/Categories";
import Cart from "../cart/Cart";
import AllTests from "../home/AllTests";

type RootParamList = {
  Home: undefined;
  "Lab Tests": undefined;
  Locations: undefined;
  Cart: undefined;
  Profile: undefined;
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

interface AppNavigatorProps {
  isLoginScreen?: boolean;
  onTabPress?: (routeName: string) => void;
}

const AppNavigator = ({ isLoginScreen = false, onTabPress }: AppNavigatorProps = {}) => {
  const router = useRouter();

  const handleTabPress = (routeName: string) => {
    if (isLoginScreen && onTabPress) {
      onTabPress(routeName);
    }
  };

  return (
    <Tab.Navigator
      initialRouteName={isLoginScreen ? undefined : "Home"}
      screenOptions={({
        route,
      }: {
        route: RouteProp<RootParamList, keyof RootParamList>;
      }) => ({
        tabBarIcon: ({ focused, color, size }: TabBarIconProps) => {
          let iconName: IconName;

          // Force unfocused state when in login screen
          const isFocused = isLoginScreen ? false : focused;

          if (route.name === "Home") {
            iconName = isFocused ? "home" : "home-outline";
          } else if (route.name === "Lab Tests") {
            iconName = isFocused ? "grid" : "grid-outline";
          } else if (route.name === "Locations") {
            iconName = isFocused ? "navigate" : "navigate-outline";
          } else if (route.name === "Cart") {
            iconName = isFocused ? "cart" : "cart-outline";
          } else if (route.name === "Profile") {
            iconName = isFocused ? "person" : "person-outline";
          } else {
            iconName = "home";
          }

          // Use inactive color when in login screen
          const iconColor = isLoginScreen ? "black" : color;
          return <Ionicons name={iconName} size={size} color={iconColor} />;
        },
        tabBarActiveTintColor: isLoginScreen ? "transparent" : "#0d9b1e",
        tabBarInactiveTintColor: "black",
        headerShown: false,
        tabBarLabelStyle: {
          color: "black",
        },
        tabBarStyle: {
          width: "100%",
          alignItems: "center",
          paddingVertical: 5,
          backgroundColor: "white",
          elevation: 5,
        },
        tabBarButton: isLoginScreen ? (props) => {
          // Filter out problematic props and handle null values
          const { delayLongPress, disabled, ...safeProps } = props;
          return (
            <TouchableOpacity
              {...safeProps}
              delayLongPress={delayLongPress ?? undefined}
              disabled={disabled ?? undefined}
              onPress={() => handleTabPress(route.name)}
              style={props.style}
            />
          );
        } : undefined,
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Lab Tests" component={AllTests} />
      <Tab.Screen name="Locations" component={AllTests} />
      <Tab.Screen name="Cart" component={Cart} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
