import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
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

    useEffect(() => {
        if (store.persistentRouter.navigationParams.fromScreen === Screen.ADD_COURSE || historyStep === HistoryStep.INITIAL || historyStep === HistoryStep.FIND_COURSE) {
            store.couponStore.fetchCoupons();
        }
    }, [store, store.persistentRouter.navigationParams.fromScreen, historyStep]);

    return (
        <Home />
    );
});

export default HomeContainer; 