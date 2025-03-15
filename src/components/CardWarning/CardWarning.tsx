import React from 'react';

interface CardWarningProps {
    title: string;
    message: string;
    className?: string;
}

const CardWarning: React.FC<CardWarningProps> = ({
    title,
    message,
    className = ''
}) => {
    return (
        <div className={`card-warning rounded-3xl bg-[#FEF8F3] p-6 shadow-2xs border-4 border-white ${className}`}>
            <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 rounded-full bg-[#FEF2E1] flex items-center justify-center">
                        <span className="text-[#F6A723] text-2xl font-bold">!</span>
                    </div>
                </div>
                <div className="flex-1">
                    <h3 className="text-[var(--color-dark)] text-xl font-bold mb-2 font-craft-cd">
                        {title}
                    </h3>
                    <p className="text-[var(--color-dark)] font-craft-cd">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CardWarning;