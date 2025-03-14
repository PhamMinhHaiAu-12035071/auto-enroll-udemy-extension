import React from 'react';
import FindCourseLoadingState from '../FindCourseLoadingState/FindCourseLoadingState';
import PullCourseState from '../PullCourseState/PullCourseState';

const HistoryTab: React.FC = () => {
    return (
        <div className="h-full bg-base py-24 px-4">
            <FindCourseLoadingState />
            <div className="mt-4"></div>
            <PullCourseState />
        </div>
    );
};

export default HistoryTab; 