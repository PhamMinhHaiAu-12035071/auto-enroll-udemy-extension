import { motion, useSpring, useTransform } from 'framer-motion';
import React, { useEffect, useRef } from 'react';

interface AnimatedNumberProps {
    value: number;
    className?: string;
    formatNumber?: boolean;
    locale?: string;
    format?: Intl.NumberFormatOptions;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
    value,
    className = '',
    formatNumber = true,
    locale = 'en-US',
    format = {}
}) => {
    // Create a spring animation for smooth transitions
    const springValue = useSpring(0, {
        stiffness: 100,
        damping: 30,
    });

    // Track if this is the initial mount
    const isFirstRender = useRef(true);

    // Trigger animation on mount and when value changes
    useEffect(() => {
        // Always animate from 0 on first render
        if (isFirstRender.current) {
            springValue.set(0);
            isFirstRender.current = false;
        }

        // Animate to the target value
        springValue.set(value);
    }, [value, springValue]);

    // Format the number if required
    const formattedValue = useTransform(springValue, (current) => {
        if (!formatNumber) return String(Math.round(current));

        // Use Intl.NumberFormat for robust localization
        return new Intl.NumberFormat(locale, {
            maximumFractionDigits: 0,
            ...format
        }).format(Math.round(current));
    });

    return (
        <motion.span className={className}>
            {formattedValue}
        </motion.span>
    );
};

export default AnimatedNumber; 