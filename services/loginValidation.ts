export type AuthMethod = 'email' | 'phone' | 'username';

export interface LoginFormData {
  authMethod: AuthMethod;
  email?: string;
  phone?: string;
  username?: string;
  password: string;
}

export interface LoginValidationErrors {
  email?: boolean;
  phone?: boolean;
  username?: boolean;
  password?: boolean;
}

export const validateLoginForm = (data: LoginFormData): LoginValidationErrors => {
  const errors: LoginValidationErrors = {};

  // Validate password
  if (!data.password || data.password.trim() === '') {
    errors.password = true;
  }

  // Validate based on auth method
  switch (data.authMethod) {
    case 'email':
      if (!data.email || data.email.trim() === '') {
        errors.email = true;
      } else if (!isValidEmail(data.email)) {
        errors.email = true;
      }
      break;
    case 'phone':
      if (!data.phone || data.phone.trim() === '') {
        errors.phone = true;
      } else if (!isValidPhoneNumber(data.phone)) {
        errors.phone = true;
      }
      break;
    case 'username':
      if (!data.username || data.username.trim() === '') {
        errors.username = true;
      }
      break;
  }

  return errors;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhoneNumber = (phone: string): boolean => {
  // Accept both Pakistani format (03xxxxxxxxx) and international formats
  const phoneRegex = /^(\+?[\d\s\-\(\)]{7,15})$/;
  return phoneRegex.test(phone);
};

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user_id: string;
    name: string;
    email: string;
    phone: string;
    username: string;
    token: string;
    token_expires: string;
  };
}

import AsyncStorage from '@react-native-async-storage/async-storage';

export const submitLoginForm = async (data: LoginFormData): Promise<LoginResponse> => {
  try {
    // Prepare the request data based on auth method
    const requestData: any = {
      authMethod: data.authMethod,
      password: data.password
    };

    // Add the appropriate identifier based on auth method
    switch (data.authMethod) {
      case 'email':
        requestData.email = data.email;
        break;
      case 'phone':
        requestData.phone = data.phone;
        break;
      case 'username':
        requestData.username = data.username;
        break;
    }

    console.log('Login attempt:', { ...requestData, password: '[HIDDEN]' });

    const response = await fetch('https://hmis.rapidreporting.us/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('Login response status:', response.status);

    // Get response text first
    const responseText = await response.text();
    console.log('Raw login response:', responseText);

    // Check if it's HTML error page
    if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
      if (responseText.includes('The action you have requested is not allowed')) {
        throw new Error('Login service unavailable. Please try again later.');
      }
      throw new Error('Service temporarily unavailable.');
    }

    // Parse JSON response
    let result: LoginResponse;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse login response:', parseError);
      throw new Error('Invalid response from server');
    }

    console.log('Parsed login response:', result);

    // Handle different response scenarios
    if (!response.ok) {
      throw new Error(result.message || `Login failed: ${response.status}`);
    }

    if (result.hasOwnProperty('success') && !result.success) {
      throw new Error(result.message || 'Login failed');
    }

    // Store user data in AsyncStorage after successful login
    if (result.success && result.data) {
      try {
        // Create a session identifier since no token is used
        const sessionId = `session_${result.data.user_id}_${Date.now()}`;
        await AsyncStorage.setItem('userSession', sessionId);
        await AsyncStorage.setItem('userData', JSON.stringify(result.data));
        await AsyncStorage.setItem('loginMethod', data.authMethod);
        await AsyncStorage.setItem('isLoggedIn', 'true');
        console.log('User data stored successfully in AsyncStorage');
      } catch (storageError) {
        console.error('Failed to store user data:', storageError);
        // Don't throw error here as login was successful, just log the storage error
      }
    }

    return result;

  } catch (error) {
    console.error('Login error:', error);

    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please check your internet connection.');
    }

    throw error;
  }
};

// Helper functions to manage stored user data
export const getUserSession = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('userSession');
  } catch (error) {
    console.error('Failed to get user session:', error);
    return null;
  }
};

export const getUserData = async (): Promise<any | null> => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Failed to get user data:', error);
    return null;
  }
};

export const getLoginMethod = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('loginMethod');
  } catch (error) {
    console.error('Failed to get login method:', error);
    return null;
  }
};

export const isUserLoggedIn = async (): Promise<boolean> => {
  try {
    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    const userData = await getUserData();
    return isLoggedIn === 'true' && !!userData;
  } catch (error) {
    console.error('Failed to check login status:', error);
    return false;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('userSession');
    await AsyncStorage.removeItem('userData');
    await AsyncStorage.removeItem('loginMethod');
    await AsyncStorage.removeItem('isLoggedIn');
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Failed to logout user:', error);
    throw error;
  }
};