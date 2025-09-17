import AsyncStorage from '@react-native-async-storage/async-storage';
import { AllTest, Test } from './testsService';

// Unified test interface for cart (supports both API formats)
export interface CartTest {
  id: number; // Always store as number for consistency
  name: string;
  code: string;
  price: number;
  image_url: string | null;
  // Optional fields from different APIs
  type?: string;
  category?: string;
  report_title?: string;
  has_sub_tests?: boolean;
  status?: string;
  date_added?: string;
  is_active?: number;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
  // Cart-specific fields
  originalPrice: string;
  discountedPrice: string;
  badges: string[];
}

export interface CartItem {
  id: string;
  title: string;
  image: any;
  originalPrice: string;
  discountedPrice: string;
  badges: string[];
}

const CART_STORAGE_KEY = 'bookedTestsDetails';

class CartService {

  /**
   * Get all items in the cart
   */
  async getCartItems(): Promise<CartTest[]> {
    try {
      const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const tests = JSON.parse(stored);
        // Return unique tests by ID, with images first
        return this.sortCartItems(this.removeDuplicates(tests));
      }
      return [];
    } catch (error) {
      console.error('Error getting cart items:', error);
      return [];
    }
  }

  /**
   * Add a test to the cart (supports both Test and AllTest formats)
   */
  async addToCart(test: AllTest | Test, originalPrice: string, discountedPrice: string, badges: string[] = ['20% off']): Promise<boolean> {
    try {
      const cartItems = await this.getCartItems();

      // Check if test is already in cart
      if (cartItems.some(item => item.id === test.id)) {
        console.log('Test already in cart:', test.name);
        return false;
      }

      const cartTest: CartTest = {
        ...test,
        id: typeof test.id === 'string' ? parseInt(test.id, 10) : test.id, // Normalize ID to number
        originalPrice,
        discountedPrice,
        badges
      };

      cartItems.push(cartTest);
      await this.saveCartItems(cartItems);
      console.log('Added to cart:', test.name);
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  }

  /**
   * Remove a test from the cart (handles both string and number IDs)
   */
  async removeFromCart(testId: number | string): Promise<boolean> {
    try {
      const cartItems = await this.getCartItems();
      const normalizedTestId = typeof testId === 'string' ? parseInt(testId, 10) : testId;
      const updatedItems = cartItems.filter(item => item.id !== normalizedTestId);
      await this.saveCartItems(updatedItems);
      console.log('Removed from cart:', testId);
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  }

  /**
   * Check if a test is in the cart (handles both string and number IDs)
   */
  async isInCart(testId: number | string): Promise<boolean> {
    try {
      const cartItems = await this.getCartItems();
      const normalizedTestId = typeof testId === 'string' ? parseInt(testId, 10) : testId;
      return cartItems.some(item => item.id === normalizedTestId);
    } catch (error) {
      console.error('Error checking cart status:', error);
      return false;
    }
  }

  /**
   * Get array of booked test IDs
   */
  async getBookedTestIds(): Promise<number[]> {
    try {
      const cartItems = await this.getCartItems();
      return cartItems.map(item => item.id);
    } catch (error) {
      console.error('Error getting booked test IDs:', error);
      return [];
    }
  }

  /**
   * Toggle test booking status (supports both Test and AllTest formats)
   */
  async toggleBooking(test: AllTest | Test, originalPrice: string, discountedPrice: string, badges: string[] = ['20% off']): Promise<boolean> {
    try {
      const testId = typeof test.id === 'string' ? parseInt(test.id, 10) : test.id;
      const isBooked = await this.isInCart(testId);

      if (isBooked) {
        return await this.removeFromCart(testId);
      } else {
        return await this.addToCart(test, originalPrice, discountedPrice, badges);
      }
    } catch (error) {
      console.error('Error toggling booking:', error);
      return false;
    }
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
      console.log('Cart cleared');
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  }

  /**
   * Get cart item count
   */
  async getCartCount(): Promise<number> {
    try {
      const cartItems = await this.getCartItems();
      return cartItems.length;
    } catch (error) {
      console.error('Error getting cart count:', error);
      return 0;
    }
  }

  /**
   * Calculate total cart value
   */
  async getCartTotal(): Promise<number> {
    try {
      const cartItems = await this.getCartItems();
      return cartItems.reduce((total, test) => {
        const price = parseFloat(test.discountedPrice?.replace(/[^\d.]/g, '') || test.price?.toString() || '0');
        return total + price;
      }, 0);
    } catch (error) {
      console.error('Error calculating cart total:', error);
      return 0;
    }
  }

  /**
   * Private: Remove duplicates by test ID
   */
  private removeDuplicates(tests: CartTest[]): CartTest[] {
    return tests.filter((test, index, self) =>
      index === self.findIndex(t => t.id === test.id)
    );
  }

  /**
   * Private: Sort cart items - tests with images first
   */
  private sortCartItems(tests: CartTest[]): CartTest[] {
    return tests.sort((a, b) => {
      const aHasImage = a.image_url && a.image_url.trim() !== '';
      const bHasImage = b.image_url && b.image_url.trim() !== '';

      if (aHasImage && !bHasImage) return -1; // a comes first
      if (!aHasImage && bHasImage) return 1;  // b comes first
      return 0; // maintain original order for tests with same image status
    });
  }

  /**
   * Private: Save cart items to storage
   */
  private async saveCartItems(items: CartTest[]): Promise<void> {
    const uniqueItems = this.removeDuplicates(items);
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(uniqueItems));
  }
}

// Create and export singleton instance
export const cartService = new CartService();
export default cartService;