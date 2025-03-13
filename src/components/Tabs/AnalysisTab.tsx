import React from 'react';

const AnalysisTab: React.FC = () => {
    return (
        <div className="h-full p-4 overflow-y-auto bg-base">
            <h2 className="text-xl font-bold mb-2">Analysis</h2>
            <p className="text-gray-600">Course enrollment statistics</p>
            <div className="mt-4 space-y-3">
                <StatCard title="Total Enrolled" value="0" bgColor="bg-blue-50" />
                <StatCard title="Success Rate" value="0%" bgColor="bg-green-50" />
                <StatCard title="Total Savings" value="$0" bgColor="bg-purple-50" />
            </div>
        </div>
    );
};

interface StatCardProps {
    title: string;
    value: string;
    bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, bgColor }) => (
    <div className={`p-3 ${bgColor} rounded-lg`}>
        <h3 className="font-medium">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
    </div>
);

export default AnalysisTab; 