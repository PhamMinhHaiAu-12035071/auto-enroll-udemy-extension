import { motion } from "framer-motion";
import React, { Children, isValidElement } from "react";
import { nanoid } from "nanoid";

const generateKey = (child: React.ReactNode) => {
    return isValidElement(child) && child.key !== null ? child.key : nanoid();
};

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
                {Children.map(children, (child, i) => {
                    if (!isValidElement(child) || child.key === null) {
                        console.warn(
                            `Child at position ${i} in Pager does not have a key. ` +
                            `All children of Pager must have explicit keys.`
                        );
                    }

                    return (
                        <div
                            key={generateKey(child)}
                            className="flex flex-col w-full self-stretch justify-start flex-shrink-0 h-full overflow-hidden outline-none"
                            aria-hidden={value !== i}
                            tabIndex={value === i ? 0 : -1}
                        >
                            {child}
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default Pager; 