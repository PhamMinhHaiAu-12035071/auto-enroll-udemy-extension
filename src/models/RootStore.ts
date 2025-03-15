import { types, Instance, flow } from 'mobx-state-tree';
import { SupabaseService } from '../services/superbase/superbase_service';
import { CacheService, CACHE_KEYS } from '../services/cache/cache_service';
import { RowCoupon } from '../type';
import { CouponModel, ICoupon } from './CouponModel';
import { HistoryModel, HistoryStep } from './HistoryModel';

// Thời gian cache tính bằng milliseconds (3 ngày)
const CACHE_DURATION = 3 * 24 * 60 * 60 * 1000;

// Root Store
export const RootStore = types
  .model('RootStore', {
    coupons: types.array(CouponModel),
    isFetching: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
    history: types.optional(HistoryModel, { currentStep: HistoryStep.INITIAL })
  })
  .actions(self => ({
    setCoupons(coupons: ICoupon[]) {
      self.coupons.replace(coupons);
    },
    setFetching(fetching: boolean) {
      self.isFetching = fetching;
    },
    setError(error: string | null) {
      self.error = error;
    }
  }))
  .actions(self => ({
    // Sử dụng flow để xử lý async actions
    fetchCoupons: flow(function* (forceRefresh = false) {
      self.setFetching(true);
      self.history.setCurrentStep(HistoryStep.FIND_COURSE);
      self.setError(null);
      
      try {
        // Check cache first if not forcing refresh
        let coupons = null;
        
        if (!forceRefresh) {
          const cachedCoupons = yield CacheService.get(CACHE_KEYS.COUPONS, CACHE_DURATION);
          
          if (cachedCoupons) {
            coupons = cachedCoupons;
          }
        }
        
        // Fetch from API if no cache or force refresh
        if (!coupons) {
          const rows: RowCoupon[] = yield SupabaseService.getInstance().getCouponsWithinLimit(true);
          coupons = rows.map(row => row.coupon) as ICoupon[];
          
          // Cache the results
          yield CacheService.set(CACHE_KEYS.COUPONS, coupons);
        }
        
        // Update store with fetched/cached coupons
        self.setCoupons(coupons);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch coupons';
        self.setError(errorMessage);
      } finally {
        setTimeout(() => {
          self.setFetching(false);
          self.history.setCurrentStep(HistoryStep.PULL_COURSE);
          setTimeout(() => {
            self.history.setCurrentStep(HistoryStep.GO_TO_UDEMY);
          }, 3_000);
        }, 3_000);
      }
    }),
  }));

// Type cho instance của RootStore
export interface IRootStore extends Instance<typeof RootStore> {}

// Tạo instance của store
let _store: IRootStore | undefined;

export function initializeStore() {
  _store = RootStore.create({
    coupons: [],
    isFetching: true,
    error: null,
    history: { currentStep: HistoryStep.INITIAL }
  });
  
  return _store;
}

export function getStore() {
  if (!_store) {
    _store = initializeStore();
  }
  return _store;
}

if (module.hot) {
  module.hot.dispose(() => {
    _store = undefined; // Clear the store reference on hot reload
  });
  module.hot.accept();
} 