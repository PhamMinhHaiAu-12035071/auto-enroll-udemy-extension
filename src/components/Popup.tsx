import React, { useState } from 'react';
import { RowCoupon } from '../type';
import type { TabType } from './BottomBar';
import BottomBar from './BottomBar';
import Header from './Header';
import Pager from './Pager';
import CourseTab from './Tabs/CourseTab';
import HistoryTab from './Tabs/HistoryTab';
import AnalysisTab from './Tabs/AnalysisTab';

interface PopupProps {
    rowCoupons: RowCoupon[];
    isLoading: boolean;
    error: string | null;
}

const Popup: React.FC<PopupProps> = ({ rowCoupons, isLoading, error }) => {
    const [currentTab, setCurrentTab] = useState<TabType>('course');

    const getTabIndex = (tab: TabType): number => {
        const tabMap = { course: 0, history: 1, analysis: 2 };
        return tabMap[tab];
    };

    const mockCoupon = {
        "title": "Ethically Hack the Planet Part 2",
        "link": "https://www.udemy.com/course/ethically-hack-the-planet-part-2/?couponCode=6477CC0EC37AD18BDEC9",
        "couponCode": "6477CC0EC37AD18BDEC9",
        "checkTime": "2025-03-12T12:05:31.057Z",
        "rating": 1,
        "authors": [
            "Cyber Twinkle"
        ],
        "enrollStudents": 40656,
        "language": "English",
        "topics": [
            "IT & Software",
            "Network & Security",
            "Ethical Hacking"
        ],
        "price": 399000,
        "duration": 33,
        "image": {
            "src": "https://img-c.udemycdn.com/course/240x135/5523566_a9a6_7.jpg",
            "srcset": [
                "https://img-c.udemycdn.com/course/240x135/5523566_a9a6_7.jpg 240w",
                "https://img-c.udemycdn.com/course/480x270/5523566_a9a6_7.jpg 480w",
                "https://img-c.udemycdn.com/course/750x422/5523566_a9a6_7.jpg 750w"
            ],
            "width": 330,
            "height": 185
        },
        "amountRating": 188
    };

    const renderTabs = () => [
        <CourseTab key="course" mockCoupon={mockCoupon} />,
        <HistoryTab key="history" />,
        <AnalysisTab key="analysis" />
    ];

    if (isLoading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="relative h-[500px] w-[350px] bg-base flex flex-col">
            <Header title="Udemy Auto Enroll" />

            <main className="flex-1 h-0">
                <Pager value={getTabIndex(currentTab)}>
                    {renderTabs()}
                </Pager>
            </main>

            <div className="fixed bottom-0 left-0 right-0 w-[350px]">
                <BottomBar defaultTab="course" onTabChange={setCurrentTab} />
            </div>
        </div>
    );
};

export default Popup;
