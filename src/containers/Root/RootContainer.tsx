import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import AddCoursePage from "../AddCourse/AddCoursePage";
import HomeContainer from "../Home/HomeContainer";

export type PageType = "home" | "addCourse";

const RootContainer: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<PageType>("addCourse");

    const navigateTo = (page: PageType) => {
        setCurrentPage(page);
    };

    return (
        <div className="relative w-[var(--popup-width)] h-[var(--popup-height)] bg-base overflow-hidden">
            <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
                {currentPage === "home" && (
                    <Layout key="home">
                        <HomeContainer onNavigate={navigateTo} />
                    </Layout>
                )}
                {currentPage === "addCourse" && (
                    <Layout key="addCourse">
                        <AddCoursePage onNavigate={navigateTo} />
                    </Layout>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RootContainer;
