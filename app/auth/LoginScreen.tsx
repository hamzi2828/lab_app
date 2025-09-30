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
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from "../../styles/auth/LoginScreen.styles";
import AppNavigator from "../appnavigator/AppNavigator";
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
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const router = useRouter();
  const params = useLocalSearchParams();
  const redirectTo = params.redirect as string;

  // Validate redirect routes
  const isValidRedirect = (route: string): boolean => {
    const validRoutes = [
      '/cart/BookingSummaryPage',
      '/cart/BookingScreen',
      '/cart/Cart',
      '/home/HomePageScreen',
      '/home/AllTests',
      '/profile/Profile',
      '/profile/Address',
      '/profile/PreviousBookings'
    ];
    return validRoutes.includes(route);
  };

  // Handle tab press from AppNavigator when on login screen
  const handleTabPress = (routeName: string) => {
    switch (routeName) {
      case 'Home':
        router.push('/');
        break;
      case 'Lab Tests':
        router.push('/home/AllTests');
        break;
      case 'Cart':
        router.push('/cart/Cart');
        break;
      case 'Profile':
        router.push('/profile/Profile');
        break;
      case 'Locations':
        router.push('/home/AllTests');
        break;
      default:
        router.push('/');
    }
  };

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

      // Determine navigation path
      const navigationPath = (redirectTo && isValidRedirect(redirectTo)) ? redirectTo : "/";
      setPendingNavigation(navigationPath);

      // Show disclaimer modal
      setShowDisclaimerModal(true);

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

  const handleDisclaimerAccept = () => {
    setShowDisclaimerModal(false);
    if (pendingNavigation) {
      router.replace(pendingNavigation as any);
      setPendingNavigation(null);
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

      {/* Bottom Tab Navigation */}
      <View style={styles.tabBarContainer}>
        <AppNavigator isLoginScreen={true} onTabPress={handleTabPress} />
      </View>

      {/* Disclaimer Modal */}
      <Modal
        visible={showDisclaimerModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleDisclaimerAccept}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={true}>
              <Text style={styles.modalTitle}>CITILAB Service Disclaimer</Text>

              <Text style={styles.disclaimerText}>
                This disclaimer details our obligations to you regarding CITILAB Service (ORS). Using the Website implies that you accept the terms of this disclaimer. You are permitted to use our ORS for your own purposes and to print and download material from this Website provided that you do not modify any content without our consent. Material on this website must not be republished online or offline without our permission. The copyright and other intellectual property rights in all material on this Website is owned by IDC or our licensors and must not be reproduced without our prior consent.
              </Text>

              <Text style={styles.sectionTitle}>VISITOR CONDUCT</Text>
              <Text style={styles.disclaimerText}>
                When using this website you shall not post or send to or from this Website any material for which you have not obtained all necessary consents, is discriminatory, obscene, pornographic, defamatory, liable to incite racial hatred, in breach of confidentiality or privacy, which may cause annoyance or inconvenience to others, which encourages or constitutes conduct that would be deemed a criminal offence, give rise to a civil liability, or otherwise is contrary to the law in Pakistan;
              </Text>

              <Text style={styles.sectionTitle}>LINKS TO AND FROM OTHER WEBSITES</Text>
              <Text style={styles.disclaimerText}>
                Any links to third party websites located on this Website are provided for your convenience only. We have not reviewed each third party website and have no responsibility for such third party websites or their content. If you would like to link to this Website, you may only do so on the basis that you link to, but do not replicate, any page on this Website and you do not in any way imply that we are endorsing any services or products unless this has been specifically agreed with us.
              </Text>

              <Text style={styles.sectionTitle}>EXCLUSION OF LIABILITY</Text>
              <Text style={styles.disclaimerText}>
                We take all reasonable steps to ensure that the information on this Website is correct. However, we do not guarantee the correctness or completeness of material on this Website. Neither we nor any other party (whether or not involved in producing, maintaining or delivering this Website), shall be liability or responsible for any kind of loss or damage that may result to you or a third party as a result of your or their use of our website. This exclusion shall include servicing or repair costs and, without limitation, any other direct, indirect or consequential loss.
              </Text>

              <Text style={styles.sectionTitle}>LAW AND JURISDICTION</Text>
              <Text style={styles.disclaimerText}>
                The report delivered through the ORS is not valid for Court.
              </Text>

              <View style={styles.contactContainer}>
                <Text style={styles.contactText}>Kashmir Gate Plaza,</Text>
                <Text style={styles.contactText}>Opp: Benazir Bhutto Hospital,</Text>
                <Text style={styles.contactText}>Murree Road, Rawalpindi.</Text>
                <Text style={styles.contactText}>☎ UAN: 111-511-512, 051-4847390-92</Text>
                <Text style={styles.contactText}>For Inquiries: +92 334 0457457</Text>
                <Text style={styles.contactText}>https://citilab.com.pk/</Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={handleDisclaimerAccept}
              activeOpacity={0.8}
              style={styles.modalAcceptButton}
            >
              <LinearGradient
                colors={['#3c5e45', '#0d9b1e']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.modalButtonGradient}
              >
                <Text style={styles.modalAcceptButtonText}>I Accept</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LoginScreen;
