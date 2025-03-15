import { types } from 'mobx-state-tree';
import { UdemyMessageAction } from '../services/udemy/types';
import { getStore, IRootStore } from './RootStore';



export enum HistoryStep {
  INITIAL = 'initial',
  FIND_COURSE = 'find_course',
  PULL_COURSE = 'pull_course',
  GO_TO_UDEMY = 'go_to_udemy',
}

const requestBackgroundExecuteCheckCourse = async (store: IRootStore) => {
    await new Promise(resolve => setTimeout(resolve, 3_000));
    chrome.runtime.sendMessage({ action: UdemyMessageAction.CHECK_COURSE, coupon: store.coupons[0] });
}
// Model cho Coupon
export const HistoryModel = types.model('History', {
  currentStep: types.enumeration('HistoryStep', Object.values(HistoryStep)),
})
    .actions(self => ({
  setCurrentStep(step: HistoryStep) {
    if (step === HistoryStep.GO_TO_UDEMY) {
        requestBackgroundExecuteCheckCourse(getStore());
    }
    self.currentStep = step;
  },
 
  reset() {
    self.currentStep = HistoryStep.INITIAL;
  }
}));
