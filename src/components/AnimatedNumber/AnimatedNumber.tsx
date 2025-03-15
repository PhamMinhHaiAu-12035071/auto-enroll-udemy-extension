import React, { useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
    value: number;
    className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, className }) => {
    // Tạo motion value để theo dõi giá trị hiện tại
    const count = useMotionValue(0);

    // Tạo spring animation cho giá trị
    const smoothCount = useSpring(count, {
        damping: 30,
        stiffness: 100,
    });

    // Chuyển đổi giá trị thành số nguyên để hiển thị
    const display = useTransform(smoothCount, (latest) => Math.round(latest).toLocaleString());

    // Kích hoạt animation khi component mount hoặc khi value thay đổi
    useEffect(() => {
        count.set(value);
    }, [count, value]);

    return (
        <motion.span className={className}>
            {display}
        </motion.span>
    );
};

export default AnimatedNumber; 