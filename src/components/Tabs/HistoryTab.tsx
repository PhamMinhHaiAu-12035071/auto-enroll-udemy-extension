import React from 'react';
import FindCourseLoadingState from '../FindCourseLoadingState/FindCourseLoadingState';
const HistoryTab: React.FC = () => {
    return (
        <div className="h-full bg-base py-24 px-4">
            <FindCourseLoadingState />
        </div>
    );
};

export default HistoryTab; 