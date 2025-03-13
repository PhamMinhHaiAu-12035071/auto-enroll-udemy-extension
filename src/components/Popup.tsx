import React, { useState } from 'react';
import { Coupon, RowCoupon } from '../type';
import type { TabType } from './BottomBar';
import BottomBar from './BottomBar';
import CourseCard from './Course/CourseCard';
import Header from './Header';
import Pager from './Pager';

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

    const mockCoupon: Coupon = {
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

    const renderTabs = () => {
        return [
            // Course Tab
            <div key="course" className="h-full p-4 overflow-y-auto bg-base">
                <h2 className="text-xl font-bold mb-2">Courses</h2>
                <p className="text-gray-600 mb-4">Browse available Udemy courses</p>

                {/* Featured Course Card */}
                <div className="mb-6">
                    <div className="mt-4">
                        <div className="space-y-4">
                            {Array.from({ length: 20 }).map((_, index) => (
                                <CourseCard
                                    key={`course-${index}`}
                                    id={index + 1}
                                    coupon={mockCoupon}
                                    backgroundColor="hsl(0deg 0% 95%)"
                                    borderRadius={20}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>,
            // History Tab
            <div key="history" className="h-full p-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-2">Enrollment History</h2>
                <p className="text-gray-600">View your enrollment history</p>
                <div className="mt-4">
                    <p className="text-gray-500">No enrollment history yet</p>
                </div>
            </div>,
            // Analysis Tab
            <div key="analysis" className="h-full p-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-2">Analysis</h2>
                <p className="text-gray-600">Course enrollment statistics</p>
                <div className="mt-4 space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <h3 className="font-medium">Total Enrolled</h3>
                        <p className="text-2xl font-bold">0</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                        <h3 className="font-medium">Success Rate</h3>
                        <p className="text-2xl font-bold">0%</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                        <h3 className="font-medium">Total Savings</h3>
                        <p className="text-2xl font-bold">$0</p>
                    </div>
                </div>
            </div>
        ];
    };

    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="relative h-[500px] w-[350px] bg-base flex flex-col">
            <Header title="Udemy Auto Enroll" />

            {/* Main Content with Pager */}
            <main className="flex-1 h-0">
                <Pager value={getTabIndex(currentTab)}>
                    {renderTabs()}
                </Pager>
            </main>

            {/* Bottom Navigation - Updated positioning */}
            <div className="fixed bottom-0 left-0 right-0 w-[350px]">
                <BottomBar defaultTab="course" onTabChange={setCurrentTab} />
            </div>
        </div>
    );
};

export default Popup;
