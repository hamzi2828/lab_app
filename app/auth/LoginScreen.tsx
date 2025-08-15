import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useRouter } from "expo-router";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleContinue = () => {
    router.push("/appnavigator/AppNavigator");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Sign in</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Don’t have an Account?{" "}
          <Link href="/auth/SignupScreen" style={styles.signupLink}>
            Create One
          </Link>
        </Text>

        <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
          <Ionicons name="logo-google" size={22} color="#4285F4" />
          <Text style={styles.googleButtonText}>Continue With Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
          <Ionicons name="logo-facebook" size={22} color="#fff" />
          <Text style={styles.facebookButtonText}>Continue With Facebook</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
    marginVertical: 32,
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    alignSelf: "flex-start",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E1E0E0",
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  eyeIcon: {
    marginLeft: 8,
  },
  continueButton: {
    backgroundColor: "#16A34A",
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  signupText: {
    textAlign: "center",
    fontSize: 14,
    color: "#333",
  },
  signupLink: {
    color: "#000",
    fontWeight: "600",
    marginLeft: 4,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    height: 50,
    marginTop: 16,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  googleButton: {
    borderWidth: 1,
    borderColor: "#4285F4",
    backgroundColor: "#fff",
  },
  googleButtonText: {
    fontSize: 16,
    color: "#4285F4",
    marginLeft: 12,
    fontWeight: "600",
  },
  facebookButton: {
    backgroundColor: "#1877F2",
  },
  facebookButtonText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 12,
    fontWeight: "600",
  },
});

export default LoginScreen;
