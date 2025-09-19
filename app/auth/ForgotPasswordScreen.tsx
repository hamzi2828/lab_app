import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import forgotPasswordService from "../../services/forgotPasswordService";

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "" });

  const handleSendOTP = async () => {
    setLoading(true);
    setErrors({ email: "" });

    try {
      // Validate email
      if (!email.trim()) {
        setErrors({ email: "Please enter your email address" });
        setLoading(false);
        return;
      }

      if (!forgotPasswordService.validateEmail(email)) {
        setErrors({ email: "Please enter a valid email address" });
        setLoading(false);
        return;
      }

      // Step 1: Check if user exists
      const userDetailsResponse = await forgotPasswordService.getUserDetails(email);
      if (!userDetailsResponse.success) {
        Alert.alert("Error", userDetailsResponse.message);
        setLoading(false);
        return;
      }

      if (!userDetailsResponse.data?.exists) {
        Alert.alert("User Not Found", "No account found with this email address");
        setLoading(false);
        return;
      }

      // Step 2: Send OTP
      const sendOTPResponse = await forgotPasswordService.sendOTP(email);
      if (!sendOTPResponse.success) {
        Alert.alert("Error", sendOTPResponse.message);
        setLoading(false);
        return;
      }

      // Show success modal
      setShowModal(true);
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalOK = () => {
    setShowModal(false);
    router.push("/auth/OTPVerificationScreen");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your email address to receive a verification code</Text>

      <View style={[styles.inputContainer, errors.email && styles.inputContainerError]}>
        <TextInput
          style={styles.input}
          placeholder="Enter Email Address"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) {
              setErrors({ email: "" });
            }
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
      </View>
      {errors.email ? (
        <Text style={styles.errorText}>{errors.email}</Text>
      ) : null}

      <TouchableOpacity onPress={handleSendOTP} disabled={loading}>
        <LinearGradient
          colors={loading ? ['#ccc', '#999'] : ['#3c5e45', '#0d9b1e']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.continueButton, loading && styles.continueButtonDisabled]}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.continueButtonText}>Sending...</Text>
            </View>
          ) : (
            <Text style={styles.continueButtonText}>Send OTP</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* OTP Sent Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <MaterialIcons name="mark-email-read" size={48} color="#0d9b1e" />
            </View>

            <Text style={styles.modalTitle}>OTP Sent!</Text>
            <Text style={styles.modalMessage}>
              Verification code has been sent to
            </Text>
            <Text style={styles.modalEmail}>{email}</Text>

            <TouchableOpacity onPress={handleModalOK}>
              <LinearGradient
                colors={['#3c5e45', '#0d9b1e']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
    marginVertical: 32,
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    alignSelf: "flex-start",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E1E0E0",
    borderRadius: 8,
    marginBottom: 4,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 2,
    borderColor: "transparent",
  },
  inputContainerError: {
    backgroundColor: "#FFEBEE",
    borderColor: "#F44336",
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    color: "#F44336",
    marginBottom: 12,
    marginLeft: 4,
  },
  continueButton: {
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  continueButtonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    marginHorizontal: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0fff4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 4,
  },
  modalEmail: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0d9b1e",
    textAlign: "center",
    marginBottom: 30,
  },
  modalButton: {
    borderRadius: 25,
    paddingHorizontal: 40,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ForgotPasswordScreen;
