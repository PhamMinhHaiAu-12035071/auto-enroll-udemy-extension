import { flow, types } from 'mobx-state-tree';
import { CacheSessionService, SESSION_CACHE_KEYS } from '../services/cache/cache_session_service';
import { UdemyMessageAction } from '../services/udemy/types';
import { ICouponItem } from './CouponModel';

export enum HistoryStep {
  INITIAL = 'initial',
  FIND_COURSE = 'find_course',
  PULL_COURSE = 'pull_course',
  GO_TO_UDEMY = 'go_to_udemy',
}

// Interface for history state
interface HistoryState {
  currentStep: HistoryStep;
}

// Default history state values
const DEFAULT_HISTORY_STATE = {
  currentStep: HistoryStep.INITIAL
};

/**
 * Static helper to get initial values from cache if available,
 * This is used during model instantiation
 */
export const getInitialHistoryState = async (): Promise<HistoryState> => {
  const cachedState = await CacheSessionService.get<HistoryState>(SESSION_CACHE_KEYS.HISTORY_STATE);
  return cachedState || DEFAULT_HISTORY_STATE;
};

// Model cho Coupon
export const HistoryModel = types.model('History', {
  currentStep: types.enumeration('HistoryStep', Object.values(HistoryStep)),
})
.actions(self => {
  // Helper function to cache current history state
  const cacheHistoryState = async () => {
    const historyState: HistoryState = {
      currentStep: self.currentStep
    };
    await CacheSessionService.set<HistoryState>(SESSION_CACHE_KEYS.HISTORY_STATE, historyState);
  };

  return {
    requestBackgroundCheckCoupon: (coupon: ICouponItem) => {
      chrome.runtime.sendMessage({ action: UdemyMessageAction.CHECK_COURSE, coupon });
    },
    setCurrentStep: flow(function* (step: HistoryStep) {
      self.currentStep = step;
      yield cacheHistoryState();
    }),
    
    reset() {
      self.currentStep = HistoryStep.INITIAL;
      cacheHistoryState();
    },
    
    // Load history state from session cache
    loadFromCache: flow(function* () {
      const cachedState = yield CacheSessionService.get<HistoryState>(SESSION_CACHE_KEYS.HISTORY_STATE);
      if (cachedState) {
        self.currentStep = cachedState.currentStep;
        return true;
      }
      return false;
    })
  };
});
