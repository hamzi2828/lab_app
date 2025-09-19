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
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const NewPasswordScreen = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

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

  const handleResetPassword = () => {
    if (!validateForm()) {
      return;
    }

    // For UI demo - simulate password reset success
    Alert.alert(
      "Password Reset Successful",
      "Your password has been reset successfully. You can now login with your new password.",
      [
        {
          text: "Go to Login",
          onPress: () => router.replace("/auth/LoginScreen")
        }
      ]
    );
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

      <TouchableOpacity onPress={handleResetPassword}>
        <LinearGradient
          colors={['#3c5e45', '#0d9b1e']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.resetButton}
        >
          <Text style={styles.resetButtonText}>Reset Password</Text>
        </LinearGradient>
      </TouchableOpacity>
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
  resetButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default NewPasswordScreen;