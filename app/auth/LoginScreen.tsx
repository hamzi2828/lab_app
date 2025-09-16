import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from "../../styles/auth/LoginScreen.styles";
import {
  validateLoginForm,
  submitLoginForm,
  LoginValidationErrors,
  AuthMethod
} from "../../services/loginValidation";

const LoginScreen = () => {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<LoginValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    if (isLoading) return;

    const loginData = {
      authMethod,
      email: authMethod === 'email' ? email : undefined,
      phone: authMethod === 'phone' ? phone : undefined,
      username: authMethod === 'username' ? username : undefined,
      password
    };

    // Validate form
    const validationErrors = validateLoginForm(loginData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const result = await submitLoginForm(loginData);

      // Clear form on successful login
      clearForm();

      Alert.alert(
        'Login Successful',
        `Welcome back, ${result.data?.name || 'User'}!`,
        [
          {
            text: 'Continue',
            onPress: () => router.replace("/")
          }
        ]
      );

    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error.message || 'Please check your credentials and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setEmail("");
    setPhone("");
    setUsername("");
    setPassword("");
    setErrors({});
  };

  const renderAuthInput = () => {
    switch (authMethod) {
      case 'phone':
        return (
          <View style={[styles.inputContainer, errors.phone && styles.inputContainerError]}>
            <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (errors.phone) setErrors({...errors, phone: false});
              }}
              keyboardType="phone-pad"
            />
          </View>
        );
      case 'username':
        return (
          <View style={[styles.inputContainer, errors.username && styles.inputContainerError]}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (errors.username) setErrors({...errors, username: false});
              }}
              autoCapitalize="none"
            />
          </View>
        );
      case 'email':
      default:
        return (
          <View style={[styles.inputContainer, errors.email && styles.inputContainerError]}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({...errors, email: false});
              }}
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

          <View style={[styles.inputContainer, errors.password && styles.inputContainerError]}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              secureTextEntry={!showPassword}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({...errors, password: false});
              }}
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
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#3c5e45', '#0d9b1e']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.continueButton}
            >
              <Text style={styles.continueButtonText}>
                {isLoading ? 'Signing In...' : 'Continue'}
              </Text>
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
    </View>
  );
};

export default LoginScreen;
