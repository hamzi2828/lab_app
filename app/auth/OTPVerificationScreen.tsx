import React, { useState, useRef, useEffect } from "react";
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

const OTPVerificationScreen = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    loadStoredEmail();
  }, []);

  const loadStoredEmail = async () => {
    try {
      const email = await forgotPasswordService.getStoredEmail();
      if (email) {
        setUserEmail(email);
      } else {
        // No stored email, redirect back to forgot password screen
        Alert.alert("Error", "Session expired. Please start over.", [
          { text: "OK", onPress: () => router.replace("/auth/ForgotPasswordScreen") }
        ]);
      }
    } catch (error) {
      console.error("Error loading stored email:", error);
    }
  };

  const handleOTPChange = (value: string, index: number) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join("");
    setLoading(true);

    try {
      if (otpValue.length !== 4) {
        Alert.alert("Error", "Please enter the 4-digit OTP");
        setLoading(false);
        return;
      }

      const response = await forgotPasswordService.verifyOTP(otpValue);

      if (response.success && response.data?.otp_valid) {
        setShowSuccessModal(true);
      } else {
        Alert.alert("Error", response.message || "Invalid OTP. Please try again.");
        // Clear OTP on error
        setOtp(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error("OTP verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalOK = () => {
    setShowSuccessModal(false);
    router.push("/auth/NewPasswordScreen");
  };

  const handleResendOTP = async () => {
    setResendLoading(true);

    try {
      const response = await forgotPasswordService.sendOTP();

      if (response.success) {
        Alert.alert("OTP Sent", "New verification code sent to your email");
        setOtp(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        Alert.alert("Error", response.message || "Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to resend OTP. Please try again.");
      console.error("Resend OTP error:", error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}>Enter Verification Code</Text>
      <Text style={styles.subtitle}>
        We've sent a 4-digit verification code to
      </Text>
      {userEmail && (
        <Text style={styles.emailText}>{userEmail}</Text>
      )}

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[styles.otpInput, digit && styles.otpInputFilled]}
            value={digit}
            onChangeText={(value) => handleOTPChange(value, index)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
            keyboardType="numeric"
            maxLength={1}
            textAlign="center"
            selectTextOnFocus
          />
        ))}
      </View>

      <TouchableOpacity onPress={handleVerifyOTP} disabled={loading}>
        <LinearGradient
          colors={loading ? ['#ccc', '#999'] : ['#3c5e45', '#0d9b1e']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.verifyButton, loading && styles.verifyButtonDisabled]}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.verifyButtonText}>Verifying...</Text>
            </View>
          ) : (
            <Text style={styles.verifyButtonText}>Verify OTP</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleResendOTP}
        style={styles.resendButton}
        disabled={resendLoading}
      >
        <Text style={styles.resendText}>Didn't receive the code? </Text>
        <Text style={[styles.resendLink, resendLoading && styles.resendLinkDisabled]}>
          {resendLoading ? "Sending..." : "Resend OTP"}
        </Text>
        {resendLoading && (
          <ActivityIndicator size="small" color="#0d9b1e" style={styles.resendLoader} />
        )}
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

            <Text style={styles.modalTitle}>OTP Verified!</Text>
            <Text style={styles.modalMessage}>
              Your verification code has been confirmed successfully.
            </Text>
            <Text style={styles.modalSubMessage}>
              You can now create your new password.
            </Text>

            <TouchableOpacity onPress={handleSuccessModalOK}>
              <LinearGradient
                colors={['#3c5e45', '#0d9b1e']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Continue</Text>
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
    marginBottom: 8,
    alignSelf: "flex-start",
    lineHeight: 24,
  },
  emailText: {
    fontSize: 16,
    color: "#0d9b1e",
    fontWeight: "600",
    marginBottom: 32,
    alignSelf: "flex-start",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: "#E1E0E0",
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    backgroundColor: "#f9f9f9",
  },
  otpInputFilled: {
    borderColor: "#0d9b1e",
    backgroundColor: "#f0fff4",
  },
  verifyButton: {
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  verifyButtonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  resendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  resendText: {
    fontSize: 16,
    color: "#666",
  },
  resendLink: {
    fontSize: 16,
    color: "#0d9b1e",
    fontWeight: "600",
  },
  resendLinkDisabled: {
    color: "#ccc",
  },
  resendLoader: {
    marginLeft: 8,
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
    minWidth: 120,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default OTPVerificationScreen;