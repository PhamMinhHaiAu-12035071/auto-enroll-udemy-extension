import React from 'react';
import CourseCard from '../Course/CourseCard';
import { Coupon } from '../../type';

interface CourseTabProps {
    mockCoupon: Coupon;
}

const CourseTab: React.FC<CourseTabProps> = ({ mockCoupon }) => {
    return (
        <div className="h-full p-4 overflow-y-auto bg-base">
            <h2 className="text-xl font-bold mb-2">Courses</h2>
            <p className="text-gray-600 mb-4">Browse available Udemy courses</p>

            <div className="mb-6">
                <div className="mt-4">
                    <div className="space-y-5">
                        {Array.from({ length: 20 }).map((_, index) => (
                            <CourseCard
                                key={`course-${index}`}
                                id={index + 1}
                                coupon={mockCoupon}
                                backgroundColor="hsl(0deg 0% 99.6%)"
                                shadowColor="hsl(0deg 0% 7.5%)"
                                borderColor="hsl(0deg 0% 24%)"
                                borderRadius={20}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseTab; 