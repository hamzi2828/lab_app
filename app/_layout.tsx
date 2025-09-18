import { Stack } from "expo-router";
import AppNavigator from "./appnavigator/AppNavigator";
export default function RootLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName="auth/LoginScreen"
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/LoginScreen" />
      <Stack.Screen name="auth/ForgotPasswordScreen" />
      <Stack.Screen name="auth/SignupScreen" />
      <Stack.Screen name="home/HomePageScreen" />
      <Stack.Screen name="common/Notifications" />
      <Stack.Screen name="common/Filters" />
      <Stack.Screen name="cart/Cart" />
      <Stack.Screen name="cart/BookingScreen" />
      <Stack.Screen name="cart/BookingSummaryPage" />
      {/* Profile Screens */}
      <Stack.Screen name="profile/Profile" />
      <Stack.Screen name="profile/Address" />
      <Stack.Screen name="profile/EditAddress" />
      <Stack.Screen name="profile/PreviousBookings" />
      <Stack.Screen name="profile/BookingDetails" />
      <Stack.Screen name="likes/Likes" />
      <Stack.Screen name="orders/DeliveredOrders" />
      <Stack.Screen name="orders/ReturnedOrders" />
      <Stack.Screen name="orders/InProgressOrders" />
      <Stack.Screen name="home/AllTests" />
    </Stack>
  );
}
