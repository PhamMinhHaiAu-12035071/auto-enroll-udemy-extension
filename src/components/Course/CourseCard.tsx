import React from 'react';
import './style.css';
interface CourseCardProps {
}

const CourseCard: React.FC<CourseCardProps> = () => {
    return (
        <button className="pushable">
            <span className="front">
                Push me
            </span>
        </button>
    );
};

export default CourseCard;
