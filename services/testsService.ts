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
  usingFallback?: boolean;
}

const API_BASE_URL = 'https://hmis.rapidreporting.us'; // Replace with your actual domain

// Static fallback data
const staticTestData: Test[] = [
  {
    id: 1,
    name: "Complete Blood Count",
    code: "CBC001",
    price: 449,
    is_active: 1,
    sort_order: 1,
    image_url: null,
    created_at: "2024-01-15 10:30:00",
    updated_at: "2024-01-15 10:30:00"
  },
  {
    id: 2,
    name: "Hemoglobin A1C",
    code: "HBA1C001",
    price: 999,
    is_active: 1,
    sort_order: 2,
    image_url: null,
    created_at: "2024-01-15 11:00:00",
    updated_at: "2024-01-15 11:00:00"
  },
  {
    id: 3,
    name: "LFT",
    code: "LFT001",
    price: 599,
    is_active: 1,
    sort_order: 3,
    image_url: null,
    created_at: "2024-01-15 11:30:00",
    updated_at: "2024-01-15 11:30:00"
  },
  {
    id: 4,
    name: "Lipid Profile",
    code: "LP001",
    price: 699,
    is_active: 1,
    sort_order: 4,
    image_url: null,
    created_at: "2024-01-15 12:00:00",
    updated_at: "2024-01-15 12:00:00"
  },
  {
    id: 5,
    name: "Renal Function Test",
    code: "RFT001",
    price: 1299,
    is_active: 1,
    sort_order: 5,
    image_url: null,
    created_at: "2024-01-15 12:30:00",
    updated_at: "2024-01-15 12:30:00"
  },
  {
    id: 6,
    name: "TSH",
    code: "TSH001",
    price: 899,
    is_active: 1,
    sort_order: 6,
    image_url: null,
    created_at: "2024-01-15 13:00:00",
    updated_at: "2024-01-15 13:00:00"
  },
];

// Static images mapping
export const staticImages: { [key: string]: any } = {
  "Complete Blood Count": require("../assets/tests/CBC.png"),
  "Hemoglobin A1C": require("../assets/tests/HBA1C.png"),
  "LFT": require("../assets/tests/LFT.png"),
  "Lipid Profile": require("../assets/tests/LP.png"),
  "Renal Function Test": require("../assets/tests/RFT.png"),
  "TSH": require("../assets/tests/TSH.png"),
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
    result.usingFallback = false;
    console.log('✅ API data loaded successfully');

    return result;

  } catch (error) {
    console.error('❌ API error, using fallback data:', error);

    // Return fallback data instead of throwing error
    return {
      success: true,
      message: 'Using offline data',
      data: staticTestData.slice(0, limit),
      count: staticTestData.length,
      usingFallback: true
    };
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

// Helper function to get test image (static or API)
export const getTestImage = (test: Test, usingFallback: boolean = false) => {
  // Use local static images for fallback, API images for real data
  if (usingFallback && staticImages[test.name]) {
    return staticImages[test.name];
  }
  // Use API image or fallback URL
  return { uri: test.image_url || 'https://via.placeholder.com/150?text=Test+Image' };
};

// Helper function to get image URL or fallback
export const getTestImageUrl = (test: Test): string => {
  return test.image_url || 'https://via.placeholder.com/150?text=Test+Image';
};