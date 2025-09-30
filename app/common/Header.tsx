import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { getUserData, isUserLoggedIn, logoutUser } from "../../services/loginValidation";
import { fetchAppHomeAssets, AppAssets } from "../../services/assetsService";

type RootStackParamList = {
  'auth/LoginScreen': undefined;
  'likes/Likes': undefined;
  'common/Notifications': undefined;
  'appnavigator/AppNavigator': undefined;
  [key: string]: object | undefined;
};

const Header = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [assets, setAssets] = useState<AppAssets | null>(null);

  useEffect(() => {
    checkLoginStatus();
    loadAssets();
    const unsubscribe = navigation.addListener('focus', () => {
      checkLoginStatus();
    });
    return unsubscribe;
  }, [navigation]);

  const checkLoginStatus = async () => {
    try {
      const loggedIn = await isUserLoggedIn();
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        const userData = await getUserData();
        if (userData && userData.name) {
          setUserName(userData.name);
        }
      } else {
        setUserName("");
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  };

  const loadAssets = async () => {
    try {
      const response = await fetchAppHomeAssets();
      if (response.success) {
        setAssets(response.data);
      }
    } catch (error) {
      console.error("Error loading assets:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsLoggedIn(false);
      setUserName("");
      navigation.navigate('auth/LoginScreen' as never);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <View style={styles.header}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Logo aligned to the left */}
      <Image
          source={assets?.logo?.logo_url ? { uri: assets.logo.logo_url } : { uri: '' }}
          resizeMode="contain"
          style={[
            styles.logo,
            !assets?.logo?.logo_url && { width: 0, height: 0 }
          ]}
          onError={(e) => {
            console.log('Failed to load logo:', assets?.logo?.logo_url, e.nativeEvent.error);
          }}
        />

      {/* Icons */}
      <View style={styles.iconsContainer}>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => navigation.navigate("common/Notifications" as never)}
        >
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => navigation.navigate("likes/Likes" as never)}
        >
          <Ionicons name="heart-outline" size={24} color="black" />
        </TouchableOpacity>
        {isLoggedIn ? (
          <TouchableOpacity
            style={[styles.icon, styles.userButton]}
            onPress={() => navigation.navigate('profile/Profile' as never)}
          >
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
             {userName.split(' ')[1]}
              </Text>
              <Ionicons name="person-circle-outline" size={28} color="black" />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.icon, styles.loginButton]}
            onPress={() => navigation.navigate('auth/LoginScreen' as never)}
          >
            <Text style={styles.loginText}>Sign In</Text>
            <Ionicons name="log-in-outline" size={30} color="black" style={styles.loginIcon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    // marginTop: StatusBar.currentHeight || 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 30,
  },
  iconsContainer: {
    flexDirection: "row",
    marginLeft: -25,
  },
  icon: {
    marginHorizontal: 5,
    alignItems: 'center',
    marginTop: 15,  // Added to move icons down slightly
  },
  loginButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
  },
  userButton: {
    marginTop: 10,
    marginLeft: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#e8f5e9',
    borderRadius: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0d9b1e',
    maxWidth: 80,
  },
  loginIcon: {
    marginLeft: 4,
    },
  loginText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  logo: {
    marginLeft: -50,
    width: 250,  
    height: 60,  
    marginBottom: 0,
    marginTop: 10,
  },
});

export default Header;
