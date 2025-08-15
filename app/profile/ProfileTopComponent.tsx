import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const ProfileTopComponent = () => {
  const [selectedStatus, setSelectedStatus] = useState();
  const router = useRouter();

  const handleNavigation = (status) => {
    setSelectedStatus(status);
    if (status === "In-progress") {
      router.push("/orders/InProgressOrders");
    } else if (status === "Delivered") {
      router.push("/orders/DeliveredOrders");
    } else if (status === "Returned") {
      router.push("/orders/ReturnedOrders");
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://via.placeholder.com/80", 
          }}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.username}>Arsam Javed</Text>

          {/* Stats Section */}
          <View style={styles.stats}>
            <Text style={styles.statText}>100 Wishlist</Text>
            <Text style={styles.statText}>16 Followed Stores</Text>
            <Text style={styles.statText}>0 Vouchers</Text>
          </View>
        </View>
      </View>

      {/* My Orders Section */}
      <View style={styles.myOrders}>
        <Text style={styles.myOrdersText}>My Orders</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All Orders</Text>
        </TouchableOpacity>
      </View>

      {/* Status Buttons Section */}
      <View style={styles.statusButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.statusButton,
            selectedStatus === "In-progress" && styles.activeButtonOutline,
          ]}
          onPress={() => handleNavigation("In-progress")}
        >
          <Text
            style={[
              styles.statusButtonText,
              selectedStatus === "In-progress" && styles.activeButtonText,
            ]}
          >
            In-progress
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statusButton,
            selectedStatus === "Delivered" && styles.activeButtonOutline,
          ]}
          onPress={() => handleNavigation("Delivered")}
        >
          <Text
            style={[
              styles.statusButtonText,
              selectedStatus === "Delivered" && styles.activeButtonText,
            ]}
          >
            Delivered
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statusButton,
            selectedStatus === "Returned" && styles.activeButtonOutline,
          ]}
          onPress={() => handleNavigation("Returned")}
        >
          <Text
            style={[
              styles.statusButtonText,
              selectedStatus === "Returned" && styles.activeButtonText,
            ]}
          >
            Returned
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 40,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  statText: {
    fontSize: 10.5,
    color: "black",
    marginRight: 10,
  },
  myOrders: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  myOrdersText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  viewAllText: {
    fontSize: 14,
    color: "#0d9b1e",
  },
  statusButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
  },
  statusButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#0d9b1e",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  statusButtonText: {
    color: "#0d9b1e",
    fontWeight: "600",
  },
  activeButton: {
    backgroundColor: "#0d9b1e",
  },
  activeButtonText: {
    color: "#fff",
  },
  activeButtonOutline: {
    backgroundColor: "#0d9b1e",
  },
});

export default ProfileTopComponent;
