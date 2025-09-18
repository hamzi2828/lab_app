import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import HomePage from "../home/HomePageScreen";
import Profile from "../profile/Profile";
import Categories from "../categories/Categories";
import Cart from "../cart/Cart";
import AllTests from "../home/AllTests";
import { cartService } from "../../services/cartService";

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
  refreshCartCount?: boolean; // Add this to trigger cart count refresh
}

const AppNavigator = ({ isLoginScreen = false, onTabPress, refreshCartCount }: AppNavigatorProps = {}) => {
  const router = useRouter();
  const [cartCount, setCartCount] = useState<number>(0);

  // Load cart count on component mount and setup listener
  useEffect(() => {
    loadCartCount();

    // Create a wrapper function for the cart change listener
    const handleCartChange = () => {
      loadCartCount();
    };

    // Add listener for real-time cart updates
    cartService.addCartChangeListener(handleCartChange);

    // Cleanup listener on unmount
    return () => {
      cartService.removeCartChangeListener(handleCartChange);
    };
  }, []);

  // Refresh cart count when refreshCartCount prop changes
  useEffect(() => {
    if (refreshCartCount !== undefined) {
      loadCartCount();
    }
  }, [refreshCartCount]);

  // Refresh cart count when the navigator is focused
  useFocusEffect(
    React.useCallback(() => {
      loadCartCount();
    }, [])
  );

  const loadCartCount = async () => {
    try {
      const count = await cartService.getCartCount();
      setCartCount(count);
    } catch (error) {
      console.error('Error loading cart count:', error);
      setCartCount(0);
    }
  };

  const handleTabPress = (routeName: string) => {
    if (isLoginScreen && onTabPress) {
      onTabPress(routeName);
    }
  };

  // Cart Badge Component
  const CartIconWithBadge = ({ focused, color, size }: TabBarIconProps) => {
    const iconName: IconName = focused ? "cart" : "cart-outline";
    const iconColor = isLoginScreen ? "black" : color;

    return (
      <View style={{ position: 'relative' }}>
        <Ionicons name={iconName} size={size} color={iconColor} />
        {cartCount > 0 && (
          <View style={{
            position: 'absolute',
            top: -12,
            right: -8,
            backgroundColor: '#28a745',
            borderRadius: 10,
            minWidth: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
            <Text style={{
              color: 'white',
              fontSize: cartCount > 99 ? 8 : 10,
              fontWeight: '700',
              textAlign: 'center',
              includeFontPadding: false,
            }}>
              {cartCount > 99 ? '99+' : cartCount}
            </Text>
          </View>
        )}
      </View>
    );
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
            // Use custom cart icon with badge
            return <CartIconWithBadge focused={isFocused} color={color} size={size} />;
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
