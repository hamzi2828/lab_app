import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData, isUserLoggedIn } from './loginValidation';
import loginModalService from './loginModalService';

// Address interfaces
export interface UserAddress {
  id: number;
  user_id: number;
  address_type: 'home' | 'work' | 'other';
  complete_address: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAddressRequest {
  user_id: number;
  address_type: 'home' | 'work' | 'other';
  complete_address: string;
  is_default: boolean;
}

export interface UpdateAddressRequest {
  address_type?: 'home' | 'work' | 'other';
  complete_address?: string;
  is_default?: boolean;
}

export interface AddressResponse {
  success: boolean;
  message: string;
  data?: UserAddress | UserAddress[];
  count?: number;
}

export interface SetDefaultRequest {
  user_id: number;
}

const API_BASE_URL = 'https://hmis.rapidreporting.us';

class AddressService {
  // Create a new address
  async createAddress(addressData: CreateAddressRequest): Promise<AddressResponse> {
    try {
      console.log('Creating address:', { ...addressData });

      const response = await fetch(`${API_BASE_URL}/api/user-addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      console.log('Create address response status:', response.status);

      const responseText = await response.text();
      console.log('Raw create address response:', responseText);

      // Check if it's HTML error page
      if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
        if (responseText.includes('The action you have requested is not allowed')) {
          throw new Error('Address service unavailable. Please try again later.');
        }
        throw new Error('Service temporarily unavailable.');
      }

      // Parse JSON response
      let result: AddressResponse;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse create address response:', parseError);
        throw new Error('Invalid response from server');
      }

      console.log('Parsed create address response:', result);

      if (response.ok && result.success) {
        return result;
      } else {
        return {
          success: false,
          message: result.message || 'Failed to create address',
        };
      }
    } catch (error) {
      console.error('Error creating address:', error);

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return {
          success: false,
          message: 'Cannot connect to server. Please check your internet connection.',
        };
      }

      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
      };
    }
  }

  // Get all addresses for a user
  async getUserAddresses(userId: number, addressType?: 'home' | 'work' | 'other'): Promise<AddressResponse> {
    try {
      let url = `${API_BASE_URL}/api/user-addresses/list?user_id=${userId}`;

      if (addressType) {
        url += `&address_type=${addressType}`;
      }

      console.log('Fetching user addresses from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('Get addresses response status:', response.status);

      const responseText = await response.text();
      console.log('Raw get addresses response:', responseText);

      // Check if it's HTML error page
      if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
        throw new Error('Service temporarily unavailable.');
      }

      // Parse JSON response
      let result: AddressResponse;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse get addresses response:', parseError);
        throw new Error('Invalid response from server');
      }

      console.log('Parsed get addresses response:', result);

      if (response.ok && result.success) {
        return result;
      } else {
        return {
          success: false,
          message: result.message || 'Failed to fetch addresses',
          data: []
        };
      }
    } catch (error) {
      console.error('Error fetching user addresses:', error);

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return {
          success: false,
          message: 'Cannot connect to server. Please check your internet connection.',
          data: []
        };
      }

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch addresses',
        data: []
      };
    }
  }

  // Get a single address by ID
  async getAddressById(addressId: number): Promise<AddressResponse> {
    try {
      console.log('Fetching address by ID:', addressId);

      const response = await fetch(`${API_BASE_URL}/api/user-addresses/${addressId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('Get address by ID response status:', response.status);

      const responseText = await response.text();
      console.log('Raw get address by ID response:', responseText);

      // Check if it's HTML error page
      if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
        throw new Error('Service temporarily unavailable.');
      }

      // Parse JSON response
      let result: AddressResponse;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse get address response:', parseError);
        throw new Error('Invalid response from server');
      }

      console.log('Parsed get address response:', result);

      if (response.ok && result.success) {
        return result;
      } else {
        return {
          success: false,
          message: result.message || 'Failed to fetch address',
        };
      }
    } catch (error) {
      console.error('Error fetching address by ID:', error);

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return {
          success: false,
          message: 'Cannot connect to server. Please check your internet connection.',
        };
      }

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch address',
      };
    }
  }

  // Update an existing address
  async updateAddress(addressId: number, updateData: UpdateAddressRequest): Promise<AddressResponse> {
    try {
      console.log('Updating address:', addressId, updateData);

      const response = await fetch(`${API_BASE_URL}/api/user-addresses/${addressId}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      console.log('Update address response status:', response.status);

      const responseText = await response.text();
      console.log('Raw update address response:', responseText);

      // Check if it's HTML error page
      if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
        if (responseText.includes('The action you have requested is not allowed')) {
          throw new Error('Address service unavailable. Please try again later.');
        }
        throw new Error('Service temporarily unavailable.');
      }

      // Parse JSON response
      let result: AddressResponse;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse update address response:', parseError);
        throw new Error('Invalid response from server');
      }

      console.log('Parsed update address response:', result);

      if (response.ok && result.success) {
        return result;
      } else {
        return {
          success: false,
          message: result.message || 'Failed to update address',
        };
      }
    } catch (error) {
      console.error('Error updating address:', error);

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return {
          success: false,
          message: 'Cannot connect to server. Please check your internet connection.',
        };
      }

      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
      };
    }
  }

  // Delete an address (soft delete)
  async deleteAddress(addressId: number, userId: number): Promise<AddressResponse> {
    try {
      console.log('Deleting address:', addressId, 'for user:', userId);

      const response = await fetch(`${API_BASE_URL}/api/user-addresses/${addressId}/delete?user_id=${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('Delete address response status:', response.status);

      const responseText = await response.text();
      console.log('Raw delete address response:', responseText);

      // Check if it's HTML error page
      if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
        if (responseText.includes('The action you have requested is not allowed')) {
          throw new Error('Address service unavailable. Please try again later.');
        }
        throw new Error('Service temporarily unavailable.');
      }

      // Parse JSON response
      let result: AddressResponse;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse delete address response:', parseError);
        throw new Error('Invalid response from server');
      }

      console.log('Parsed delete address response:', result);

      if (response.ok && result.success) {
        return result;
      } else {
        return {
          success: false,
          message: result.message || 'Failed to delete address',
        };
      }
    } catch (error) {
      console.error('Error deleting address:', error);

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return {
          success: false,
          message: 'Cannot connect to server. Please check your internet connection.',
        };
      }

      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
      };
    }
  }

  // Set an address as default
  async setDefaultAddress(addressId: number, userId: number): Promise<AddressResponse> {
    try {
      console.log('Setting default address:', addressId, 'for user:', userId);

      const response = await fetch(`${API_BASE_URL}/api/user-addresses/${addressId}/set-default`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      console.log('Set default address response status:', response.status);

      const responseText = await response.text();
      console.log('Raw set default address response:', responseText);

      // Check if it's HTML error page
      if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
        if (responseText.includes('The action you have requested is not allowed')) {
          throw new Error('Address service unavailable. Please try again later.');
        }
        throw new Error('Service temporarily unavailable.');
      }

      // Parse JSON response
      let result: AddressResponse;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse set default response:', parseError);
        throw new Error('Invalid response from server');
      }

      console.log('Parsed set default response:', result);

      if (response.ok && result.success) {
        return result;
      } else {
        return {
          success: false,
          message: result.message || 'Failed to set default address',
        };
      }
    } catch (error) {
      console.error('Error setting default address:', error);

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return {
          success: false,
          message: 'Cannot connect to server. Please check your internet connection.',
        };
      }

      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
      };
    }
  }

  // Helper function to get current user ID
  async getCurrentUserId(): Promise<number | null> {
    try {
      const loggedIn = await isUserLoggedIn();
      if (!loggedIn) return null;

      const userData = await getUserData();
      return userData?.user_id ? parseInt(userData.user_id) : null;
    } catch (error) {
      console.error('Error getting current user ID:', error);
      return null;
    }
  }

  // Convenience method to create address for current user
  async createAddressForCurrentUser(
    addressType: 'home' | 'work' | 'other',
    completeAddress: string,
    isDefault: boolean = false
  ): Promise<AddressResponse> {
    const userId = await this.getCurrentUserId();
    if (!userId) {
      loginModalService.showForAddresses('add addresses');
      return {
        success: true,
        message: 'Login modal shown',
      };
    }

    return this.createAddress({
      user_id: userId,
      address_type: addressType,
      complete_address: completeAddress,
      is_default: isDefault,
    });
  }

  // Convenience method to get addresses for current user
  async getCurrentUserAddresses(addressType?: 'home' | 'work' | 'other'): Promise<AddressResponse> {
    const userId = await this.getCurrentUserId();
    if (!userId) {
      loginModalService.showForAddresses('view addresses');
      return {
        success: true,
        message: 'Login modal shown',
        data: []
      };
    }

    return this.getUserAddresses(userId, addressType);
  }

  // Convenience method to delete address for current user
  async deleteAddressForCurrentUser(addressId: number): Promise<AddressResponse> {
    const userId = await this.getCurrentUserId();
    if (!userId) {
      loginModalService.showForAddresses('delete addresses');
      return {
        success: true,
        message: 'Login modal shown',
      };
    }

    return this.deleteAddress(addressId, userId);
  }

  // Convenience method to set default address for current user
  async setDefaultAddressForCurrentUser(addressId: number): Promise<AddressResponse> {
    const userId = await this.getCurrentUserId();
    if (!userId) {
      loginModalService.showForAddresses('set default address');
      return {
        success: true,
        message: 'Login modal shown',
      };
    }

    return this.setDefaultAddress(addressId, userId);
  }

  // Get address type color for UI
  getAddressTypeColor(type: 'home' | 'work' | 'other'): string {
    const colors = {
      home: '#4CAF50',
      work: '#2196F3',
      other: '#FF9800'
    };
    return colors[type] || colors.other;
  }

  // Get address type background color for UI
  getAddressTypeBackgroundColor(type: 'home' | 'work' | 'other'): string {
    const colors = {
      home: '#E8F5E9',
      work: '#E3F2FD',
      other: '#FFF3E0'
    };
    return colors[type] || colors.other;
  }

  // Format address type for display
  formatAddressType(type: 'home' | 'work' | 'other'): string {
    return type.toUpperCase();
  }

  // Validate address data
  validateAddressData(addressType: string, completeAddress: string): { isValid: boolean; message?: string } {
    if (!addressType || !['home', 'work', 'other'].includes(addressType)) {
      return { isValid: false, message: 'Please select a valid address type' };
    }

    if (!completeAddress || completeAddress.trim().length < 10) {
      return { isValid: false, message: 'Please enter a complete address (minimum 10 characters)' };
    }

    return { isValid: true };
  }
}

export default new AddressService();