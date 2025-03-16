import React from 'react';
import AppIconButton from './AppIconButton/AppIconButton';
import { useStore } from '../hooks/useStore';
interface HeaderProps {
    title: string;
    isShowIcon?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, isShowIcon = true }) => {
    const store = useStore();
    const handleClick = () => {
        store.clearAllData();
    }
    return (
        <header className="bg-primary text-black p-4 flex items-center justify-center border-b-2 border-[var(--color-dark)] relative">
            <h1 className="text-2xl font-craft-demi">{title}</h1>

            {isShowIcon && (
                <div className="absolute right-4 top-3">
                    <AppIconButton onClick={handleClick} />
                </div>
            )}
        </header >
    );
};

export default Header; 