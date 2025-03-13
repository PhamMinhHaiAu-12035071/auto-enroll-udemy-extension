import React from 'react';

const HistoryTab: React.FC = () => {
    return (
        <div className="h-full p-4 overflow-y-auto bg-base">
            <h2 className="text-xl font-bold mb-2">Enrollment History</h2>
            <p className="text-gray-600">View your enrollment history</p>
            <div className="mt-4">
                <p className="text-gray-500">No enrollment history yet</p>
            </div>
        </div>
    );
};

export default HistoryTab; 