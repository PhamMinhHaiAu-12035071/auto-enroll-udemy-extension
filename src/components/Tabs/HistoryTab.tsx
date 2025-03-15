import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { getStore } from '../../models/CouponModel';
import FindCourseLoadingState from '../FindCourseLoadingState/FindCourseLoadingState';
import PullCourseState from '../PullCourseState/PullCourseState';

const HistoryTab: React.FC = observer(() => {
    const store = getStore();
    const [showPullState, setShowPullState] = useState(false);

    // Hiển thị PullCourseState sau khi FindCourseLoadingState biến mất
    useEffect(() => {
        if (!store.isFetching) {
            // Delay hiển thị PullCourseState để tạo hiệu ứng tuần tự
            const timer = setTimeout(() => {
                setShowPullState(true);
            }, 500); // Delay 500ms sau khi FindCourseLoadingState biến mất

            return () => clearTimeout(timer);
        } else {
            setShowPullState(false);
        }
    }, [store.isFetching]);

    return (
        <div className="h-full bg-base py-24 px-4">
            <FindCourseLoadingState isVisible={store.isFetching} />
            <PullCourseState isVisible={showPullState} coursesCount={1280} />
        </div>
    );
});

export default HistoryTab; 