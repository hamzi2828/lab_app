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
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import AppNavigator from "../appnavigator/AppNavigator";

const SignupScreen = () => {
  const [title, setTitle] = useState("");
  const [showTitleDropdown, setShowTitleDropdown] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneOperator, setPhoneOperator] = useState("");
  const [showOperatorDropdown, setShowOperatorDropdown] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeSection, setActiveSection] = useState<'personal' | 'contact'>('personal');

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Create Account</Text>

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
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        {/* Title Selection */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-circle-outline" size={20} color="#666" style={styles.inputIcon} />
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
            {['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof'].map((item) => (
              <TouchableOpacity 
                key={item}
                style={styles.dropdownItem}
                onPress={() => {
                  setTitle(item);
                  setShowTitleDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* First Name */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstname}
            onChangeText={setFirstname}
          />
        </View>

        {/* Last Name */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastname}
            onChangeText={setLastname}
          />
        </View>

        {/* Gender Selection */}
        <View style={styles.inputContainer}>
          <Ionicons name="transgender-outline" size={20} color="#666" style={styles.inputIcon} />
          <View style={styles.genderContainer}>
            <TouchableOpacity 
              style={[styles.genderOption, gender === 'male' && styles.genderSelected]}
              onPress={() => setGender('male')}
            >
              <Text style={[styles.genderText, gender === 'male' && styles.genderTextSelected]}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.genderOption, gender === 'female' && styles.genderSelected]}
              onPress={() => setGender('female')}
            >
              <Text style={[styles.genderText, gender === 'female' && styles.genderTextSelected]}>Female</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.genderOption, gender === 'other' && styles.genderSelected]}
              onPress={() => setGender('other')}
            >
              <Text style={[styles.genderText, gender === 'other' && styles.genderTextSelected]}>Other</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date of Birth */}
        <View style={styles.inputContainer}>
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
              <TextInput
                style={styles.dateInputField}
                placeholder="YYYY-MM-DD"
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                keyboardType="numeric"
              />
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
      <View style={[styles.sectionContainer, {marginTop: 20, display: activeSection === 'contact' ? 'flex' : 'none'}]}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Phone Number Row */}
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        {/* Operator Selection Row */}
        <View style={styles.inputContainer}>
          <Ionicons name="phone-portrait-outline" size={20} color="#666" style={styles.inputIcon} />
          <View style={styles.operatorDropdownContainer}>
            <TouchableWithoutFeedback onPress={() => setShowOperatorDropdown(!showOperatorDropdown)}>
              <View style={styles.operatorInput}>
                <Text style={phoneOperator ? styles.selectedText : styles.placeholderText}>
                  {phoneOperator || 'Select Mobile Operator'}
                </Text>
                <Ionicons
                  name={showOperatorDropdown ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#666"
                />
              </View>
            </TouchableWithoutFeedback>
            {showOperatorDropdown && (
              <View style={styles.dropdownOptions}>
                {['Jazz', 'Telenor', 'Zong', 'Ufone', 'SCOM'].map((operator) => (
                  <TouchableOpacity
                    key={operator}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setPhoneOperator(operator);
                      setShowOperatorDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>{operator}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

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
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            secureTextEntry={!showConfirmPassword}
            onChangeText={setConfirmPassword}
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

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Forgot Password?{" "}
          <Link href="/auth/ForgotPasswordScreen" style={styles.resetLink}>
            Reset
          </Link>
        </Text>
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
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 80,
    paddingBottom: 100,
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "center",
    textAlign: "center",
    width: '100%',
  },
  sectionContainer: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#16A34A',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E1E0E0",
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  inputIcon: {
    marginRight: 8,
  },
  operatorDropdownContainer: {
    position: 'relative',
    flex: 1,
  },
  operatorInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  dropdownOptions: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: -30,
  },
  sectionToggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
    marginHorizontal: 16,
  },
  sectionToggle: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeSectionToggle: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionToggleText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeSectionToggleText: {
    color: '#16A34A',
    fontWeight: '600',
  },
  titleInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  selectedText: {
    fontSize: 16,
    color: '#000',
  },
  dropdownIcon: {
    marginLeft: 8,
  },
  dropdownContainer: {
    marginTop: -8,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E0E0',
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  genderContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  genderOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E1E0E0',
  },
  genderSelected: {
    backgroundColor: '#e6f7e6',
    borderColor: '#0d9b1e',
  },
  genderText: {
    color: '#666',
    fontSize: 14,
  },
  genderTextSelected: {
    color: '#0d9b1e',
    fontWeight: '600',
  },
  dateInput: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  dateInputField: {
    borderWidth: 1,
    borderColor: '#E1E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#16A34A',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  eyeIcon: {
    marginLeft: 8,
  },
  continueButton: {
    backgroundColor: "#16A34A",
    borderRadius: 8,
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
  footerText: {
    textAlign: "center",
    fontSize: 14,
    color: "#333",
  },
  resetLink: {
    color: "#000",
    fontWeight: "600",
    marginLeft: 4,
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
});

export default SignupScreen;
