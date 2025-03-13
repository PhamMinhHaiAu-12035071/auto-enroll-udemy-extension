import React from 'react';
import './style.scss';

interface ButtonProps {
    text: string;
}

const Button: React.FC<ButtonProps> = ({ text }) => {
    return (
        <button className="pushable">
            <span className="front">
                {text}
            </span>
        </button>
    );
};

export default Button;
