import { Instance, flow, types } from 'mobx-state-tree';
import { CACHE_KEYS, CacheService } from '../services/cache/cache_service';
import { SupabaseService } from '../services/superbase/superbase_service';
import { RowCoupon } from '../type';
import { CouponModel, ICoupon } from './CouponModel';
import { HistoryModel, HistoryStep } from './HistoryModel';
import { BottomTab, PersistentRouterModel, Screen, getInitialRouterState } from './PersistentRouterModel';

// Thời gian cache tính bằng milliseconds (3 ngày)
const CACHE_DURATION = 3 * 24 * 60 * 60 * 1000;

// Root Store
export const RootStore = types
  .model('RootStore', {
    coupons: types.array(CouponModel),
    isFetching: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
    history: types.optional(HistoryModel, { currentStep: HistoryStep.INITIAL }),
    persistentRouter: types.optional(PersistentRouterModel, {currentScreen: Screen.INITIAL, activeBottomTab: BottomTab.INITIAL})
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
    },
    initializeFromCache: flow(function* () {
      // Load router state from cache
      yield self.persistentRouter.loadFromCache();
    })
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

          console.log('get coupons from supabase');
          console.log(coupons);
          
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

// Initialize store with default values first, then load from cache
export function initializeStore() {
  _store = RootStore.create({
    coupons: [],
    isFetching: true,
    error: null,
    history: { currentStep: HistoryStep.INITIAL },
    persistentRouter: { currentScreen: Screen.INITIAL, activeBottomTab: BottomTab.INITIAL }
  });
  
  // Load cached router state after initialization
  _store.initializeFromCache();
  
  return _store;
}

// Alternative async initialization that waits for cache before creating store
export async function initializeStoreAsync() {
  // Get cached router state
  const initialRouterState = await getInitialRouterState();
  
  _store = RootStore.create({
    coupons: [],
    isFetching: true,
    error: null,
    history: { currentStep: HistoryStep.INITIAL },
    persistentRouter: initialRouterState
  });
  
  return _store;
}

export function getStore() {
  if (!_store) {
    _store = initializeStore();
  }
  return _store;
}

// For asynchronous initialization
export async function getStoreAsync() {
  if (!_store) {
    _store = await initializeStoreAsync();
  }
  return _store;
}

if (module.hot) {
  module.hot.dispose(() => {
    _store = undefined; // Clear the store reference on hot reload
  });
  module.hot.accept();
} 