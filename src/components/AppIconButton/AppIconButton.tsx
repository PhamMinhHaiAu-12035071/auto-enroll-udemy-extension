import React from 'react';
import './style.scss';
import { FaTrash } from "react-icons/fa";

interface AppIconButtonProps {
    onClick?: () => void;
    className?: string;
}

const AppIconButton: React.FC<AppIconButtonProps> = ({ onClick, className }) => {
    const FaTrashIcon = FaTrash as React.ElementType;
    return (
        <div className={`app-icon-button ${className}`}>
            <button className="pushable" onClick={onClick}>
                <span className="front">
                    <FaTrashIcon />
                </span>
            </button>
        </div>
    );
};


export default AppIconButton;