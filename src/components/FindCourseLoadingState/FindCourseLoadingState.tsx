import React, { useEffect, useRef } from 'react';
import './style.scss';
import findCourse from '../../assets/img/find-course.svg';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

interface FindCourseLoadingStateProps {
    isVisible: boolean;
    message?: string;
    className?: string;
}

// Card container animation variants
const cardContainerVariants = {
    hidden: {
        opacity: 0,
        y: 70,
        scale: 0,
        transformOrigin: "center bottom"
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            damping: 20,
            stiffness: 150,
            duration: 1.5,
            ease: [0.16, 1, 0.3, 1],
            scale: { duration: 1.5, ease: [0, 1, 0.5, 1] },
        }
    },
    exit: {
        opacity: 0,
        y: -30,
        scale: 0.5,
        transformOrigin: "center center",
        transition: {
            duration: 0.7,
            ease: [0.43, 0.13, 0.23, 0.96], // Custom easing for smoother exit
            opacity: { duration: 0.5 }, // Fade out slightly faster
            scale: { duration: 0.6 }, // Scale slightly slower for better effect
            y: { duration: 0.5, ease: "easeInOut" } // Custom easing for y movement
        }
    }
};

// Variants cho dot đầu tiên - xuất hiện trước
const firstDotVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: [0, 1, 0],
        transition: {
            times: [0, 0.3, 1],
            duration: 1.8,
            repeat: Infinity,
            repeatDelay: 1.2, // Chờ các dots khác hoàn thành trước khi lặp lại
        }
    }
};

// Variants cho dot thứ hai - xuất hiện sau dot đầu tiên
const secondDotVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: [0, 1, 0],
        transition: {
            times: [0, 0.3, 1],
            duration: 1.8,
            repeat: Infinity,
            repeatDelay: 1.2,
            delay: 0.6, // Delay so với dot đầu tiên
        }
    }
};

// Variants cho dot thứ ba - xuất hiện sau cùng
const thirdDotVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: [0, 1, 0],
        transition: {
            times: [0, 0.3, 1],
            duration: 1.8,
            repeat: Infinity,
            repeatDelay: 1.2,
            delay: 1.2, // Delay lớn nhất
        }
    }
};

const FindCourseLoadingState: React.FC<FindCourseLoadingStateProps> = ({
    isVisible,
    message = "Finding courses...",
    className = ""
}) => {
    const svgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        // Capture current ref values in local variables
        const svgElement = svgRef.current;
        const shadow = svgElement.parentElement?.querySelector('.shadow-element');

        // Tạo timeline cho animation
        const tl = gsap.timeline({ repeat: -1 });

        // Animation "tìm kiếm" - chỉ di chuyển và xoay nhẹ
        tl.to(svgElement, {
            x: 8,
            y: -4,
            rotation: 3,
            duration: 1,
            ease: "power1.inOut"
        })
            .to(svgElement, {
                x: -8,
                y: 4,
                rotation: -3,
                duration: 1,
                ease: "power1.inOut"
            })
            .to(svgElement, {
                x: 0,
                y: 0,
                rotation: 0,
                duration: 1,
                ease: "power1.inOut"
            });

        // Đồng bộ chuyển động của bóng với hình ảnh SVG
        if (shadow) {
            // Khi SVG di chuyển sang phải, bóng di chuyển ngược lại và ngược lại
            tl.to(shadow, {
                x: 4,
                scaleX: 1.05,
                duration: 1,
                ease: "power1.inOut"
            }, 0)
                .to(shadow, {
                    x: -4,
                    scaleX: 1.05,
                    duration: 1,
                    ease: "power1.inOut"
                }, 1)
                .to(shadow, {
                    x: 0,
                    scaleX: 1,
                    duration: 1,
                    ease: "power1.inOut"
                }, 2);
        }

        return () => {
            tl.kill();
            gsap.killTweensOf(svgElement); // Use local variable
            if (shadow) gsap.killTweensOf(shadow);
        };
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className={`app-find-course-loading-state ${className}`}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={cardContainerVariants}
                >
                    <div className={`pushable`}>
                        <span className={`front font-craft-demi`}>
                            <div className="loading-text">
                                {message}
                                <div className="loading-dots-container">
                                    <motion.span
                                        className="motion-dot"
                                        initial="initial"
                                        animate="animate"
                                        variants={firstDotVariants}
                                    >.</motion.span>
                                    <motion.span
                                        className="motion-dot"
                                        initial="initial"
                                        animate="animate"
                                        variants={secondDotVariants}
                                    >.</motion.span>
                                    <motion.span
                                        className="motion-dot"
                                        initial="initial"
                                        animate="animate"
                                        variants={thirdDotVariants}
                                    >.</motion.span>
                                </div>
                            </div>
                            <div className="find-course-image">
                                <div className="shadow-element"></div>
                                <img
                                    ref={svgRef}
                                    src={findCourse}
                                    alt="findCourse"
                                    style={{ backgroundColor: 'transparent' }}
                                />
                            </div>
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FindCourseLoadingState;