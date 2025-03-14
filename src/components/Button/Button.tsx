import React from 'react';
import './style.scss';

interface ButtonProps {
    text?: string;
    backgroundColor?: string;
    shadowColor?: string;
    borderRadius?: string | number;
    borderColor?: string;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
    text = "Push me",
    backgroundColor = "hsl(345deg 100% 47%)",
    shadowColor,
    borderRadius = "12px",
    borderColor = "hsl(345deg 100% 47%)",
    onClick
}) => {
    // Tự động tính toán màu shadow nếu không được cung cấp
    const calculatedShadowColor = shadowColor ?? calculateShadowColor(backgroundColor);

    // Chuyển đổi borderRadius thành chuỗi với đơn vị px nếu là số
    const formattedBorderRadius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;

    const pushableStyle = {
        background: calculatedShadowColor,
        borderRadius: formattedBorderRadius
    };

    const frontStyle = {
        background: backgroundColor,
        borderRadius: formattedBorderRadius,
        border: borderColor ? `1px solid ${borderColor}` : undefined
    };

    return (
        <div className="app-button">
            <button
                className={`pushable`}
                style={pushableStyle}
                onClick={onClick}
                type="button"
            >
                <span className={`front font-craft-demi`} style={frontStyle}>
                    {text}
                </span>
            </button>
        </div>
    );
};

// Hàm tính toán màu shadow từ màu chính
const calculateShadowColor = (color: string): string => {
    // Xử lý màu HSL
    if (color.includes('hsl')) {
        const hslRegex = /hsl\((\d+)deg\s+(\d+)%\s+(\d+)%\)/;
        const match = hslRegex.exec(color);
        if (match) {
            const hue = Math.max(0, parseInt(match[1]) - 5);
            const saturation = parseInt(match[2]);
            const lightness = Math.max(0, parseInt(match[3]) - 15);
            return `hsl(${hue}deg ${saturation}% ${lightness}%)`;
        }
    }

    // Xử lý màu HEX hoặc các định dạng khác
    // Nếu không phải HSL, trả về màu tối hơn mặc định
    return color === "hsl(345deg 100% 47%)" ? "hsl(340deg 100% 32%)" : darkenColor(color);
}

// Hàm hỗ trợ làm tối màu cho các định dạng khác
const darkenColor = (color: string): string => {
    // Đơn giản hóa: trả về màu tối hơn mặc định
    // Trong thực tế, bạn có thể muốn thêm logic để xử lý các định dạng màu khác (HEX, RGB, v.v.)
    return "hsl(340deg 100% 32%)";
}

export default Button;