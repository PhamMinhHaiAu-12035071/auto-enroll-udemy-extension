import React, { useState, useRef, useEffect } from 'react';
import { CourseIcon, HistoryIcon, AnalysisIcon } from './icons';

export type TabType = 'course' | 'history' | 'analysis';

interface TabBarProps {
    defaultTab?: TabType;
    onTabChange?: (tab: TabType) => void;
}

const TabBar: React.FC<TabBarProps> = ({ defaultTab = 'course', onTabChange }) => {
    const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
    const tabsContainerRef = useRef<HTMLDivElement>(null);
    const [indicatorStyle, setIndicatorStyle] = useState({
        left: '0px',
        width: '0px',
    });

    const handleTabClick = (tab: TabType) => {
        setActiveTab(tab);
        if (onTabChange) {
            onTabChange(tab);
        }
    };

    const tabs = [
        { id: 'course', label: 'Course', icon: <CourseIcon /> },
        { id: 'history', label: 'History', icon: <HistoryIcon /> },
        { id: 'analysis', label: 'Analysis', icon: <AnalysisIcon /> },
    ];

    // Update indicator position when active tab changes
    useEffect(() => {
        if (tabsContainerRef.current) {
            const activeTabElement = tabsContainerRef.current.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement;

            if (activeTabElement) {
                const containerRect = tabsContainerRef.current.getBoundingClientRect();
                const tabRect = activeTabElement.getBoundingClientRect();

                setIndicatorStyle({
                    left: `${tabRect.left - containerRect.left}px`,
                    width: `${tabRect.width}px`,
                });
            }
        }
    }, [activeTab]);

    return (
        <div className="px-2 py-2 w-full">
            <div
                ref={tabsContainerRef}
                className="relative flex items-center justify-between bg-gray-100 rounded-full p-1 w-full"
            >
                {/* Animated background indicator */}
                <div
                    className="absolute bg-blue-500 rounded-full transition-all duration-[350ms] ease-in-out h-[calc(100%-8px)]"
                    style={{
                        left: indicatorStyle.left,
                        width: indicatorStyle.width,
                    }}
                />

                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            data-tab={tab.id}
                            onClick={() => handleTabClick(tab.id as TabType)}
                            className={`
                                relative z-10 flex items-center justify-center py-1.5 rounded-full transition-colors duration-300
                                flex-1 text-center
                                ${isActive ? 'text-white font-medium' : 'text-gray-600 hover:text-gray-800'}
                            `}
                        >
                            <div className="flex items-center justify-center">
                                <div
                                    className={`transition-transform duration-[350ms] ease-in-out ${isActive ? '-translate-x-1' : 'translate-x-0'}`}
                                >
                                    {tab.icon}
                                </div>
                                <span
                                    className={`text-sm whitespace-nowrap overflow-hidden transition-all duration-[350ms] ease-in-out ${isActive ? 'opacity-100 max-w-[200px]' : 'opacity-0 ml-0 max-w-0'}`}
                                >
                                    {tab.label}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default TabBar; 