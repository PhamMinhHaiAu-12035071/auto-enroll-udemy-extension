import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react-lite";
import React from "react";
import Layout from "../../components/Layout/Layout";
import { NavigationParams, Screen } from "../../models/PersistentRouterModel";
import { getStore } from "../../models/RootStore";
import AddCoursePage from "../AddCourse/AddCoursePage";
import HomeContainer from "../Home/HomeContainer";



const RootContainer: React.FC = observer(() => {
    const store = getStore();
    // Use current screen from store instead of local state
    const currentScreen = store.persistentRouter.currentScreen;

    // Phương thức điều hướng mới với params
    const navigateTo = (screen: Screen, params: NavigationParams = {}) => {
        // Update both the local state and the persistent store
        store.persistentRouter.setCurrentScreen(screen);
        store.persistentRouter.setNavigationParams(params);
    };

    // Hàm render cho màn hình Home
    const renderHomeScreen = () => {
        if (currentScreen !== Screen.HOME) return null;

        return (
            <Layout key="home">
                <HomeContainer navigateTo={navigateTo} />
            </Layout>
        );
    };

    // Hàm render cho màn hình Add Course
    const renderAddCourseScreen = () => {
        // Chỉ hiển thị khi màn hình là ADD_COURSE hoặc INITIAL
        if (currentScreen !== Screen.ADD_COURSE && currentScreen !== Screen.INITIAL) {
            return null;
        }

        return (
            <Layout key="addCourse">
                <AddCoursePage navigateTo={navigateTo} />
            </Layout>
        );
    };

    return (
        <div className="relative w-[var(--popup-width)] h-[var(--popup-height)] bg-base overflow-hidden">
            <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
                {renderHomeScreen()}
                {renderAddCourseScreen()}
            </AnimatePresence>
        </div>
    );
});

export default RootContainer;
