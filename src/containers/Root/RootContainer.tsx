import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react-lite";
import React from "react";
import Layout from "../../components/Layout/Layout";
import { Screen } from "../../models/PersistentRouterModel";
import { getStore } from "../../models/RootStore";
import AddCoursePage from "../AddCourse/AddCoursePage";
import HomeContainer from "../Home/HomeContainer";


// Định nghĩa kiểu dữ liệu cho params
export interface NavigationParams {
    [key: string]: any;
}

const RootContainer: React.FC = observer(() => {
    const store = getStore();
    // Use current screen from store instead of local state
    const currentScreen = store.persistentRouter.currentScreen;

    // We'll still need pageParams for now, since they're not stored in the Router model
    const [pageParams, setPageParams] = React.useState<NavigationParams>({});

    // Phương thức điều hướng mới với params
    const navigateTo = (screen: Screen, params: NavigationParams = {}) => {
        // Update both the local state and the persistent store
        setPageParams(params);
        // Update the store with the corresponding Screen enum value
        store.persistentRouter.setCurrentScreen(screen);
    };

    return (
        <div className="relative w-[var(--popup-width)] h-[var(--popup-height)] bg-base overflow-hidden">
            <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
                {currentScreen === Screen.HOME && (
                    <Layout key="home">
                        <HomeContainer navigateTo={navigateTo} params={pageParams} />
                    </Layout>
                )}
                {(currentScreen === Screen.ADD_COURSE || currentScreen === Screen.INITIAL) && (
                    <Layout key="addCourse">
                        <AddCoursePage navigateTo={navigateTo} params={pageParams} />
                    </Layout>
                )}
            </AnimatePresence>
        </div>
    );
});

export default RootContainer;
