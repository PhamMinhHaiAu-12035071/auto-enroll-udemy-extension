import { motion, Variants } from 'framer-motion';
import gsap from 'gsap';
import React, { useEffect, useRef } from 'react';
import './style.scss';



// SVG animation variants
const svgVariants: Variants = {
    initial: {
        rotate: 0
    },
    animate: {
        rotate: [0, 2, 0, -2, 0],
        transition: {
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop" as const
        }
    }
};

const BeginVisitUdemy = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const shadowRef = useRef<HTMLDivElement>(null);
    const pathLineRefs = useRef<SVGPathElement[]>([]);

    // Animation cho SVG và bóng đổ
    useEffect(() => {
        if (!svgRef.current || !shadowRef.current) return;

        // Tạo animation nhẹ nhàng cho SVG và bóng đổ
        const tlSvg = gsap.timeline({ repeat: -1 });

        // Khi SVG di chuyển lên, bóng đổ thu nhỏ lại và ngược lại
        tlSvg.to([svgRef.current, shadowRef.current], {
            y: (i) => i === 0 ? -5 : 0, // SVG di chuyển lên, bóng đổ giữ nguyên vị trí
            scale: (i) => i === 0 ? 1 : 0.85, // SVG giữ nguyên kích thước, bóng đổ thu nhỏ
            opacity: (i) => i === 0 ? 1 : 0.6, // SVG giữ nguyên độ mờ, bóng đổ mờ hơn
            duration: 1.5,
            ease: "power1.inOut"
        }).to([svgRef.current, shadowRef.current], {
            y: 0,
            scale: (i) => 1, // SVG giữ nguyên kích thước, bóng đổ trở lại kích thước ban đầu
            opacity: (i) => i === 0 ? 1 : 0.8, // SVG giữ nguyên độ mờ, bóng đổ trở lại độ mờ ban đầu
            duration: 1.5,
            ease: "power1.inOut"
        });

        return () => {
            tlSvg.kill();
        };
    }, []);

    // Animation cho các path lines
    useEffect(() => {
        // Đảm bảo các refs đã được gán và component đang hiển thị
        if (pathLineRefs.current.length === 0) return;

        // Lấy tất cả các đường path lines
        const pathLines = pathLineRefs.current;

        // Thiết lập ban đầu: Tất cả các đường đều ẩn
        pathLines.forEach(line => {
            // Tính toán độ dài của path
            const length = line.getTotalLength();

            // Thiết lập để đường biến mất ban đầu (hiệu ứng đường vẽ)
            gsap.set(line, {
                strokeDasharray: length,
                strokeDashoffset: length,
                opacity: 0
            });
        });

        // Tạo timeline cho animation tuần tự với stagger
        const tlPathLines = gsap.timeline({
            repeat: -1,
            repeatDelay: 0.3,
        });

        // Sử dụng stagger cho các đường để tạo cảm giác chuyển động liên tục
        tlPathLines.to(pathLines, {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power4.out",
            stagger: {
                amount: 0.2,
                from: "start",
                ease: "power2.inOut"
            }
        }).to(pathLines, {
            opacity: 0,
            duration: 0.2,
            ease: "power2.in",
            stagger: {
                amount: 0.15,
                from: "start"
            }
        }, "+=0.1");

        return () => {
            // Cleanup
            tlPathLines.kill();
            pathLines.forEach(line => gsap.killTweensOf(line));
        };
    }, []);

    // Hàm để thêm ref vào mảng
    const addToRefs = (el: SVGPathElement | null) => {
        if (el && !pathLineRefs.current.includes(el)) {
            pathLineRefs.current.push(el);
        }
    };

    return (
        <div className={`app-begin-visit-udemy`}>
            <div className={`pushable`}>
                <span className={`front font-craft-demi`}>
                    Begin visit to Udemy website
                    <div className="app-begin-visit-udemy-img">
                        {/* Thêm bóng đổ */}
                        <div
                            ref={shadowRef}
                            className="shadow-element"
                        ></div>

                        <motion.svg
                            ref={svgRef}
                            width="392"
                            height="348"
                            viewBox="0 0 392 348"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            variants={svgVariants}
                            initial="initial"
                            animate="animate"
                        >
                            <path d="M133.259 212.835C139.997 207.735 149.593 209.063 154.692 215.801L178.723 247.552C183.533 253.907 182.28 262.957 175.925 267.767C169.571 272.576 160.52 271.324 155.711 264.969L130.624 231.822C128.455 228.957 127.514 225.347 128.006 221.787C128.499 218.228 130.386 215.009 133.251 212.841L133.259 212.835Z" fill="#61DA80" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M135.67 211.51L115.67 219.71C107.883 222.903 104.158 231.803 107.35 239.59C108.883 243.329 111.839 246.306 115.568 247.865C119.297 249.423 123.492 249.436 127.23 247.9L141.6 242.18" fill="#61DA80" />
                            <path d="M135.67 211.51L115.67 219.71C107.883 222.903 104.158 231.803 107.35 239.59V239.59C108.883 243.329 111.839 246.306 115.568 247.865C119.297 249.423 123.492 249.436 127.23 247.9L141.6 242.18" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M176.71 266.72L208.56 240C211.493 237.543 213.329 234.022 213.665 230.211C214.001 226.4 212.808 222.611 210.35 219.68C207.888 216.743 204.36 214.907 200.542 214.575C196.725 214.243 192.932 215.443 190 217.91L166.89 237.12" fill="#61DA80" />
                            <path d="M176.71 266.72L208.56 240C211.493 237.543 213.329 234.022 213.665 230.211C214.001 226.4 212.808 222.611 210.35 219.68V219.68C207.888 216.743 204.36 214.907 200.542 214.575C196.725 214.243 192.932 215.443 190 217.91L166.89 237.12" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M306.881 341.071C299.16 344.506 290.117 341.031 286.683 333.31L270.5 296.927C267.269 289.663 270.521 281.155 277.774 277.898C281.273 276.33 285.251 276.219 288.832 277.59C292.413 278.96 295.301 281.699 296.859 285.202L313.754 323.184C315.215 326.467 315.311 330.197 314.022 333.551C312.733 336.906 310.164 339.611 306.881 341.071Z" fill="#61DA80" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M304.25 341.79L324.01 333.09C327.712 331.464 330.615 328.433 332.08 324.664C333.545 320.896 333.451 316.699 331.82 313C328.429 305.301 319.442 301.805 311.74 305.19L302.09 309.33" fill="#61DA80" />
                            <path d="M304.25 341.79L324.01 333.09C327.712 331.464 330.615 328.433 332.08 324.664C333.545 320.896 333.451 316.699 331.82 313V313C328.429 305.301 319.442 301.805 311.74 305.19L302.09 309.33" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M298.71 289.34L278.63 249.46C274.995 242.37 266.305 239.565 259.21 243.19C252.116 246.821 249.309 255.516 252.94 262.61L272.12 300.55" fill="#61DA80" />
                            <path d="M298.71 289.34L278.63 249.46C274.995 242.37 266.305 239.565 259.21 243.19V243.19C252.116 246.821 249.309 255.516 252.94 262.61L272.12 300.55" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M337.76 55.08C337.76 55.08 325.11 15.08 348.57 21.71C372.03 28.34 362.1 65.94 362.1 65.94" fill="#61DA80" />
                            <path d="M337.76 55.08C337.76 55.08 325.11 15.08 348.57 21.71C372.03 28.34 362.1 65.94 362.1 65.94" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="267.97" cy="140.33" r="120.78" fill="#61DA80" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                            <ellipse cx="362.844" cy="100.45" rx="10.18" ry="15.34" transform="rotate(-28.83 362.844 100.45)" fill="#BAFFCC" />
                            <path d="M303.63 34.82C303.63 34.82 280.63 -11.42 266.86 8.66003C253.09 28.74 284.78 51.3 284.78 51.3" fill="#61DA80" />
                            <path d="M303.63 34.82C303.63 34.82 280.63 -11.42 266.86 8.66003C253.09 28.74 284.78 51.3 284.78 51.3" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M191.51 145.78C191.51 145.78 104.14 143.3 119.07 119.26C127.81 105.17 161.36 104.76 177.28 106.08" fill="#61DA80" />
                            <path d="M191.51 145.78C191.51 145.78 104.14 143.3 119.07 119.26C127.81 105.17 161.36 104.76 177.28 106.08" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M305.55 153C291.06 160.17 301.32 171.28 317.22 170.94C325.89 184.36 344.22 192.05 341.45 172.79" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                            <ellipse cx="302.174" cy="133.869" rx="13.61" ry="8.58" transform="rotate(-61.08 302.174 133.869)" fill="black" />
                            <ellipse cx="358.519" cy="164.994" rx="13.61" ry="8.58" transform="rotate(-61.08 358.519 164.994)" fill="black" />
                            <path d="M349.03 154.97L370.3 153.12" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M317.79 138.59L303.61 112.78" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

                            {/* Path lines với animation */}
                            <path
                                ref={addToRefs}
                                d="M3.22998 159.1H107.88"
                                stroke="black"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                ref={addToRefs}
                                d="M45.0898 183.49H128.9"
                                stroke="black"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                ref={addToRefs}
                                d="M79.48 77.15H121.38"
                                stroke="black"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </motion.svg>
                    </div>
                </span>
            </div>
        </div>
    );
};

export default BeginVisitUdemy;