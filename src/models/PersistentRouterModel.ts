import { types } from 'mobx-state-tree';

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
// Model cho Coupon
export const PersistentRouterModel = types.model('PersistentRouter', {
  currentScreen: types.enumeration('Screen', Object.values(Screen)),
  activeBottomTab: types.enumeration('BottomTab', Object.values(BottomTab)),
})
.actions(self => ({
  setCurrentScreen(screen: Screen) {
    self.currentScreen = screen;
  },
  setActiveBottomTab(tab: BottomTab) {
    self.activeBottomTab = tab;
  },
  reset() {
    self.currentScreen = Screen.INITIAL;
    self.activeBottomTab = BottomTab.INITIAL;
  }
}));
