import React from "react";
import Popup from "../../components/Popup";
import { useCoupons } from "../../hooks/useCoupons";

const PopupContainer = () => {
    const { coupons, isLoading, error } = useCoupons();

    return (
        <Popup
            rowCoupons={coupons}
            isLoading={isLoading}
            error={error}
        />
    );
};

export default PopupContainer;
