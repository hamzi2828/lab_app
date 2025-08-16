import React from "react";
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

type RootStackParamList = {
  'auth/LoginScreen': undefined;
  'likes/Likes': undefined;
  'common/Notifications': undefined;
  'appnavigator/AppNavigator': undefined;
  [key: string]: object | undefined;
};

const Header = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.header}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Logo aligned to the left */}
      <Image
        source={require("../../assets/images/citilab_logo.jpg")}
        resizeMode="contain"
        style={styles.logo}
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
        <TouchableOpacity
          style={[styles.icon, styles.loginButton]}
          onPress={() => navigation.navigate('auth/LoginScreen' as never)}
        >
          <Text style={styles.loginText}>Sign In</Text>
          <Ionicons name="log-in-outline" size={30} color="black" style={styles.loginIcon} />
        </TouchableOpacity>
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
  },
  iconsContainer: {
    flexDirection: "row",
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
    marginLeft: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
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
    height: 70,  
    marginBottom: 0,
  },
});

export default Header;
