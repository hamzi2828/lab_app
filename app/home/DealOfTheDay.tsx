import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DealOfTheDay = () => {

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}> Citi Lab Health Watch</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>View all</Text>
        <Ionicons name="arrow-forward-outline" size={16} color="#16A34A" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#16A34A",
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
