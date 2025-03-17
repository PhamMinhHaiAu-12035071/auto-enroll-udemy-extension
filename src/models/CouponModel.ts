import { Instance, flow, types } from 'mobx-state-tree';
import { CacheSessionService, SESSION_CACHE_KEYS } from '../services/cache/cache_session_service';
import { SupabaseService } from '../services/superbase/superbase_service';
import { RowCoupon } from '../type';
import { HistoryStep } from './HistoryModel';
import { getStore } from './RootStore';


// Model cho Image
const ImageModel = types.model('Image', {
  src: types.string,
  srcset: types.array(types.string),
  width: types.maybe(types.number),
  height: types.maybe(types.number)
});

// Model cho Coupon Item
const CouponItemModel = types.model('CouponItem', {
  id: types.identifier,
  title: types.string,
  link: types.string,
  couponCode: types.string,
  checkTime: types.string,
  rating: types.maybeNull(types.number),
  authors: types.array(types.string),
  enrollStudents: types.maybeNull(types.number),
  language: types.maybeNull(types.string),
  topics: types.array(types.string),
  price: types.maybeNull(types.number),
  duration: types.maybeNull(types.number),
  image: types.maybeNull(ImageModel),
  amountRating: types.maybeNull(types.number)
});

// Coupon Store Model
export const CouponModel = types
  .model('CouponStore', {
    items: types.array(CouponItemModel),
    isFetching: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
  })
  .actions(self => ({
    setItems(coupons: ICouponItem[]) {
      self.items.replace(coupons);
    },
    setFetching(fetching: boolean) {
      self.isFetching = fetching;
    },
    setError(error: string | null) {
      self.error = error;
    },
  }))
  .actions(self => ({
    // Updated fetchCoupons to use only session cache
    fetchCoupons: flow(function* (forceRefresh = false) {
      self.setFetching(true);
      self.setError(null);
      
      // Update history step in RootStore
      const rootStore = getStore();
      rootStore.history.setCurrentStep(HistoryStep.FIND_COURSE);
      
      try {
        // Check session cache first if not forcing refresh
        let coupons = null;
        
        if (!forceRefresh) {
          // Try to get from session cache
          const sessionCachedCoupons = yield CacheSessionService.get<ICouponItem[]>(SESSION_CACHE_KEYS.COUPONS);
          
          if (sessionCachedCoupons) {
            coupons = sessionCachedCoupons;
          }
        }
        
        // Fetch from API if no cache or force refresh
        if (!coupons) {
          const rows: RowCoupon[] = yield SupabaseService.getInstance().getCouponsWithinLimit();
          coupons = rows.map(row => row.coupon) as ICouponItem[];
          
          // Cache the results in session cache
          yield CacheSessionService.set<ICouponItem[]>(SESSION_CACHE_KEYS.COUPONS, coupons);
        }
        
        // Update store with fetched/cached coupons
        self.setItems(coupons);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch coupons';
        self.setError(errorMessage);
      } finally {
        setTimeout(() => {
          self.setFetching(false);
          rootStore.history.setCurrentStep(HistoryStep.PULL_COURSE);
        }, 3_000);
      }
    }),

    // Add reset method
    reset: flow(function* () {
      // Reset store state to initial values
      self.setItems([]);
      self.setFetching(false);
      self.setError(null);
      
      // Clear coupons from session cache
      yield CacheSessionService.remove(SESSION_CACHE_KEYS.COUPONS);
      
      console.log('Coupon store has been reset');
      return true;
    })
  }));

// Type cho instance của CouponItemModel (individual coupon)
export interface ICouponItem extends Instance<typeof CouponItemModel> {}

// Type cho instance của CouponModel (the store)
export interface ICouponStore extends Instance<typeof CouponModel> {}

// Create a default empty store for initialization
export const getInitialCouponStore = async () => {
  const sessionCachedCoupons = await CacheSessionService.get<ICouponItem[]>(SESSION_CACHE_KEYS.COUPONS);
  return CouponModel.create({
    items: sessionCachedCoupons || [],
    isFetching: false,
    error: null
  });
}; 
