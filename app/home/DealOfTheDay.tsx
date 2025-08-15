import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For the clock icon

const DealOfTheDay = () => {
  const [timeLeft, setTimeLeft] = useState(828220); // Set initial time in seconds (22h 55m 20s)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer); // Clear timer when it reaches 0
          return 0;
        }
        return prev - 1; // Decrement by 1 second
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Deal of the Day</Text>
        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={16} color="#fff" />
          <Text style={styles.timerText}>{formatTime(timeLeft)} remaining</Text>
        </View>
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
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timerText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 4,
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
