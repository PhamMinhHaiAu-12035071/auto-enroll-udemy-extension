import { flow, types } from 'mobx-state-tree';
import { CacheSessionService, SESSION_CACHE_KEYS } from '../services/cache/cache_session_service';

export enum Screen {
  INITIAL = 'initial',
  HOME = 'home',
  ADD_COURSE = 'add_course',
}

export enum BottomTab {
  INITIAL = 'initial',
  COURSE = 'course',
  HISTORY = 'history',
  ANALYTICS = 'analytics',
}

// Interface for router state
interface RouterState {
  currentScreen: Screen;
  activeBottomTab: BottomTab;
}

// Default router state values
const DEFAULT_ROUTER_STATE = {
  currentScreen: Screen.INITIAL,
  activeBottomTab: BottomTab.INITIAL
};

/**
 * Static helper to get initial values from cache if available,
 * This is used during model instantiation
 */
export const getInitialRouterState = async (): Promise<RouterState> => {
  const cachedState = await CacheSessionService.get<RouterState>(SESSION_CACHE_KEYS.NAVIGATION_STATE);
  return cachedState || DEFAULT_ROUTER_STATE;
};

// Model cho Coupon
export const PersistentRouterModel = types.model('PersistentRouter', {
  currentScreen: types.enumeration('Screen', Object.values(Screen)),
  activeBottomTab: types.enumeration('BottomTab', Object.values(BottomTab)),
})
.views(self => ({
  get defaultScreen() {
    return Screen.INITIAL;
  }
}))
.actions(self => {
  // Helper function to cache current router state
  const cacheRouterState = () => {
    const routerState: RouterState = {
      currentScreen: self.currentScreen,
      activeBottomTab: self.activeBottomTab
    };
    CacheSessionService.set(SESSION_CACHE_KEYS.NAVIGATION_STATE, routerState);
  };

  return {
    setCurrentScreen(screen: Screen) {
      self.currentScreen = screen;
      cacheRouterState();
    },
    
    setActiveBottomTab(tab: BottomTab) {
      self.activeBottomTab = tab;
      cacheRouterState();
    },
    
    reset() {
      self.currentScreen = Screen.INITIAL;
      self.activeBottomTab = BottomTab.INITIAL;
      cacheRouterState();
    },
    
    // Load router state from session cache
    loadFromCache: flow(function* () {
      const cachedState = yield CacheSessionService.get<RouterState>(SESSION_CACHE_KEYS.NAVIGATION_STATE);
      if (cachedState) {
        self.currentScreen = cachedState.currentScreen;
        self.activeBottomTab = cachedState.activeBottomTab;
        return true;
      }
      return false;
    })
  };
});
