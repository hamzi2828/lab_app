import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Modal,
  Animated,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";
import { useRouter } from "expo-router";

const NewAddress = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const handleContinue = () => {
    // Show the confirmation modal
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    // Close the modal and navigate back or perform other actions
    setModalVisible(false);
    // navigation?.goBack();
    setTimeout(() => {
      return router.push("cart/Cart");
    }, 200);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            alert("Back button pressed");
            navigation?.goBack();
          }}
          style={styles.iconLeft}
        >
          <Ionicons name="arrow-back" size={24} color="#495057" />
        </TouchableOpacity>
        <Text style={styles.title}>Add New Address</Text>
      </View>

      {/* Input Fields */}
      <ScrollView contentContainerStyle={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#6c757d"
          defaultValue="David Guetta"
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#6c757d"
          defaultValue="David Guetta"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#6c757d"
          keyboardType="email-address"
          defaultValue="abcd@gmail.com"
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          placeholderTextColor="#6c757d"
          keyboardType="phone-pad"
          defaultValue="+1 202 555 0142"
        />
        <TextInput
          style={styles.input}
          placeholder="Flat No, Street Details"
          placeholderTextColor="#6c757d"
          defaultValue="38921 Rnachiiswe Dr. Richardson, California 62639"
        />
        <TextInput
          style={styles.input}
          placeholder="Landmark"
          placeholderTextColor="#6c757d"
          defaultValue="Walmart"
        />
        <TextInput
          style={styles.input}
          placeholder="State"
          placeholderTextColor="#6c757d"
          defaultValue="California"
        />
        <TextInput
          style={styles.input}
          placeholder="City/District"
          placeholderTextColor="#6c757d"
          defaultValue="Los Angeles"
        />
        <TextInput
          style={styles.input}
          placeholder="Pincode"
          placeholderTextColor="#6c757d"
          defaultValue="90001"
        />
      </ScrollView>

      {/* Continue Button */}
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons
              name="checkmark-circle"
              size={120}
              color="#28a745"
              style={styles.modalIcon}
            />
            <Text style={styles.modalText}>Address Added Successfully!</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.modalButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    marginTop: StatusBar.currentHeight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#212529",
    flex: 1,
    textAlign: "center",
  },
  iconLeft: {
    padding: 8,
    position: "absolute",
    left: 10,
  },
  inputContainer: {
    padding: 16,
    paddingBottom: 100, // For spacing above the button
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#212529",
    marginBottom: 16,
    backgroundColor: "#fff",
    elevation: 1,
  },
  button: {
    backgroundColor: "#28a745",
    borderRadius: 8,
    paddingVertical: 16,
    marginHorizontal: 16,
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 20,
    alignItems: "center",
    elevation: 4,
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    color: "#212529",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#28a745",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 10,
    width: "100%",
  },
  modalButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default NewAddress;
