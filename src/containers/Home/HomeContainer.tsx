import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { NavigationParams, PageType } from "../Root/RootContainer";
import Home from "./Home";
import { useStore } from "../../hooks/useStore";

interface HomeContainerProps {
    navigateTo: (page: PageType, params?: NavigationParams) => void;
    params: NavigationParams;
}

const HomeContainer: React.FC<HomeContainerProps> = observer(({ navigateTo, params }) => {
    const store = useStore();

    useEffect(() => {
        store.fetchCoupons();
    }, [store]);

    return (
        <Home coupons={store.coupons} isLoading={store.isLoading} error={store.error} />
    );
});

export default HomeContainer; 