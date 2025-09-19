import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, StatusBar } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
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
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Define the type for menu items
  type MenuItem = {
    id: string;
    title: string;
    subtitle: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    color: string;
    onPress: () => void;
    disabled: boolean;
  };

  const menuItems: MenuItem[] = [
    {
      id: 'address',
      title: 'My Addresses',
      subtitle: 'Manage delivery locations',
      icon: 'location-on',
      color: '#2196F3',
      onPress: () => router.push("/profile/Address"),
      disabled: false
    },
    {
      id: 'bookings',
      title: 'Previous Bookings',
      subtitle: 'View your booking history',
      icon: 'history',
      color: '#9C27B0',
      onPress: () => isLoggedIn ? router.push("/profile/PreviousBookings") : undefined,
      disabled: !isLoggedIn
    },
    {
      id: 'help',
      title: 'Help & FAQ',
      subtitle: 'Get answers to common questions',
      icon: 'help-outline',
      color: '#FF9800',
      onPress: () => {},
      disabled: false
    },
    {
      id: 'support',
      title: 'Customer Support',
      subtitle: 'Contact our support team',
      icon: 'contact-support', // Changed from 'support-agent' to 'contact-support'
      color: '#4CAF50',
      onPress: () => {},
      disabled: false
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d9b1e" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerBackground} />
          <View style={styles.headerContent}>
          
          </View>
        </View>

        {/* Profile Card */}
        {isLoggedIn && userData ? (
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {getInitials(userData.name || "User")}
                </Text>
              </View>
              <TouchableOpacity style={styles.editAvatarButton}>
                <MaterialIcons name="camera-alt" size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userData.name || "User"}</Text>
              <Text style={styles.userEmail}>{userData.email || "No email"}</Text>
              <View style={styles.userDetailsRow}>
                <View style={styles.userDetail}>
                  <MaterialIcons name="phone" size={16} color="#666" />
                  <Text style={styles.userDetailText}>{userData.phone || "No phone"}</Text>
                </View>
                <View style={styles.userDetail}>
                  <MaterialIcons name="alternate-email" size={16} color="#666" />
                  <Text style={styles.userDetailText}>@{userData.username || "username"}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.editProfileButton}>
              <MaterialIcons name="edit" size={20} color="#0d9b1e" />
            </TouchableOpacity>
          </View>
        ) : !loading && (
          <View style={styles.guestCard}>
            <View style={styles.guestIcon}>
              <MaterialIcons name="person-outline" size={48} color="#0d9b1e" />
            </View>
            <Text style={styles.guestTitle}>Welcome to Lab App</Text>
            <Text style={styles.guestSubtitle}>Sign in to access your profile and booking history</Text>
            <TouchableOpacity
              onPress={() => router.push("/auth/LoginScreen")}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#3c5e45', '#0d9b1e']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.guestSignInButton}
              >
                <MaterialIcons name="login" size={20} color="#fff" />
                <Text style={styles.guestSignInButtonText}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, item.disabled && styles.disabledMenuItem]}
              onPress={item.onPress}
              disabled={item.disabled}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                <MaterialIcons name={item.icon} size={24} color={item.disabled ? '#ccc' : item.color} />
              </View>
              <View style={styles.menuContent}>
                <Text style={[styles.menuTitle, item.disabled && styles.disabledMenuText]}>
                  {item.title}
                </Text>
                <Text style={[styles.menuSubtitle, item.disabled && styles.disabledMenuText]}>
                  {item.subtitle}
                </Text>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color={item.disabled ? "#ccc" : "#777"}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity style={styles.settingsItem} onPress={handleClearStorage}>
            <View style={[styles.menuIcon, { backgroundColor: '#ff444420' }]}>
              <MaterialIcons name="delete-outline" size={24} color="#ff4444" />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: '#ff4444' }]}>Clear Storage</Text>
              <Text style={styles.menuSubtitle}>Remove all cached data</Text>
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#ff4444" />
          </TouchableOpacity>
        </View>

        {/* Sign Out Section */}
        {isLoggedIn && (
          <View style={styles.signOutSection}>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <MaterialIcons name="logout" size={20} color="#ff4444" />
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Lab App v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2024 Sirius Technologies</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
