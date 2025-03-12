import React from "react";
import { motion } from "framer-motion";

interface PagerProps {
    children: React.ReactNode;
    value: number;
}

const Pager: React.FC<PagerProps> = ({ children, value }) => {
    return (
        <div className="flex flex-col overflow-hidden w-full flex-1">
            <motion.div
                className="flex-row ltr will-change-transform min-h-0 flex-1 flex"
                transition={{
                    tension: 190,
                    friction: 70,
                    mass: 0.4
                }}
                initial={false}
                animate={{ x: value * -100 + "%" }}
            >
                {React.Children.map(children, (child, i) => (
                    <div
                        key={i}
                        className="flex flex-col w-full self-stretch justify-start flex-shrink-0 h-full overflow-hidden outline-none"
                        aria-hidden={value !== i}
                        tabIndex={value === i ? 0 : -1}
                    >
                        {child}
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default Pager; 