import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import AddCoursePage from "../AddCourse/AddCoursePage";
import HomeContainer from "../Home/HomeContainer";

export type PageType = "home" | "addCourse";

// Định nghĩa kiểu dữ liệu cho params
export interface NavigationParams {
    [key: string]: any;
}

const RootContainer: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<PageType>("addCourse");
    const [pageParams, setPageParams] = useState<NavigationParams>({});

    // Phương thức điều hướng mới với params
    const navigateTo = (page: PageType, params: NavigationParams = {}) => {
        setCurrentPage(page);
        setPageParams(params);
    };

    return (
        <div className="relative w-[var(--popup-width)] h-[var(--popup-height)] bg-base overflow-hidden">
            <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
                {currentPage === "home" && (
                    <Layout key="home">
                        <HomeContainer navigateTo={navigateTo} params={pageParams} />
                    </Layout>
                )}
                {currentPage === "addCourse" && (
                    <Layout key="addCourse">
                        <AddCoursePage navigateTo={navigateTo} params={pageParams} />
                    </Layout>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RootContainer;
