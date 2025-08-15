import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  TextInput,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const SortByBar = () => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTranslateY] = useState(new Animated.Value(300)); // Initially position below screen
  const router = useRouter(); // Router for navigation

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };

  const navigateToFilters = () => {
    router.push("/common/Filters"); // Navigate to the Filters screen
  };

  const openSortModal = () => {
    setModalVisible(true);
    Animated.spring(modalTranslateY, {
      toValue: 0, // Move the modal to the top (visible)
      useNativeDriver: true,
    }).start();
  };

  const closeSortModal = () => {
    Animated.spring(modalTranslateY, {
      toValue: 300, // Move the modal out of view (bottom)
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <View>
      {/* Sort By Bar */}
      <View style={styles.container}>
        <TouchableOpacity style={styles.sortSection} onPress={openSortModal}>
          <Text style={styles.sortText}>Sort by</Text>
          <Ionicons name="chevron-down-outline" size={16} color="black" />
        </TouchableOpacity>

        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={navigateToFilters}>
            <Ionicons name="options-outline" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconSpacing}
            onPress={toggleSearchBar}
          >
            <Feather name="search" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      {showSearchBar && (
        <View style={styles.searchBarContainer}>
          <Ionicons name="search-outline" size={20} color="gray" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="gray"
          />
        </View>
      )}

      {/* Sort Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={closeSortModal}
      >
        <TouchableWithoutFeedback onPress={closeSortModal}>
          <View style={styles.modalBackground}>
            <Animated.View
              style={[
                styles.modalContainer,
                { transform: [{ translateY: modalTranslateY }] },
              ]}
            >
              <Text style={styles.modalTitle}>Sort</Text>
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  /* handle sorting by latest */
                }}
              >
                <Text style={styles.optionText}>Latest</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  /* handle sorting by highest rated */
                }}
              >
                <Text style={styles.optionText}>Highest Rated</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  /* handle sorting by price high to low */
                }}
              >
                <Text style={styles.optionText}>Price: High to Low</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  /* handle sorting by price low to high */
                }}
              >
                <Text style={styles.optionText}>Price: Low to High</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.25,
    borderBottomColor: "gray",
    borderTopWidth: 0.25,
    borderTopColor: "gray",
    width: "100%",
    backgroundColor: "#fff",
  },
  sortSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 4,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconSpacing: {
    marginLeft: 16,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    paddingVertical: 4,
    color: "black",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  option: {
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 16,
    color: "black",
  },
});

export default SortByBar;
