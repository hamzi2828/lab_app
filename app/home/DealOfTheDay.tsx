import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

const DealOfTheDay = () => {
  const router = useRouter();

  const handleViewAll = () => {
    router.push("/home/AllTests");
  };

  return (
    <LinearGradient
      colors={['#3c5e45', '#0d9b1e']}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={styles.container}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}> Citi Lab Health</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleViewAll}>
        <Text style={styles.buttonText}>View all</Text>
        <Ionicons name="arrow-forward-outline" size={16} color="#16A34A" />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 20,
    margin: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  buttonText: {
    color: "#16A34A",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 4,
  },
});

export default DealOfTheDay;
