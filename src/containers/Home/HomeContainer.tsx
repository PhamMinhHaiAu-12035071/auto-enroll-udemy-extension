import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";
import { useStore } from "../../hooks/useStore";
import { NavigationParams, Screen } from "../../models/PersistentRouterModel";
import Home from "./Home";
import { HistoryStep } from "../../models/HistoryModel";

interface HomeContainerProps {
    navigateTo: (screen: Screen, params?: NavigationParams) => void;
}

const HomeContainer: React.FC<HomeContainerProps> = observer(({ navigateTo }) => {
    const store = useStore();
    const historyStep = store.history.currentStep;
    // Add a ref to track if we've already fetched coupons
    const hasFetchedCoupons = useRef(false);

    useEffect(() => {
        // Only fetch coupons if we haven't already and meet one of the conditions
        if (!hasFetchedCoupons.current &&
            (store.persistentRouter.navigationParams.fromScreen === Screen.ADD_COURSE ||
                historyStep === HistoryStep.INITIAL ||
                historyStep === HistoryStep.FIND_COURSE)) {

            store.couponStore.fetchCoupons();
            // Mark that we've fetched coupons
            hasFetchedCoupons.current = true;
        }
    }, [store, store.persistentRouter.navigationParams.fromScreen, historyStep]);

    return (
        <Home />
    );
});

export default HomeContainer; 