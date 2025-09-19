
export interface Test {
  id: number | string; // Handle both string and number IDs from different APIs
  name: string;
  code: string;
  price: number;
  is_active: number;
  sort_order: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AllTest {
  id: number;
  code: string;
  name: string;
  type: string;
  category: string;
  report_title: string;
  price: number;
  discount_percentage?: number;
  has_sub_tests: boolean;
  status: string;
  image_url: string;
  date_added: string;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
  next_page: number | null;
  prev_page: number | null;
}

export interface TestsResponse {
  success: boolean;
  message: string;
  data: Test[];
  count: number;
}

export interface AllTestsResponse {
  success: boolean;
  message: string;
  data: AllTest[];
  pagination: Pagination;
}

const API_BASE_URL = 'https://hmis.rapidreporting.us';

export interface FetchAllTestsParams {
  page?: number;
  limit?: number;
  type?: string;
}

export const fetchAllTests = async (params: FetchAllTestsParams = {}): Promise<AllTestsResponse> => {
  const { page = 1, limit = 20, type = "all" } = params;

  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      type: type // Filter tests by type: "all", "pathology", or "general"
    });

    const url = `${API_BASE_URL}/api/all-tests?${queryParams}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const responseText = await response.text();

    console.log('========== ALL TESTS API ==========');
    console.log('📄 Raw Response:', responseText);

    if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
      if (responseText.includes('The action you have requested is not allowed')) {
        throw new Error('Tests service unavailable. Please try again later.');
      }
      throw new Error('Service temporarily unavailable.');
    }

    let result: AllTestsResponse;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError);
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.message || `Failed to fetch tests: ${response.status}`);
    }

    if (result.hasOwnProperty('success') && !result.success) {
      throw new Error(result.message || 'Failed to fetch tests');
    }

    console.log('====================================');

    return result;

  } catch (error) {
    console.error('❌ fetchAllTests error:', error);
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

// Helper function for CartTest (handles optional is_active)
export const getCartTestImage = (test: { image_url: string | null }) => {
  return { uri: test.image_url || 'https://via.placeholder.com/150?text=Test+Image' };
};

// Helper function to get image URL or fallback
export const getTestImageUrl = (test: Test): string => {
  return test.image_url || 'https://via.placeholder.com/150?text=Test+Image';
};