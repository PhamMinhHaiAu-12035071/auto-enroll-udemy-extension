import { useState, useEffect } from 'react';
import { RowCoupon } from '../type';
import { SupabaseService } from '../services/superbase/superbase_service';
import { CacheService, CACHE_KEYS } from '../services/cache/cache_service';

interface UseCouponsReturn {
    coupons: RowCoupon[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// Thời gian cache tính bằng milliseconds (ví dụ: 3 ngày)
const CACHE_DURATION = 3 * 24 * 60 * 60 * 1000;

export const useCoupons = (): UseCouponsReturn => {
    const [coupons, setCoupons] = useState<RowCoupon[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCoupons = async (forceRefresh = false) => {
        setIsLoading(true);
        setError(null);
        
        try {
            // Kiểm tra cache nếu không yêu cầu refresh
            if (!forceRefresh) {
                const cachedCoupons = await CacheService.get<RowCoupon[]>(CACHE_KEYS.COUPONS, CACHE_DURATION);
                if (cachedCoupons) {
                    setCoupons(cachedCoupons);
                    setIsLoading(false);
                    return;
                }
            }
            
            // Nếu không có cache hoặc yêu cầu refresh, lấy dữ liệu từ Supabase
            const data = await SupabaseService.getInstance().getCouponsWithinLimit();
            setCoupons(data);
            
            // Lưu dữ liệu vào cache
            await CacheService.set(CACHE_KEYS.COUPONS, data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch coupons');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []); // Chỉ fetch một lần khi component mount

    return {
        coupons,
        isLoading,
        error,
        refetch: () => fetchCoupons(true) // Truyền true để bỏ qua cache khi refetch
    };
}; 