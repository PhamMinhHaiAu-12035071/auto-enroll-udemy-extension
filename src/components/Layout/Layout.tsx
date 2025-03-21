import React from "react";
import { motion } from "framer-motion";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{
            type: "tween",
            duration: 0.25,
            ease: "easeInOut"
        }}
        className="w-full h-full"
    >
        {children}
    </motion.div>
);

export default Layout; 