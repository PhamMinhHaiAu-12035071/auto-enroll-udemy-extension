import React from 'react';
import './style.scss';

interface ButtonProps {
    text?: string;
    backgroundColor?: string;
    shadowColor?: string;
    borderRadius?: string | number;
}

const Button: React.FC<ButtonProps> = ({
    text = "Push me",
    backgroundColor = "hsl(345deg 100% 47%)",
    shadowColor,
    borderRadius = "12px"
}) => {
    // Tự động tính toán màu shadow nếu không được cung cấp
    const calculatedShadowColor = shadowColor || calculateShadowColor(backgroundColor);

    // Chuyển đổi borderRadius thành chuỗi với đơn vị px nếu là số
    const formattedBorderRadius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;

    const pushableStyle = {
        background: calculatedShadowColor,
        borderRadius: formattedBorderRadius
    };

    const frontStyle = {
        background: backgroundColor,
        borderRadius: formattedBorderRadius
    };

    return (
        <div className={`pushable`} style={pushableStyle}>
            <span className={`front`} style={frontStyle}>
                {text}
            </span>
        </div>
    );
};

// Hàm tính toán màu shadow từ màu chính
const calculateShadowColor = (color: string): string => {
    // Xử lý màu HSL
    if (color.includes('hsl')) {
        const hslMatch = color.match(/hsl\((\d+)deg\s+(\d+)%\s+(\d+)%\)/);
        if (hslMatch) {
            const hue = Math.max(0, parseInt(hslMatch[1]) - 5); // Giảm hue 5 độ
            const saturation = parseInt(hslMatch[2]); // Giữ nguyên saturation
            const lightness = Math.max(0, parseInt(hslMatch[3]) - 15); // Giảm lightness 15%
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