import { types } from 'mobx-state-tree';



export enum HistoryStep {
  INITIAL = 'initial',
  FIND_COURSE = 'find_course',
  PULL_COURSE = 'pull_course',
  GO_TO_UDEMY = 'go_to_udemy',
}
// Model cho Coupon
export const HistoryModel = types.model('History', {
  currentStep: types.enumeration('HistoryStep', Object.values(HistoryStep)),
})
.actions(self => ({
  setCurrentStep(step: HistoryStep) {
    self.currentStep = step;
  },
 
  reset() {
    self.currentStep = HistoryStep.INITIAL;
  }
}));
