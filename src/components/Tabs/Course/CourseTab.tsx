import React from 'react';
import { reportStore } from '../../../services/udemy/report_store';
import CourseCard from '../../Course/CourseCard';
import './style.scss';
const CourseTab: React.FC = () => {
    const enrolledCourses = reportStore.getReport().details.enrollNow;
    const length = enrolledCourses.length;

    return (
        <div className="app-course-tab flex flex-col h-[calc(100vh-4rem)] bg-base">
            <div className="px-4 pt-4 pb-2">
                <h1 className="text-xl font-bold font-craft-demi">Enrolled Courses</h1>
                <h4 className="text-gray-600 font-craft-cd">{length} courses</h4>
            </div>

            <div className="flex-1 overflow-y-auto px-4 hide-scrollbar">
                <div className="h-5"></div>
                <div className="">
                    {enrolledCourses.map((course, index) => (
                        <div className="mb-6" key={`${course.coupon.id}`}>
                            <CourseCard
                                id={index + 1}
                                coupon={course.coupon}
                                backgroundColor="hsl(0deg 0% 99.6%)"
                                shadowColor="hsl(0deg 0% 7.5%)"
                                borderColor="hsl(0deg 0% 24%)"
                                borderRadius={20}
                            />
                        </div>
                    ))}
                </div>
                <div className="h-20"></div>
            </div>
        </div>
    );
};

export default CourseTab; 