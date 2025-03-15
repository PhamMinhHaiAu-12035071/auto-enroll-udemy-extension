import React from 'react';
import { ICoupon } from '../../models/CouponModel';
import CourseCard from '../Course/CourseCard';

interface CourseTabProps {
    coupons: ICoupon[];
}

const CourseTab: React.FC<CourseTabProps> = ({ coupons }) => {
    return (
        <div className="h-full p-4 overflow-y-auto bg-base">
            <h2 className="text-xl font-bold mb-2">Courses</h2>
            <p className="text-gray-600 mb-4">Browse available Udemy courses</p>

            <div className="mb-6">
                <div className="mt-4">
                    <div className="space-y-5">
                        {coupons.map((coupon, index) => (
                            <CourseCard
                                key={`${coupon.id}`}
                                id={index + 1}
                                coupon={coupon}
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