import { Instance, flow, types } from 'mobx-state-tree';
import { CouponModel, getInitialCouponStore } from './CouponModel';
import { HistoryModel, getInitialHistoryState } from './HistoryModel';
import { PersistentRouterModel, getInitialRouterState } from './PersistentRouterModel';
import { CacheSessionService } from '../services/cache/cache_session_service';
import { reportStore } from '../services/udemy/report_store';


// Root Store
export const RootStore = types
  .model('RootStore', {
    couponStore: CouponModel,
    history: HistoryModel,
    persistentRouter: PersistentRouterModel
  })
  .actions(self => ({
    initializeFromCache: flow(function* () {
      // Load router state from cache
      yield self.persistentRouter.loadFromCache();
      
      // Load history state from cache
      yield self.history.loadFromCache();
    }),
    
    clearAllData: () => {
      try {
        // Reset each substore to its initial state
        if (self.couponStore.reset) {
           self.couponStore.reset();
        }
        
        if (self.history.reset) {
          self.history.reset();
        }
        
        if (self.persistentRouter.reset) {
          self.persistentRouter.reset();
        }
        
        // Clear all session cache
        CacheSessionService.clear();

        // Clear all report data
        reportStore.resetReport();
        
        console.log('All data has been cleared successfully');
        return true;
      } catch (error) {
        console.error('Failed to clear data:', error);
        return false;
      }
    },
  }));

// Type cho instance của RootStore
export interface IRootStore extends Instance<typeof RootStore> {}

// Tạo instance của store
let _store: IRootStore | undefined;


// Alternative async initialization that waits for cache before creating store
export const initializeStoreAsync = async () => {
  // Get cached router state
  const initialCoupons = await getInitialCouponStore();
  const initialRouterState = await getInitialRouterState();
  const initialHistoryState = await getInitialHistoryState();

  _store = RootStore.create({
    couponStore: initialCoupons,
    history: initialHistoryState,
    persistentRouter: initialRouterState
  });
  
  return _store;
}

export const getStore = () => _store!;

// For asynchronous initialization
export const getStoreAsync = async () => {
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