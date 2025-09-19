import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import forgotPasswordService from "../../services/forgotPasswordService";

const NewPasswordScreen = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [storedOTP, setStoredOTP] = useState("");
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    checkPasswordResetFlow();
  }, []);

  const checkPasswordResetFlow = async () => {
    try {
      const email = await forgotPasswordService.getStoredEmail();
      const step = await forgotPasswordService.getCurrentStep();

      if (!email || step !== 'password') {
        // User hasn't completed OTP verification
        Alert.alert("Error", "Please complete OTP verification first.", [
          { text: "OK", onPress: () => router.replace("/auth/OTPVerificationScreen") }
        ]);
        return;
      }

      setUserEmail(email);
    } catch (error) {
      console.error("Error checking password reset flow:", error);
      Alert.alert("Error", "Session expired. Please start over.", [
        { text: "OK", onPress: () => router.replace("/auth/ForgotPasswordScreen") }
      ]);
    }
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return null;
  };

  const validateForm = () => {
    const newErrors = { newPassword: "", confirmPassword: "" };

    // Validate new password
    if (!newPassword.trim()) {
      newErrors.newPassword = "Please enter a new password";
    } else {
      const passwordError = validatePassword(newPassword);
      if (passwordError) {
        newErrors.newPassword = passwordError;
      }
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return !newErrors.newPassword && !newErrors.confirmPassword;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Get stored data from previous steps
      const storedData = await forgotPasswordService.getStoredData();

      if (!storedData || !storedData.otp || !storedData.email) {
        Alert.alert("Error", "Session expired. Please start over.", [
          { text: "OK", onPress: () => router.replace("/auth/ForgotPasswordScreen") }
        ]);
        return;
      }

      // Use the API service to change password with OTP verification
      const response = await forgotPasswordService.verifyOTPAndChangePassword(
        storedData.otp,
        newPassword,
        confirmPassword,
        storedData.email
      );

      if (response.success) {
        setShowSuccessModal(true);
      } else {
        Alert.alert("Error", response.message || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalOK = () => {
    setShowSuccessModal(false);
    router.replace("/auth/LoginScreen");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}>Create New Password</Text>
      <Text style={styles.subtitle}>
        Your new password must be different from your previous password
      </Text>

      {/* New Password Input */}
      <View style={[styles.inputContainer, errors.newPassword && styles.inputContainerError]}>
        <TextInput
          style={styles.input}
          placeholder="Enter New Password"
          value={newPassword}
          onChangeText={(text) => {
            setNewPassword(text);
            if (errors.newPassword) {
              setErrors(prev => ({ ...prev, newPassword: "" }));
            }
          }}
          secureTextEntry={!showNewPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setShowNewPassword(!showNewPassword)}
          style={styles.eyeIcon}
        >
          <MaterialIcons
            name={showNewPassword ? "visibility" : "visibility-off"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>
      {errors.newPassword ? (
        <Text style={styles.errorText}>{errors.newPassword}</Text>
      ) : null}

      {/* Confirm Password Input */}
      <View style={[styles.inputContainer, errors.confirmPassword && styles.inputContainerError]}>
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (errors.confirmPassword) {
              setErrors(prev => ({ ...prev, confirmPassword: "" }));
            }
          }}
          secureTextEntry={!showConfirmPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.eyeIcon}
        >
          <MaterialIcons
            name={showConfirmPassword ? "visibility" : "visibility-off"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword ? (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      ) : null}

      {/* Password Requirements */}
      <View style={styles.requirementsContainer}>
        <Text style={styles.requirementsTitle}>Password Requirements:</Text>
        <View style={styles.requirementItem}>
          <MaterialIcons
            name={newPassword.length >= 6 ? "check-circle" : "radio-button-unchecked"}
            size={16}
            color={newPassword.length >= 6 ? "#0d9b1e" : "#ccc"}
          />
          <Text
            style={[
              styles.requirementText,
              newPassword.length >= 6 && styles.requirementMet
            ]}
          >
            At least 6 characters
          </Text>
        </View>
        <View style={styles.requirementItem}>
          <MaterialIcons
            name={newPassword === confirmPassword && newPassword ? "check-circle" : "radio-button-unchecked"}
            size={16}
            color={newPassword === confirmPassword && newPassword ? "#0d9b1e" : "#ccc"}
          />
          <Text
            style={[
              styles.requirementText,
              newPassword === confirmPassword && newPassword && styles.requirementMet
            ]}
          >
            Passwords match
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={handleResetPassword} disabled={loading}>
        <LinearGradient
          colors={loading ? ['#ccc', '#999'] : ['#3c5e45', '#0d9b1e']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.resetButton, loading && styles.resetButtonDisabled]}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.resetButtonText}>Resetting...</Text>
            </View>
          ) : (
            <Text style={styles.resetButtonText}>Reset Password</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <MaterialIcons name="check-circle" size={48} color="#0d9b1e" />
            </View>

            <Text style={styles.modalTitle}>Password Reset Successful!</Text>
            <Text style={styles.modalMessage}>
              Your password has been reset successfully.
            </Text>
            <Text style={styles.modalSubMessage}>
              You can now login with your new password.
            </Text>

            <TouchableOpacity onPress={handleSuccessModalOK}>
              <LinearGradient
                colors={['#3c5e45', '#0d9b1e']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Go to Login</Text>
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
    lineHeight: 24,
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
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#F44336",
    marginBottom: 12,
    marginLeft: 4,
  },
  requirementsContainer: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  requirementMet: {
    color: "#0d9b1e",
    fontWeight: "500",
  },
  resetButton: {
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  resetButtonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  resetButtonText: {
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
    marginBottom: 8,
    lineHeight: 22,
  },
  modalSubMessage: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },
  modalButton: {
    borderRadius: 25,
    paddingHorizontal: 40,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 140,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default NewPasswordScreen;