import React from "react";
import { PageType } from "../Root/RootContainer";
import Home from "./Home";

interface PopupContainerProps {
    onNavigate: (page: PageType) => void;
}

const HomeContainer: React.FC<PopupContainerProps> = ({ onNavigate }) => {
    return (
        <Home coupons={[]} isLoading={false} error={null} />
    );
};

export default HomeContainer; 