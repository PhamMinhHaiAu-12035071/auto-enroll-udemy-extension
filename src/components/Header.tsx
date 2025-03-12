import React from 'react';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header className="bg-primary text-black p-4 flex items-center justify-center">
            <h1 className="text-xl font-craft-demi">{title}</h1>
        </header>
    );
};

export default Header; 