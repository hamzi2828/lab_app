import AsyncStorage from '@react-native-async-storage/async-storage';

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
  async set(key: string, data: AssetsResponse): Promise<void> {
    try {
      const cacheEntry: CacheEntry = {
        data,
        timestamp: Date.now()
      };
      await AsyncStorage.setItem(key, JSON.stringify(cacheEntry));
    } catch (error) {
      // Silent error for caching
    }
  }

  async get(key: string): Promise<AssetsResponse | null> {
    try {
      const cachedData = await AsyncStorage.getItem(key);
      if (!cachedData) return null;

      const entry: CacheEntry = JSON.parse(cachedData);
      const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;

      if (isExpired) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      return null;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CACHE_KEY);
    } catch (error) {
      // Silent error for cache clearing
    }
  }

  async isExpired(key: string): Promise<boolean> {
    try {
      const cachedData = await AsyncStorage.getItem(key);
      if (!cachedData) return true;

      const entry: CacheEntry = JSON.parse(cachedData);
      return Date.now() - entry.timestamp > CACHE_DURATION;
    } catch (error) {
      return true;
    }
  }
}

const assetsCache = new AssetsCache();

export const fetchAppHomeAssets = async (forceRefresh: boolean = false): Promise<AssetsResponse> => {
  try {
    if (!forceRefresh) {
      const cachedData = await assetsCache.get(CACHE_KEY);
      if (cachedData) {
        return cachedData;
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/app-assets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const responseText = await response.text();

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
      // Parse error
      throw new Error('Invalid response from server');
    }

    console.log('✅✅✅✅✅✅✅Full API Response:', JSON.stringify(result, null, 2));

    if (!response.ok) {
      throw new Error(result.message || `Failed to fetch assets: ${response.status}`);
    }

    if (result.hasOwnProperty('success') && !result.success) {
      throw new Error(result.message || 'Failed to fetch assets');
    }

    await assetsCache.set(CACHE_KEY, result);

    return result;

  } catch (error) {
    throw error;
  }
};

export const clearAssetsCache = async (): Promise<void> => {
  await assetsCache.clear();
};

export const clearAllAsyncStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
    console.log('✅ All AsyncStorage data cleared successfully');
  } catch (error) {
    console.error('❌ Failed to clear AsyncStorage:', error);
  }
};

export const isAssetsCacheExpired = async (): Promise<boolean> => {
  return await assetsCache.isExpired(CACHE_KEY);
};

export const getAssetsCacheStatus = async (): Promise<{ cached: boolean; expired: boolean }> => {
  const cached = (await assetsCache.get(CACHE_KEY)) !== null;
  const expired = await assetsCache.isExpired(CACHE_KEY);
  return { cached, expired };
};