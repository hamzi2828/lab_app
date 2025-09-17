export interface Test {
  id: number;
  name: string;
  code: string;
  price: number;
  is_active: number;
  sort_order: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface TestsResponse {
  success: boolean;
  message: string;
  data: Test[];
  count: number;
}

const API_BASE_URL = 'https://hmis.rapidreporting.us'; // Replace with your actual domain



export const fetchAppHomeAssets = async (): Promise<any> => {
  try {
    console.log('Fetching app home tests...');

    const response = await fetch(`${API_BASE_URL}/api/app-assets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('Tests API response status:', response.status);

    // Get response text first
    const responseText = await response.text();
    console.log('Raw tests response:', responseText);

    // Check if it's HTML error page
    if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
      if (responseText.includes('The action you have requested is not allowed')) {
        throw new Error('Tests service unavailable. Please try again later.');
      }
      throw new Error('Service temporarily unavailable.');
    }

    // Parse JSON response
    let result: any;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse tests response:', parseError);
      throw new Error('Invalid response from server');
    }

    console.log('Full API Response:', JSON.stringify(result, null, 2));

    // Handle different response scenarios
    if (!response.ok) {
      throw new Error(result.message || `Failed to fetch tests: ${response.status}`);
    }

    if (result.hasOwnProperty('success') && !result.success) {
      throw new Error(result.message || 'Failed to fetch tests');
    }

    console.log('✅ ✅ ✅ ✅ APP Assets loaded successfully');

    return result;

  } catch (error) {
    console.error('❌ API error:', error);
    throw error;
  }
};



export const fetchAppHomeTests = async (limit: number = 6): Promise<TestsResponse> => {
  try {
    console.log('Fetching app home tests...');

    const response = await fetch(`${API_BASE_URL}/api/app-home-tests`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('Tests API response status:', response.status);

    // Get response text first
    const responseText = await response.text();
    console.log('Raw tests response:', responseText);

    // Check if it's HTML error page
    if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
      if (responseText.includes('The action you have requested is not allowed')) {
        throw new Error('Tests service unavailable. Please try again later.');
      }
      throw new Error('Service temporarily unavailable.');
    }

    // Parse JSON response
    let result: TestsResponse;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse tests response:', parseError);
      throw new Error('Invalid response from server');
    }

    console.log('Parsed tests response:', result);

    // Handle different response scenarios
    if (!response.ok) {
      throw new Error(result.message || `Failed to fetch tests: ${response.status}`);
    }

    if (result.hasOwnProperty('success') && !result.success) {
      throw new Error(result.message || 'Failed to fetch tests');
    }

    // Limit the results
    result.data = result.data.slice(0, limit);
    console.log('✅ API data loaded successfully');

    return result;

  } catch (error) {
    console.error('❌ API error:', error);
    throw error;
  }
};

// Helper function to format price
export const formatPrice = (price: number): string => {
  return `Rs ${price.toLocaleString()}`;
};

// Helper function to calculate discounted price
export const calculateDiscountedPrice = (price: number, discountPercent: number = 20): string => {
  const discounted = price * (1 - discountPercent / 100);
  return formatPrice(discounted);
};

// Helper function to calculate discount percentage
export const calculateDiscount = (originalPrice: number, discountedPrice: number): string => {
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return `${Math.round(discount)}% off`;
};

// Helper function to get test image
export const getTestImage = (test: Test) => {
  return { uri: test.image_url || 'https://via.placeholder.com/150?text=Test+Image' };
};

// Helper function to get image URL or fallback
export const getTestImageUrl = (test: Test): string => {
  return test.image_url || 'https://via.placeholder.com/150?text=Test+Image';
};