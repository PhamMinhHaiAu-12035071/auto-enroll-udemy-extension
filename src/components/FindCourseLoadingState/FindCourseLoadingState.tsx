import React, { useEffect, useRef } from 'react';
import './style.scss';
import findCourse from '../../assets/img/find-course.svg';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

// Card container animation variants
const cardContainerVariants = {
    hidden: {
        opacity: 0,
        y: 70, // Tăng khoảng cách ban đầu để hiệu ứng rõ hơn
        scale: 0, // Bắt đầu với kích thước 0
        transformOrigin: "center bottom" // Xác định điểm gốc cho scale
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1, // Phình to dần đến kích thước đầy đủ
        transition: {
            type: 'spring',
            damping: 20,
            stiffness: 150, // Giảm stiffness thêm chút nữa để hiệu ứng scale mượt mà hơn
            duration: 1.5, // Tăng thời gian để nhìn rõ cả 3 hiệu ứng
            ease: [0.16, 1, 0.3, 1],
            // Thứ tự animation: scale trước, y tiếp theo, opacity chạy song song
            scale: { duration: 1.5, ease: [0, 1, 0.5, 1] }, // Custom timing cho scale
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.9, // Thêm hiệu ứng thu nhỏ khi biến mất
        transition: {
            duration: 0.5,
            ease: 'easeOut'
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

const FindCourseLoadingState = () => {
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
            <motion.div
                className="app-find-course-loading-state"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={cardContainerVariants}
            >
                <div className={`pushable`}>
                    <span className={`front font-craft-demi`}>
                        <div className="loading-text">
                            {`Bot is looking for courses`}
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
        </AnimatePresence>
    );
};
export default FindCourseLoadingState;