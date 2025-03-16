import { AnimatePresence, motion, Variants } from "framer-motion";
import React from "react";

interface CardSharedAnimationProps {
    children: React.ReactNode;
    isVisible?: boolean;
    variants?: Variants;
    className?: string;
}


const cardContainerVariants = {
    initial: {
        opacity: 0,
        y: 50,
        scale: 0.7,
        transformOrigin: "center bottom"
    },
    hidden: {
        opacity: 0,
        y: 50,
        scale: 0.7,
        transformOrigin: "center bottom"
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            damping: 20,
            stiffness: 300,
            mass: 0.8,
            duration: 0.7,
            bounce: 0.25,
            delayChildren: 0.1,
            staggerChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        y: -50,
        scale: 0.8,
        transformOrigin: "center top",
        transition: {
            type: 'spring',
            damping: 12,
            stiffness: 200,
            mass: 0.5,
            duration: 0.4
        }
    }
};

const CardSharedAnimation: React.FC<CardSharedAnimationProps> = ({
    children,
    isVisible = true,
    variants = undefined,
    className = ""
}) => {
    const finalVariants = variants && Object.keys(variants).length > 0 ? variants : cardContainerVariants;

    return (
        <AnimatePresence mode="sync">
            {isVisible && (
                <motion.div
                    key="card-animation"
                    initial="initial"
                    animate="visible"
                    exit="exit"
                    variants={finalVariants}
                    className={className}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CardSharedAnimation;