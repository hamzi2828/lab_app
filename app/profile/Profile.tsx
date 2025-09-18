import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Make sure to install @expo/vector-icons
import { useRouter } from "expo-router";
import { styles } from "../../styles/profile/Profile.styles";
import { getUserData, isUserLoggedIn, logoutUser } from "../../services/loginValidation";
import { clearAllAsyncStorage } from "../../services/assetsService";

const Profile = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLoginStatusAndFetchUserData();
  }, []);

  const checkLoginStatusAndFetchUserData = async () => {
    try {
      const loggedIn = await isUserLoggedIn();
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        const data = await getUserData();
        setUserData(data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await logoutUser();
              setIsLoggedIn(false);
              setUserData(null);
              router.replace("/auth/LoginScreen");
            } catch (error) {
              console.error("Error during logout:", error);
              Alert.alert("Error", "Failed to sign out. Please try again.");
            }
          }
        }
      ]
    );
  };

  const handleClearStorage = () => {
    Alert.alert(
      "Clear Storage",
      "Are you sure you want to clear all cached data? This will remove all stored app data.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllAsyncStorage();
              Alert.alert("Success", "Storage cleared successfully!");
            } catch (error) {
              console.error("Error clearing storage:", error);
              Alert.alert("Error", "Failed to clear storage. Please try again.");
            }
          }
        }
      ]
    );
  };
  return (
    <View style={styles.container}>
      {/* Profile Section */}
{isLoggedIn && userData ? (
        <View style={styles.profileSection}>
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{userData.name || "User"}</Text>
            <Text style={styles.email}>{userData.email || "No email"}</Text>
            <Text style={styles.phone}>{userData.phone || "No phone"}</Text>
            <Text style={styles.username}>@{userData.username || "username"}</Text>
          </View>
          <TouchableOpacity>
            <MaterialIcons name="edit" size={24} color="#0d9b1e" />
          </TouchableOpacity>
        </View>
      ) : !loading && (
        <View style={styles.profileSection}>
          <View style={styles.notLoggedInContainer}>
            <Text style={styles.notLoggedInText}>Please sign in to view your profile</Text>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => router.push("/auth/LoginScreen")}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      )} 

      {/* Options */}
      <TouchableOpacity
        style={styles.option}
        onPress={() => router.push("/profile/Address")}
      >
        <Text style={styles.optionText}>Address</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="#777" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.option, !isLoggedIn && styles.disabledOption]}
        onPress={() => isLoggedIn ? router.push("/profile/PreviousBookings") : null}
        disabled={!isLoggedIn}
      >
        <Text style={[styles.optionText, !isLoggedIn && styles.disabledText]}>Previous Bookings</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color={isLoggedIn ? "#777" : "#ccc"} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Help</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="#777" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Support</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="#777" />
      </TouchableOpacity>

      {/* Clear Storage Button */}
      <TouchableOpacity style={styles.option} onPress={handleClearStorage}>
        <Text style={[styles.optionText, { color: '#ff4444' }]}>Clear Storage</Text>
        <MaterialIcons name="delete-outline" size={24} color="#ff4444" />
      </TouchableOpacity>

      {/* Sign Out Button */}
      {isLoggedIn ? (
        <TouchableOpacity style={styles.signOut} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.signOut}
          onPress={() => router.push("/auth/LoginScreen")}
        >
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Profile;
