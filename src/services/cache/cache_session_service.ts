interface SessionCacheData<T> {
    data: T;
    timestamp: number;
}

// Default session cache duration: 30 minutes (in milliseconds)
const DEFAULT_SESSION_CACHE_DURATION = 30 * 60 * 1000;

/**
 * Check if chrome.storage.session API is available
 */
const isChromeSessionStorageAvailable = (): boolean => {
    return typeof chrome !== 'undefined' && !!chrome.storage && !!chrome.storage.session;
};

/**
 * Service for managing session-based cache data for the extension
 * Session cache is cleared when the browser is closed
 */
export class CacheSessionService {
    // Temporary in-memory cache (fallback when chrome.storage.session isn't available)
    private static memoryCache: Record<string, SessionCacheData<any>> = {};

    /**
     * Store data in the session cache
     * @param key Cache key
     * @param data Data to cache
     */
    static async set<T>(key: string, data: T): Promise<void> {
        const cacheData: SessionCacheData<T> = {
            data,
            timestamp: Date.now()
        };
        
        if (isChromeSessionStorageAvailable()) {
            return new Promise((resolve) => {
                chrome.storage.session.set({ [key]: cacheData }, () => {
                    resolve();
                });
            });
        } else {
            // Fallback: store in memory
            console.warn('Chrome session storage API not available, using memory cache instead');
            CacheSessionService.memoryCache[key] = cacheData;
            return Promise.resolve();
        }
    }

    /**
     * Retrieve data from session cache if still valid
     * @param key Cache key
     * @param duration Validity duration for the cache (ms)
     * @returns Cached data or null if not found or expired
     */
    static async get<T>(key: string, duration = DEFAULT_SESSION_CACHE_DURATION): Promise<T | null> {
        if (isChromeSessionStorageAvailable()) {
            return new Promise((resolve) => {
                chrome.storage.session.get(key, (result) => {
                    const cacheData = result[key] as SessionCacheData<T> | undefined;
                    
                    // Check if cache exists and is still valid
                    if (cacheData && Date.now() - cacheData.timestamp < duration) {
                        resolve(cacheData.data);
                    } else {
                        resolve(null);
                    }
                });
            });
        } else {
            // Fallback: retrieve from memory
            console.warn('Chrome session storage API not available, using memory cache instead');
            const cacheData = CacheSessionService.memoryCache[key] as SessionCacheData<T> | undefined;
            
            if (cacheData && Date.now() - cacheData.timestamp < duration) {
                return cacheData.data;
            }
            return null;
        }
    }

    /**
     * Remove data from session cache
     * @param key Cache key to remove
     */
    static async remove(key: string): Promise<void> {
        if (isChromeSessionStorageAvailable()) {
            return new Promise((resolve) => {
                chrome.storage.session.remove(key, () => {
                    resolve();
                });
            });
        } else {
            // Fallback: remove from memory
            delete CacheSessionService.memoryCache[key];
            return Promise.resolve();
        }
    }

    /**
     * Clear all session cache data
     */
    static async clear(): Promise<void> {
        if (isChromeSessionStorageAvailable()) {
            return new Promise((resolve) => {
                chrome.storage.session.clear(() => {
                    resolve();
                });
            });
        } else {
            // Fallback: clear everything from memory
            CacheSessionService.memoryCache = {};
            return Promise.resolve();
        }
    }
}

// Specific session cache keys for the application
export const SESSION_CACHE_KEYS = {
    NAVIGATION_STATE: 'navigationStateSession',
    HISTORY_STATE: 'historyStateSession',
    COUPONS: 'couponsSession',
    REPORT_DATA: 'reportDataSession'
};
