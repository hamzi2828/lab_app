import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Header = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Logo aligned to the left */}
      <Image
        source={require("../../assets/images/mainlogo2.png")}
        resizeMode="contain"
        style={styles.logo}
      />

      {/* Icons */}
      <View style={styles.iconsContainer}>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => navigation.navigate("common/Notifications")}
        >
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => navigation.navigate("likes/Likes")}
        >
          <Ionicons name="heart-outline" size={24} color="black" />
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
  },
  logo: {
    width: 200,
    height: 50,
  },
});

export default Header;
