import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { NavigationParams } from "../Root/RootContainer";
import Home from "./Home";
import { useStore } from "../../hooks/useStore";
import { Screen } from "../../models/PersistentRouterModel";

interface HomeContainerProps {
    navigateTo: (screen: Screen, params?: NavigationParams) => void;
    params: NavigationParams;
}

const HomeContainer: React.FC<HomeContainerProps> = observer(({ navigateTo, params }) => {
    const store = useStore();

    useEffect(() => {
        store.fetchCoupons();
    }, [store]);

    return (
        <Home />
    );
});

export default HomeContainer; 