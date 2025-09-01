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
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import AppNavigator from "../appnavigator/AppNavigator";
import { LinearGradient } from 'expo-linear-gradient';

type AuthMethod = 'email' | 'phone' | 'username';

const LoginScreen = () => {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const router = useRouter();

  const handleContinue = () => {
    // Handle login based on authMethod
    console.log({
      authMethod,
      email: authMethod === 'email' ? email : undefined,
      phone: authMethod === 'phone' ? phone : undefined,
      username: authMethod === 'username' ? username : undefined,
      password
    });
    router.push("/appnavigator/AppNavigator");
  };

  const renderAuthInput = () => {
    switch (authMethod) {
      case 'phone':
        return (
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        );
      case 'username':
        return (
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
        );
      case 'email':
      default:
        return (
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image 
            source={require('@/assets/images/citilab_logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.welcomeContainer}>
            <Text style={styles.subtitle}>Sign in to Continue</Text>

          </View>
          
          <View style={styles.authMethodsContainer}>
            <TouchableOpacity 
              style={[
                styles.authButton, 
                authMethod === 'email' && styles.authButtonActive
              ]}
              onPress={() => setAuthMethod('email')}
            >
              <Ionicons 
                name="mail-outline" 
                size={20} 
                color={authMethod === 'email' ? '#0d9b1e' : '#666'} 
              />
              <Text style={[
                styles.authButtonText, 
                authMethod === 'email' && styles.authButtonTextActive
              ]}>
                Email
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.authButton, 
                authMethod === 'phone' && styles.authButtonActive
              ]}
              onPress={() => setAuthMethod('phone')}
            >
              <Ionicons 
                name="call-outline" 
                size={20} 
                color={authMethod === 'phone' ? '#0d9b1e' : '#666'} 
              />
              <Text style={[
                styles.authButtonText, 
                authMethod === 'phone' && styles.authButtonTextActive
              ]}>
                Phone
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.authButton, 
                authMethod === 'username' && styles.authButtonActive
              ]}
              onPress={() => setAuthMethod('username')}
            >
              <Ionicons 
                name="person-outline" 
                size={20} 
                color={authMethod === 'username' ? '#0d9b1e' : '#666'} 
              />
              <Text style={[
                styles.authButtonText, 
                authMethod === 'username' && styles.authButtonTextActive
              ]}>
                Username
              </Text>
            </TouchableOpacity>

          </View>

          {renderAuthInput()}

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
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
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            onPress={() => router.push('/auth/ForgotPasswordScreen')}
            style={styles.forgotPasswordContainer}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password ?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#3c5e45', '#0d9b1e']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.continueButton}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>


          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an Account? </Text>
            <Link href="/auth/SignupScreen" style={[styles.signupText, styles.signupLink]}>
              Sign Up
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Tab Navigation */}
      <View style={styles.tabBarContainer}>
        <AppNavigator />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: '#fff',
  },
  logo: {
    width: 300,
    height: 120,
    alignSelf: 'center',
    marginBottom: 10,  // Increased from 10 to 50px
    marginTop: -20,
  },
  authMethodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 10,  // Added 10px top margin
    width: '100%',
  },
  authButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 4,
  },
  authButtonActive: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0d9b1e',
  },
  authButtonText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 12,
  },
  authButtonTextActive: {
    color: '#0d9b1e',
    fontWeight: '600',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop:100,  // Reduced top padding
    paddingBottom: 100,
    width: "100%",
  },
  welcomeContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  subtitle: {
    fontSize: 20,
    color: '#666',
    marginTop: 8,
    marginBottom: 8,
    fontWeight: '600',
  },
  gradientLine: {
    height: 2,
    width: '80%',
    alignSelf: 'center',
    marginTop: 8,
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
    backgroundColor: "#FFFFFF",
    borderRadius: 25, // Increased for more rounded corners
    marginBottom: 20,
    paddingHorizontal: 20,
    height: 50,
    borderWidth: 1,
    borderColor: "#E1E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
    color: '#16A34A', // Matches the primary button color
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
    height: '100%',
  },
  eyeIcon: {
    marginLeft: 8,
  },
  continueButton: {
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 16,
    width: '100%',
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  signupText: {
    color: '#666',
    textAlign: 'center',
  },
  signupLink: {
    color: '#0d9b1e',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  checkboxChecked: {
    backgroundColor: '#0d9b1e',
    borderColor: '#0d9b1e',
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    flexWrap: 'wrap',
  },
  termsLink: {
    color: '#0d9b1e',
    textDecorationLine: 'underline',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-start',
    marginBottom: 1,
  },
  forgotPasswordText: {
    color: '#0d9b1e',
    fontSize: 14,
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
    marginTop: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
  },
  tabBarContainer: {
    position: 'absolute', 
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    zIndex: 1000,
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
