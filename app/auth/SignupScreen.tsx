import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import AppNavigator from "../appnavigator/AppNavigator";
import { styles } from "../../styles/auth/SignupScreen.styles";
import {
  validatePersonalSection,
  validateContactSection,
  submitSignupForm,
  ValidationErrors
} from "../../services/signupValidation";

const SignupScreen = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [showTitleDropdown, setShowTitleDropdown] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [activeSection, setActiveSection] = useState<'personal' | 'contact'>('personal');
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Handle tab press from AppNavigator when on signup screen
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

  const handleNextSection = () => {
    const personalData = {
      title,
      firstname,
      lastname,
      gender,
      dateOfBirth
    };

    const validationErrors = validatePersonalSection(personalData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setActiveSection('contact');
  };

  const handleSubmit = async () => {
    const contactData = {
      email,
      phoneNumber,
      password,
      confirmPassword,
      acceptedTerms
    };

    const validationErrors = validateContactSection(contactData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = {
      title,
      firstname,
      lastname,
      gender,
      dateOfBirth,
      email,
      phoneNumber,
      password,
      confirmPassword,
      acceptedTerms
    };

    try {
      await submitSignupForm(formData);

      // Clear all input fields on successful registration
      setTitle("");
      setFirstname("");
      setLastname("");
      setGender("");
      setDateOfBirth("");
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      setConfirmPassword("");
      setAcceptedTerms(false);
      setErrors({});
      setActiveSection('personal'); // Reset to first section

      Alert.alert('Success', 'Account created successfully!');
      // Navigate to login or home screen
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
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
        <Text style={styles.title}>Create an Account</Text>
        <LinearGradient
          colors={['#3c5e45', '#0d9b1e']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.titleUnderline}
        />

      {/* Section Toggle Buttons */}
      <View style={styles.sectionToggleContainer}>
        <TouchableOpacity 
          style={[styles.sectionToggle, activeSection === 'personal' && styles.activeSectionToggle]}
          onPress={() => setActiveSection('personal')}
        >
          <Text style={[styles.sectionToggleText, activeSection === 'personal' && styles.activeSectionToggleText]}>
            Personal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.sectionToggle, activeSection === 'contact' && styles.activeSectionToggle]}
          onPress={() => setActiveSection('contact')}
        >
          <Text style={[styles.sectionToggleText, activeSection === 'contact' && styles.activeSectionToggleText]}>
            Contact
          </Text>
        </TouchableOpacity>
      </View>

      {/* Personal Information Section */}
      <View style={[styles.sectionContainer, {display: activeSection === 'personal' ? 'flex' : 'none'}]}>
        
        {/* Title Selection */}
        <View style={[styles.inputContainer, errors.title && styles.inputContainerError]}>
          <Ionicons name="person-outline" size={20} color="#16A34A" style={styles.inputIcon} />
          <TouchableWithoutFeedback onPress={() => setShowTitleDropdown(!showTitleDropdown)}>
            <View style={styles.titleInput}>
              <Text style={title ? styles.selectedText : styles.placeholderText}>
                {title || 'Select Title'}
              </Text>
              <Ionicons 
                name={showTitleDropdown ? "chevron-up" : "chevron-down"} 
                size={16} 
                color="#666" 
                style={styles.dropdownIcon} 
              />
            </View>
          </TouchableWithoutFeedback>
        </View>

        {showTitleDropdown && (
          <View style={styles.dropdownContainer}>
            {['Mr', 'Mrs', 'Ms', 'Miss'].map((item) => (
              <TouchableOpacity 
                key={item}
                style={styles.dropdownItem}
                onPress={() => {
                  setTitle(item);
                  setShowTitleDropdown(false);
                  if (errors.title) setErrors({...errors, title: false});
                }}
              >
                <Text style={styles.dropdownItemText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* First Name */}
        <View style={[styles.inputContainer, errors.firstname && styles.inputContainerError]}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstname}
            onChangeText={(text) => {
              setFirstname(text);
              if (errors.firstname) setErrors({...errors, firstname: false});
            }}
          />
        </View>

        {/* Last Name */}
        <View style={[styles.inputContainer, errors.lastname && styles.inputContainerError]}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastname}
            onChangeText={(text) => {
              setLastname(text);
              if (errors.lastname) setErrors({...errors, lastname: false});
            }}
          />
        </View>

        {/* Gender Selection */}
        <View style={[styles.inputContainer, errors.gender && styles.inputContainerError]}>
          <Ionicons name="transgender-outline" size={20} color="#16A34A" style={styles.inputIcon} />
          <TouchableWithoutFeedback onPress={() => setShowGenderDropdown(!showGenderDropdown)}>
            <View style={styles.genderInput}>
              <Text style={gender ? styles.selectedText : styles.placeholderText}>
                {gender || 'Select Gender'}
              </Text>
              <Ionicons 
                name={showGenderDropdown ? "chevron-up" : "chevron-down"} 
                size={16} 
                color="#666"
                style={styles.dropdownIcon} 
              />
            </View>
          </TouchableWithoutFeedback>
        </View>

        {showGenderDropdown && (
          <View style={styles.dropdownContainer}>
            {['Male', 'Female', 'Other'].map((item) => (
              <TouchableOpacity 
                key={item}
                style={styles.dropdownItem}
                onPress={() => {
                  setGender(item);
                  setShowGenderDropdown(false);
                  if (errors.gender) setErrors({...errors, gender: false});
                }}
              >
                <Text style={styles.dropdownItemText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Date of Birth */}
        <View style={[styles.inputContainer, errors.dateOfBirth && styles.inputContainerError]}>
          <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
          <TouchableWithoutFeedback onPress={() => setShowDatePicker(true)}>
            <View style={styles.dateInput}>
              <Text style={dateOfBirth ? styles.dateText : styles.placeholderText}>
                {dateOfBirth || 'Date of Birth'}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        {/* Date Picker Modal */}
        <Modal
          transparent={true}
          animationType="slide"
          visible={showDatePicker}
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Date of Birth</Text>

              <Text style={styles.dateFormatLabel}>Format: YYYY-MM-DD</Text>
              <Text style={styles.dateFormatExample}>Example: 1990-01-15</Text>

              <View style={styles.dateInputContainer}>
                <TextInput
                  style={styles.dateInputField}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#999"
                  value={dateOfBirth}
                  onChangeText={(text) => {
                    // Auto-format the date as user types
                    let formattedText = text.replace(/[^0-9]/g, '');
                    if (formattedText.length >= 5) {
                      formattedText = formattedText.slice(0, 4) + '-' + formattedText.slice(4);
                    }
                    if (formattedText.length >= 8) {
                      formattedText = formattedText.slice(0, 7) + '-' + formattedText.slice(7, 9);
                    }
                    setDateOfBirth(formattedText);
                    if (errors.dateOfBirth) setErrors({...errors, dateOfBirth: false});
                  }}
                  keyboardType="numeric"
                  maxLength={10}
                />
                {!dateOfBirth && (
                  <Text style={styles.floatingPlaceholder}>YYYY-MM-DD</Text>
                )}
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </View>

      {/* Contact Information Section */}
      <View style={[styles.sectionContainer, {marginTop: 0, display: activeSection === 'contact' ? 'flex' : 'none'}]}>

        <View style={[styles.inputContainer, errors.email && styles.inputContainerError]}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({...errors, email: false});
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Phone Number Row */}
        <View style={[styles.inputContainer, errors.phoneNumber && styles.inputContainerError]}>
          <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="03xxxxxxxxx"
            value={phoneNumber}
            onChangeText={(text) => {
              setPhoneNumber(text);
              if (errors.phoneNumber) setErrors({...errors, phoneNumber: false});
            }}
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />
        </View>


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
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.inputContainer, errors.confirmPassword && styles.inputContainerError]}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            secureTextEntry={!showConfirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword) setErrors({...errors, confirmPassword: false});
            }}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showConfirmPassword ? "eye" : "eye-off"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>

      {activeSection === 'personal' ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleNextSection}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#3c5e45', '#0d9b1e']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.continueButton}
            >
              <Text style={styles.continueButtonText}>Next</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
      <View style={[styles.termsContainer, { display: 'flex' }]}>
        <TouchableOpacity 
          style={styles.checkboxContainer}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
            {acceptedTerms && (
              <Ionicons name="checkmark" size={16} color="#fff" />
            )}
          </View>
          <View style={styles.termsTextContainer}>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsLink} onPress={() => {}}>Terms of Service</Text> and <Text style={styles.termsLink} onPress={() => {}}>Privacy Policy</Text>
            </Text>
          </View>
        </TouchableOpacity>
      </View>
          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.8}>
            <LinearGradient
              colors={['#3c5e45', '#0d9b1e']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.continueButton}
            >
              <Text style={styles.continueButtonText}>Submit</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
      
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an Account? </Text>
          <Link href="/auth/LoginScreen" style={[styles.loginText, styles.loginLink]}>
            Log In
          </Link>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Bottom Tab Navigation */}
      <View style={styles.tabBarContainer}>
        <AppNavigator isLoginScreen={true} onTabPress={handleTabPress} />
      </View>
    </View>
  );
};

export default SignupScreen;
