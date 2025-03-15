import { observer } from 'mobx-react-lite';
import React from 'react';
import { HistoryStep } from '../../models/HistoryModel';
import { getStore } from '../../models/RootStore';
import BeginVisitUdemy from '../BeginVisitUdemy/BeginVisitUdemy';
import CardSharedAnimation from '../CardSharedAnimation';
import FindCourseLoadingState from '../FindCourseLoadingState/FindCourseLoadingState';
import PullCourseState from '../PullCourseState/PullCourseState';
import { Screen } from '../../models/PersistentRouterModel';
const HistoryTab: React.FC = observer(() => {

    return (
        <div className="bg-base relative h-[var(--popup-height)] w-[var(--popup-width)]">
            <FindCourseLoadingStateCardAnimation />
            <PullCourseStateCardAnimation />
            <BeginVisitUdemyCardAnimation />
        </div>
    );
});

const FindCourseLoadingStateCardAnimation = observer(() => {
    const store = getStore();
    const isVisible = store.history.currentStep === HistoryStep.FIND_COURSE;
    // React.useEffect(() => {
    //     if (store.history.currentStep === HistoryStep.FIND_COURSE && store.couponStore.items.length === 0) {
    //         store.couponStore.fetchCoupons();
    //     }
    // }, [store]);
    return (
        <CardSharedAnimation
            className='absolute top-40 left-0 w-full h-full px-6'
            isVisible={isVisible}
        >
            <FindCourseLoadingState />
        </CardSharedAnimation>
    );
});

const PullCourseStateCardAnimation = observer(() => {
    const store = getStore();
    const isVisible = store.history.currentStep === HistoryStep.PULL_COURSE;
    React.useEffect(() => {
        if (isVisible) {
            setTimeout(() => {
                store.history.autoTransitionStepUdemy(store.couponStore.items);
            }, 3_000);
        }
    }, [isVisible]);
    return (
        <CardSharedAnimation
            className='absolute top-40 left-0 w-full h-full px-6'
            isVisible={isVisible}
        >
            <PullCourseState coursesCount={1280} />
        </CardSharedAnimation>
    );
});

const BeginVisitUdemyCardAnimation = observer(() => {
    const store = getStore();
    const isVisible = store.history.currentStep === HistoryStep.GO_TO_UDEMY;
    return (
        <CardSharedAnimation
            className='absolute top-40 left-0 w-full h-full px-6'
            isVisible={isVisible}
        >
            <BeginVisitUdemy />
        </CardSharedAnimation>
    );
});

export default HistoryTab;