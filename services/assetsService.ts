export interface Banner {
  id: number;
  banner_number: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface AppAssets {
  logo: {
    logo_url: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
  banners: Banner[];
}

export interface AssetsResponse {
  success: boolean;
  message: string;
  data: AppAssets;
}

interface CacheEntry {
  data: AssetsResponse;
  timestamp: number;
}

const API_BASE_URL = 'https://hmis.rapidreporting.us';
const CACHE_KEY = 'app_assets_cache';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

class AssetsCache {
  private cache: Map<string, CacheEntry> = new Map();

  set(key: string, data: AssetsResponse): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key: string): AssetsResponse | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  isExpired(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return true;
    return Date.now() - entry.timestamp > CACHE_DURATION;
  }
}

const assetsCache = new AssetsCache();

export const fetchAppHomeAssets = async (forceRefresh: boolean = false): Promise<AssetsResponse> => {
  try {
    if (!forceRefresh) {
      const cachedData = assetsCache.get(CACHE_KEY);
      if (cachedData) {
        console.log('✅ Assets loaded from cache');
        return cachedData;
      }
    }

    console.log('Fetching app home assets from API...');

    const response = await fetch(`${API_BASE_URL}/api/app-assets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('Assets API response status:', response.status);

    const responseText = await response.text();
    console.log('Raw assets response:', responseText);

    if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
      if (responseText.includes('The action you have requested is not allowed')) {
        throw new Error('Assets service unavailable. Please try again later.');
      }
      throw new Error('Service temporarily unavailable.');
    }

    let result: AssetsResponse;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse assets response:', parseError);
      throw new Error('Invalid response from server');
    }

    console.log('Parsed assets response:', result);

    if (!response.ok) {
      throw new Error(result.message || `Failed to fetch assets: ${response.status}`);
    }

    if (result.hasOwnProperty('success') && !result.success) {
      throw new Error(result.message || 'Failed to fetch assets');
    }

    assetsCache.set(CACHE_KEY, result);
    console.log('✅ Assets loaded successfully and cached for 1 hour');

    return result;

  } catch (error) {
    console.error('❌ Assets API error:', error);
    throw error;
  }
};

export const clearAssetsCache = (): void => {
  assetsCache.clear();
  console.log('Assets cache cleared');
};

export const isAssetsCacheExpired = (): boolean => {
  return assetsCache.isExpired(CACHE_KEY);
};

export const getAssetsCacheStatus = (): { cached: boolean; expired: boolean } => {
  const cached = assetsCache.get(CACHE_KEY) !== null;
  const expired = assetsCache.isExpired(CACHE_KEY);
  return { cached, expired };
};