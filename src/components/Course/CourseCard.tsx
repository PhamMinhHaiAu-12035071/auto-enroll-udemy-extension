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

    // Style for the image wrapper to match the top part of the card
    const imageWrapperStyle = {
        borderTopLeftRadius: formattedBorderRadius,
        borderTopRightRadius: formattedBorderRadius,
        borderBottomLeftRadius: formattedBorderRadius,
        borderBottomRightRadius: formattedBorderRadius,
        overflow: 'hidden'
    };

    const FaStarIcon = FaStar as React.ElementType;

    return (
        <div className="course-card font-craft">
            <div className={`pushable`} style={pushableStyle}>
                <div className={`front`} style={frontStyle}>
                    {/* Đây là nội dung phía trên */}
                    <div style={imageWrapperStyle}>
                        <img
                            src={"https://img-c.udemycdn.com/course/240x135/1362070_b9a1_2.jpg"}
                            alt="Course"
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    <div className="p-4">
                        <h3 className="font-bold text-white text-lg truncate font-craft">{coupon.title}</h3>

                        <div className="flex items-center mt-2">
                            <div className="flex items-center font-craft-demi">
                                {coupon.rating && (
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, index) => (
                                            <FaStarIcon
                                                key={index}
                                                size={16}
                                                color={coupon.rating && coupon.rating > index ? "#FFA500" : "#808080"}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="ml-auto text-white text-xs bg-white/20 px-2 py-1 rounded-full font-craft-demi">
                                {coupon.language || "English"}
                            </div>
                        </div>

                        <div className="mt-3">
                            <p className="text-white text-sm opacity-90 font-craft-demi">
                                By {coupon.authors?.length ? coupon.authors.join(", ") : "Unknown Instructor"}
                            </p>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1">
                            {coupon.topics?.slice(0, 3).map((topic, index) => (
                                <span key={index} className="text-xs bg-white/30 text-white px-2 py-1 rounded-full font-craft-demi">
                                    {topic}
                                </span>
                            ))}
                            {coupon.topics?.length > 3 && (
                                <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full font-craft-demi">
                                    +{coupon.topics.length - 3}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
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

export default CourseCard;