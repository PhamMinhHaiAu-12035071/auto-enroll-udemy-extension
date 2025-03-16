import { observer } from "mobx-react-lite";
import React from 'react';
import BottomBar from '../../components/BottomBar';
import Header from '../../components/Header';
import Pager from '../../components/Pager';
import AnalysisTab from '../../components/Tabs/AnalysisTab';
import CourseTab from '../../components/Tabs/CourseTab';
import HistoryTab from '../../components/Tabs/HistoryTab';
import { BottomTab } from "../../models/PersistentRouterModel";

interface HomeProps {
    activeBottomTab: BottomTab;
    setActiveBottomTab: (tab: BottomTab) => void;
    restrictToDefaultTab: boolean;
}

const Home: React.FC<HomeProps> = observer(({ activeBottomTab, setActiveBottomTab, restrictToDefaultTab }) => {
    const getTabIndex = (tab: BottomTab): number => {
        if (tab === BottomTab.COURSE) {
            return 0;
        } else if (tab === BottomTab.HISTORY) {
            return 1;
        } else if (tab === BottomTab.ANALYSIS) {
            return 2;
        }
        return 1;
    };

    const renderTabs = () => [
        <CourseTab key="course" />,
        <HistoryTab key="history" />,
        <AnalysisTab key="analysis" />
    ];
    return (
        <div className="relative w-[var(--popup-width)] h-[var(--popup-height)] bg-base flex flex-col">
            <Header title="Udemy Auto Enroll" />

            <main className="flex-1 h-0">
                <Pager value={getTabIndex(activeBottomTab)}>
                    {renderTabs()}
                </Pager>
            </main>

            <div className="fixed bottom-0 left-0 right-0 w-[var(--popup-width)]">
                <BottomBar restrictToDefaultTab={restrictToDefaultTab} activeBottomTab={activeBottomTab} setActiveBottomTab={setActiveBottomTab} />
            </div>
        </div>
    );
});

export default Home;
