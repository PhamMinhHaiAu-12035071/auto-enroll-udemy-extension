import { observer } from 'mobx-react-lite';
import React from 'react';
import { getStore } from '../../models/CouponModel';
import FindCourseLoadingState from '../FindCourseLoadingState/FindCourseLoadingState';

const HistoryTab: React.FC = observer(() => {
    const store = getStore();
    console.log(`HistoryTab render - isFetching: ${store.isFetching}`);

    return (
        <div className="h-full bg-base py-24 px-4">
            <FindCourseLoadingState isVisible={store.isFetching} />
        </div>
    );
});

export default HistoryTab; 