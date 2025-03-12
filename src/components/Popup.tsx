import React, { useState } from 'react';
import TabBar from './TabBar';
import type { TabType } from './TabBar';
import { RowCoupon } from '../type';


interface PopupProps {
    rowCoupons: RowCoupon[];
    isLoading: boolean;
    error: string | null;
}

const Popup: React.FC<PopupProps> = ({ rowCoupons, isLoading, error }) => {
    const [currentTab, setCurrentTab] = useState<TabType>('course');

    const handleTabChange = (tab: TabType) => {
        setCurrentTab(tab);
        console.log(`Tab changed to: ${tab}`);
        // Xử lý logic khi tab thay đổi
    };

    // Render nội dung dựa trên tab hiện tại
    const renderContent = () => {
        switch (currentTab) {
            case 'course':
                return (
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-2">Courses</h2>
                        <p className="text-gray-600">Browse available Udemy courses</p>
                        {/* Hiển thị danh sách khóa học từ rowCoupons */}
                        <div className="mt-4">
                            {rowCoupons.length > 0 ? (
                                rowCoupons.map((rowCoupon) => (
                                    <div key={rowCoupon.id} className="mb-3 p-3 border rounded-lg shadow-sm">
                                        <h3 className="font-medium">{rowCoupon.coupon.title}</h3>
                                        <p className="text-sm text-gray-500">{rowCoupon.coupon.couponCode}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No courses available</p>
                            )}
                        </div>
                    </div>
                );
            case 'history':
                return (
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-2">Enrollment History</h2>
                        <p className="text-gray-600">View your enrollment history</p>
                        <div className="mt-4">
                            <p className="text-gray-500">No enrollment history yet</p>
                        </div>
                    </div>
                );
            case 'analysis':
                return (
                    <div className="p-4">
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
                );
            default:
                return null;
        }
    };

    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="relative min-h-[500px] w-[350px] bg-white">
            {/* Header */}
            <header className="bg-purple-600 text-white p-4">
                <h1 className="text-xl font-bold">Udemy Auto Enroll</h1>
            </header>

            <div className="sticky top-0 z-10 bg-white w-[300px]">
                <TabBar defaultTab="course" onTabChange={handleTabChange} />
            </div>

            {/* Main Content */}
            <main className="mt-1 overflow-auto">
                {renderContent()}
            </main>
        </div>
    );
};

export default Popup;
