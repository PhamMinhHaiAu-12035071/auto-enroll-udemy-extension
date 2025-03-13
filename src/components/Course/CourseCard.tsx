import React from 'react';
import './style.scss';
import { Coupon } from '../../type';
import { FaStar } from 'react-icons/fa';

interface CourseCardProps {
    id: number;
    coupon: Coupon;
    backgroundColor?: string;
    shadowColor?: string;
    borderRadius?: string | number;
}

const CourseCard: React.FC<CourseCardProps> = ({
    id,
    coupon,
    backgroundColor = "hsl(345deg 100% 47%)",
    shadowColor,
    borderRadius = "12px"
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
        borderRadius: formattedBorderRadius
    };

    // Style for the image wrapper to match the top part of the card
    const imageWrapperStyle = {
        borderRadius: formattedBorderRadius,
        overflow: 'hidden'
    };

    const FaStarIcon = FaStar as React.ElementType;

    return (
        <div className="course-card font-craft">
            <div className={`pushable`} style={pushableStyle}>
                <div className={`front flex flex-row`} style={frontStyle}>
                    <div style={imageWrapperStyle} className="w-2/5 m-2">
                        <img
                            src={"https://img-c.udemycdn.com/course/240x135/1362070_b9a1_2.jpg"}
                            alt="Course"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="p-4 w-3/5">
                        <h3 className="font-bold text-[var(--color-text)] text-lg truncate font-craft">
                            {coupon.title}
                        </h3>

                        <div className="flex items-center mt-2">
                            <div className="flex items-center font-craft-demi">
                                {coupon.rating && (
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, index) => (
                                            <FaStarIcon
                                                key={`star-${id}-${index}`}
                                                size={16}
                                                color={coupon.rating && coupon.rating > index ? "var(--color-star-active)" : "var(--color-star-inactive)"}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="ml-auto text-[var(--color-text)] text-xs bg-white/20 px-2 py-1 rounded-full font-craft-demi">
                                {coupon.language ?? "English"}
                            </div>
                        </div>

                        <div className="mt-3">
                            <p className="text-[var(--color-text)] text-sm opacity-90 font-craft-demi">
                                By {coupon.authors?.length ? coupon.authors.join(", ") : "Unknown Instructor"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Hàm tính toán màu shadow từ màu chính
const calculateShadowColor = (color: string): string => {
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

export default CourseCard;