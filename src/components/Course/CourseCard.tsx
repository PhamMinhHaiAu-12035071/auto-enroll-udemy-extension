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
    borderColor?: string;
}

// Component hiển thị hình ảnh khóa học
const CourseImage: React.FC<{
    src: string;
    alt: string;
    borderRadius: string;
}> = ({ src, alt, borderRadius }) => {
    const imageWrapperStyle = {
        borderRadius,
        overflow: 'hidden'
    };

    return (
        <div style={imageWrapperStyle} className="w-2/5 m-2">
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
            />
        </div>
    );
};

// Component hiển thị tiêu đề khóa học
const CourseTitle: React.FC<{ title: string }> = ({ title }) => (
    <h3 className="font-bold text-[var(--color-text)] text-lg truncate font-craft">
        {title}
    </h3>
);

// Component hiển thị đánh giá sao
const CourseRating: React.FC<{ rating?: number | null; courseId: number }> = ({ rating, courseId }) => {
    const FaStarIcon = FaStar as React.ElementType;

    if (!rating) return null;

    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
                <FaStarIcon
                    key={`star-${courseId}-${index}`}
                    size={16}
                    color={rating > index ? "var(--color-star-active)" : "var(--color-star-inactive)"}
                />
            ))}
        </div>
    );
};

// Component hiển thị ngôn ngữ khóa học
const CourseLanguage: React.FC<{ language?: string | null }> = ({ language }) => (
    <div className="ml-auto text-[var(--color-text)] text-xs bg-white/20 px-2 py-1 rounded-full font-craft-demi">
        {language ?? "English"}
    </div>
);

// Component hiển thị tác giả khóa học
const CourseAuthors: React.FC<{ authors?: string[] }> = ({ authors }) => (
    <p className="text-[var(--color-text)] text-sm opacity-90 font-craft-demi">
        By {authors?.length ? authors.join(", ") : "Unknown Instructor"}
    </p>
);

const CourseCard: React.FC<CourseCardProps> = ({
    id,
    coupon,
    backgroundColor = "hsl(345deg 100% 47%)",
    shadowColor,
    borderRadius = "12px",
    borderColor
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
        <div className="course-card font-craft">
            <div className={`pushable`} style={pushableStyle}>
                <div className={`front flex flex-row`} style={frontStyle}>
                    <CourseImage
                        src={coupon.image?.src ?? ""}
                        alt={coupon.title || "Course"}
                        borderRadius={formattedBorderRadius}
                    />

                    <div className="p-4 w-3/5">
                        <CourseTitle title={coupon.title} />

                        <div className="flex items-center mt-2">
                            <div className="flex items-center font-craft-demi">
                                <CourseRating rating={coupon.rating} courseId={id} />
                            </div>
                            <CourseLanguage language={coupon.language} />
                        </div>

                        <div className="mt-3">
                            <CourseAuthors authors={coupon.authors} />
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
    return "hsl(340deg 100% 32%)";
}

export default CourseCard;