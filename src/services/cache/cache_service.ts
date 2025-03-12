interface CacheData<T> {
    data: T;
    timestamp: number;
}

// Thời gian cache mặc định: 3 ngày (tính bằng milliseconds)
const DEFAULT_CACHE_DURATION = 3 * 24 * 60 * 60 * 1000;

/**
 * Kiểm tra xem chrome.storage API có khả dụng không
 */
const isChromeStorageAvailable = (): boolean => {
    return typeof chrome !== 'undefined' && !!chrome.storage && !!chrome.storage.local;
};

/**
 * Service quản lý cache cho dữ liệu của extension
 */
export class CacheService {
    // Cache tạm thời trong bộ nhớ (fallback khi chrome.storage không khả dụng)
    private static memoryCache: Record<string, CacheData<any>> = {};

    /**
     * Lưu dữ liệu vào cache
     * @param key Khóa cache
     * @param data Dữ liệu cần lưu
     */
    static async set<T>(key: string, data: T): Promise<void> {
        const cacheData: CacheData<T> = {
            data,
            timestamp: Date.now()
        };
        
        if (isChromeStorageAvailable()) {
            return new Promise((resolve) => {
                chrome.storage.local.set({ [key]: cacheData }, () => {
                    resolve();
                });
            });
        } else {
            // Fallback: lưu vào bộ nhớ
            console.warn('Chrome storage API not available, using memory cache instead');
            CacheService.memoryCache[key] = cacheData;
            return Promise.resolve();
        }
    }

    /**
     * Lấy dữ liệu từ cache nếu còn hiệu lực
     * @param key Khóa cache
     * @param duration Thời gian hiệu lực của cache (ms)
     * @returns Dữ liệu cache hoặc null nếu không có hoặc hết hạn
     */
    static async get<T>(key: string, duration = DEFAULT_CACHE_DURATION): Promise<T | null> {
        if (isChromeStorageAvailable()) {
            return new Promise((resolve) => {
                chrome.storage.local.get(key, (result) => {
                    const cacheData = result[key] as CacheData<T> | undefined;
                    
                    // Kiểm tra xem cache có tồn tại và còn hiệu lực không
                    if (cacheData && Date.now() - cacheData.timestamp < duration) {
                        resolve(cacheData.data);
                    } else {
                        resolve(null);
                    }
                });
            });
        } else {
            // Fallback: lấy từ bộ nhớ
            console.warn('Chrome storage API not available, using memory cache instead');
            const cacheData = CacheService.memoryCache[key] as CacheData<T> | undefined;
            
            if (cacheData && Date.now() - cacheData.timestamp < duration) {
                return cacheData.data;
            }
            return null;
        }
    }

    /**
     * Xóa dữ liệu cache
     * @param key Khóa cache cần xóa
     */
    static async remove(key: string): Promise<void> {
        if (isChromeStorageAvailable()) {
            return new Promise((resolve) => {
                chrome.storage.local.remove(key, () => {
                    resolve();
                });
            });
        } else {
            // Fallback: xóa từ bộ nhớ
            delete CacheService.memoryCache[key];
            return Promise.resolve();
        }
    }

    /**
     * Xóa tất cả dữ liệu cache
     */
    static async clear(): Promise<void> {
        if (isChromeStorageAvailable()) {
            return new Promise((resolve) => {
                chrome.storage.local.clear(() => {
                    resolve();
                });
            });
        } else {
            // Fallback: xóa tất cả từ bộ nhớ
            CacheService.memoryCache = {};
            return Promise.resolve();
        }
    }
}

// Cache keys cụ thể cho ứng dụng
export const CACHE_KEYS = {
    COUPONS: 'couponsCache'
}; 