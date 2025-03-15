import { observer } from "mobx-react-lite";
import React, { useState } from 'react';
import type { TabType } from '../../components/BottomBar';
import BottomBar from '../../components/BottomBar';
import Header from '../../components/Header';
import Pager from '../../components/Pager';
import AnalysisTab from '../../components/Tabs/AnalysisTab';
import CourseTab from '../../components/Tabs/CourseTab';
import HistoryTab from '../../components/Tabs/HistoryTab';


const Home: React.FC = observer(() => {
    const [currentTab, setCurrentTab] = useState<TabType>('history');

    const getTabIndex = (tab: TabType): number => {
        const tabMap = { course: 0, history: 1, analysis: 2 };
        return tabMap[tab];
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
                <Pager value={getTabIndex(currentTab)}>
                    {renderTabs()}
                </Pager>
            </main>

            <div className="fixed bottom-0 left-0 right-0 w-[var(--popup-width)]">
                <BottomBar defaultTab={currentTab} onTabChange={setCurrentTab} />
            </div>
        </div>
    );
});

export default Home;
