import React, { useState, useRef, useEffect } from 'react';
import { CourseIcon, HistoryIcon, AnalysisIcon } from './icons';

export type TabType = 'course' | 'history' | 'analysis';

interface BottomBarProps {
    defaultTab?: TabType;
    onTabChange?: (tab: TabType) => void;
    restrictToDefaultTab?: boolean;
}

const BottomBar: React.FC<BottomBarProps> = ({ defaultTab = 'history', onTabChange, restrictToDefaultTab = true }) => {
    const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
    const tabsContainerRef = useRef<HTMLDivElement>(null);
    const [indicatorStyle, setIndicatorStyle] = useState({
        left: '0px',
        width: '0px',
    });

    const handleTabClick = (tab: TabType) => {
        if (restrictToDefaultTab && tab !== defaultTab) {
            return;
        }

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

    // Ensure active tab matches default tab in restricted mode
    useEffect(() => {
        if (restrictToDefaultTab && activeTab !== defaultTab) {
            setActiveTab(defaultTab);
        }
    }, [restrictToDefaultTab, defaultTab]);

    return (
        <div className="w-full bg-primary h-[56px] flex items-center">
            <div
                ref={tabsContainerRef}
                className="relative flex items-center justify-between bg-primary w-full px-4"
            >
                {/* Animated background indicator */}
                <div
                    className="absolute bg-primary-dark rounded-full transition-all duration-[350ms] ease-in-out h-[40px]"
                    style={{
                        left: indicatorStyle.left,
                        width: indicatorStyle.width,
                    }}
                />

                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const isDisabled = restrictToDefaultTab && tab.id !== defaultTab;

                    return (
                        <button
                            key={tab.id}
                            data-tab={tab.id}
                            onClick={() => handleTabClick(tab.id as TabType)}
                            disabled={isDisabled}
                            className={`
                                relative z-10 flex items-center justify-center h-[40px] rounded-full transition-colors duration-300
                                flex-1 text-center font-craft-demi
                                ${isActive ? 'text-white' : 'text-inactive hover:text-white/90'}
                                ${isDisabled ? 'opacity-40 cursor-not-allowed hover:text-inactive' : ''}
                            `}
                        >
                            <div className="flex items-center justify-center">
                                <div
                                    className={`transition-transform duration-[350ms] ease-in-out 
                                        ${isActive ? '-translate-x-1 text-white' : 'translate-x-0 text-inactive'}
                                        ${isDisabled ? 'text-inactive/50' : ''}
                                    `}
                                >
                                    {tab.icon}
                                </div>
                                <span
                                    className={`text-sm whitespace-nowrap overflow-hidden transition-all duration-[350ms] ease-in-out 
                                        ${isActive ? 'opacity-100 max-w-[200px] ml-1' : 'opacity-0 ml-0 max-w-0'}
                                        ${isDisabled ? 'opacity-40' : ''}
                                    `}
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

export default BottomBar; 