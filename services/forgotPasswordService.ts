import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://hmis.rapidreporting.us';

// Interfaces
export interface UserDetailsResponse {
  success: boolean;
  message: string;
  data?: {
    user_id: number;
    email: string;
    name: string;
    phone: string;
    exists: boolean;
  };
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
  data?: {
    user_id: number;
    email: string;
    expires_at: string;
  };
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  data?: {
    user_id: number;
    email: string;
    otp_valid: boolean;
    verified_at: string;
  };
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  data?: {
    user_id: number;
    email: string;
    updated_at: string;
  };
}

export interface ForgotPasswordData {
  email: string;
  user_id?: number;
  otp?: string;
  step: 'email' | 'otp' | 'password';
}

class ForgotPasswordService {
  private storageKey = 'forgot_password_data';

  // Helper method to make API requests
  private async makeRequest<T>(
    endpoint: string,
    method: string = 'POST',
    body?: any
  ): Promise<T> {
    try {
      const url = `${API_BASE_URL}/api${endpoint}`;
      console.log(`🔄 Making request to: ${url}`);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      console.log(`📡 Response status: ${response.status}`);

      const responseText = await response.text();
      console.log(`📝 Raw response: ${responseText.substring(0, 200)}...`);

      // Check if it's HTML error page
      if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
        if (responseText.includes('The action you have requested is not allowed')) {
          throw new Error('Service unavailable. Please try again later.');
        }
        throw new Error('Service temporarily unavailable.');
      }

      // Parse JSON response
      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid response from server');
      }

      console.log('✅ Parsed response:', result);

      if (!response.ok) {
        return {
          success: false,
          message: result.message || `Server error (${response.status}). Please try again later.`,
        } as T;
      }

      return result;
    } catch (error) {
      console.error('❌ API Request failed:', error);

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return {
          success: false,
          message: 'Cannot connect to server. Please check your internet connection.',
        } as T;
      }

      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
      } as T;
    }
  }

  // Store forgot password flow data
  private async storeForgotPasswordData(data: ForgotPasswordData): Promise<void> {
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to store forgot password data:', error);
    }
  }

  // Retrieve forgot password flow data
  private async getForgotPasswordData(): Promise<ForgotPasswordData | null> {
    try {
      const data = await AsyncStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to retrieve forgot password data:', error);
      return null;
    }
  }

  // Clear forgot password flow data
  private async clearForgotPasswordData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Failed to clear forgot password data:', error);
    }
  }

  // Step 1: Get user details by email
  async getUserDetails(email: string): Promise<UserDetailsResponse> {
    const response = await this.makeRequest<UserDetailsResponse>('/get-user-details', 'POST', {
      email: email.trim().toLowerCase(),
    });

    if (response.success && response.data) {
      // Store email and user_id for next steps
      await this.storeForgotPasswordData({
        email: email.trim().toLowerCase(),
        user_id: response.data.user_id,
        step: 'email',
      });
    }

    return response;
  }

  // Step 2: Send OTP to email
  async sendOTP(email?: string): Promise<SendOTPResponse> {
    // Use stored email if not provided
    let targetEmail = email;
    if (!targetEmail) {
      const storedData = await this.getForgotPasswordData();
      targetEmail = storedData?.email;
    }

    if (!targetEmail) {
      return {
        success: false,
        message: 'Email address is required',
      };
    }

    const response = await this.makeRequest<SendOTPResponse>('/send-otp', 'POST', {
      email: targetEmail.trim().toLowerCase(),
    });

    if (response.success && response.data) {
      // Update stored data with OTP send confirmation
      const storedData = await this.getForgotPasswordData();
      await this.storeForgotPasswordData({
        email: targetEmail.trim().toLowerCase(),
        user_id: response.data.user_id,
        step: 'otp',
      });
    }

    return response;
  }

  // Step 3: Verify OTP only
  async verifyOTP(otp: string, email?: string): Promise<VerifyOTPResponse> {
    // Use stored email if not provided
    let targetEmail = email;
    if (!targetEmail) {
      const storedData = await this.getForgotPasswordData();
      targetEmail = storedData?.email;
    }

    if (!targetEmail) {
      return {
        success: false,
        message: 'Email address is required',
      };
    }

    if (!otp || otp.length !== 4) {
      return {
        success: false,
        message: 'Please enter a valid 4-digit OTP',
      };
    }

    const response = await this.makeRequest<VerifyOTPResponse>('/verify-otp', 'POST', {
      email: targetEmail.trim().toLowerCase(),
      otp: otp.trim(),
    });

    if (response.success && response.data?.otp_valid) {
      // Update stored data with OTP verification
      const storedData = await this.getForgotPasswordData();
      await this.storeForgotPasswordData({
        email: targetEmail.trim().toLowerCase(),
        user_id: response.data.user_id,
        otp: otp.trim(),
        step: 'password',
      });
    }

    return response;
  }

  // Step 4: Verify OTP and change password
  async verifyOTPAndChangePassword(
    otp: string,
    newPassword: string,
    confirmPassword: string,
    email?: string
  ): Promise<ChangePasswordResponse> {
    // Use stored email if not provided
    let targetEmail = email;
    if (!targetEmail) {
      const storedData = await this.getForgotPasswordData();
      targetEmail = storedData?.email;
    }

    if (!targetEmail) {
      return {
        success: false,
        message: 'Email address is required',
      };
    }

    // Validate inputs
    if (!otp || otp.length !== 4) {
      return {
        success: false,
        message: 'Please enter a valid 4-digit OTP',
      };
    }

    if (!newPassword || newPassword.length < 6) {
      return {
        success: false,
        message: 'Password must be at least 6 characters long',
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        success: false,
        message: 'Passwords do not match',
      };
    }

    const response = await this.makeRequest<ChangePasswordResponse>(
      '/verify-otp-change-password',
      'POST',
      {
        email: targetEmail.trim().toLowerCase(),
        otp: otp.trim(),
        new_password: newPassword,
        confirm_password: confirmPassword,
      }
    );

    if (response.success) {
      // Clear stored data on successful password change
      await this.clearForgotPasswordData();
    }

    return response;
  }

  // Get current stored email (for UI display)
  async getStoredEmail(): Promise<string | null> {
    const data = await this.getForgotPasswordData();
    return data?.email || null;
  }

  // Get current step in the flow
  async getCurrentStep(): Promise<'email' | 'otp' | 'password' | null> {
    const data = await this.getForgotPasswordData();
    return data?.step || null;
  }

  // Reset the entire forgot password flow
  async resetFlow(): Promise<void> {
    await this.clearForgotPasswordData();
  }

  // Get stored forgot password data (public method for external access)
  async getStoredData(): Promise<ForgotPasswordData | null> {
    return await this.getForgotPasswordData();
  }

  // Utility method to validate email format
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  // Utility method to validate OTP format
  validateOTP(otp: string): boolean {
    return /^\d{4}$/.test(otp.trim());
  }

  // Utility method to validate password
  validatePassword(password: string): { isValid: boolean; message?: string } {
    if (!password) {
      return { isValid: false, message: 'Password is required' };
    }

    if (password.length < 6) {
      return { isValid: false, message: 'Password must be at least 6 characters long' };
    }

    return { isValid: true };
  }

  // Utility method to check if passwords match
  validatePasswordMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }
}

export default new ForgotPasswordService();