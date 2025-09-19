import React, { useState, useRef } from "react";
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
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const OTPVerificationScreen = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

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

  const handleVerifyOTP = () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 4) {
      Alert.alert("Error", "Please enter the 4-digit OTP");
      return;
    }

    // For UI demo - check if OTP is 1234
    if (otpValue === "1234") {
      setShowSuccessModal(true);
    } else {
      Alert.alert("Error", "Invalid OTP. Please try again.");
    }
  };

  const handleSuccessModalOK = () => {
    setShowSuccessModal(false);
    router.push("/auth/NewPasswordScreen");
  };

  const handleResendOTP = () => {
    Alert.alert("OTP Sent", "New verification code sent to your email");
    setOtp(["", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}>Enter Verification Code</Text>
      <Text style={styles.subtitle}>
        We've sent a 4-digit verification code to your email address
      </Text>

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

      <TouchableOpacity onPress={handleVerifyOTP}>
        <LinearGradient
          colors={['#3c5e45', '#0d9b1e']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.verifyButton}
        >
          <Text style={styles.verifyButtonText}>Verify OTP</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResendOTP} style={styles.resendButton}>
        <Text style={styles.resendText}>Didn't receive the code? </Text>
        <Text style={styles.resendLink}>Resend OTP</Text>
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
    marginBottom: 40,
    alignSelf: "flex-start",
    lineHeight: 24,
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