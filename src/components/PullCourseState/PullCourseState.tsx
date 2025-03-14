import React, { useEffect, useRef } from 'react';
import './style.scss';
import gsap from 'gsap';

const PullCourseState = () => {
    // Tạo refs cho các đường bay
    const speedLineRefs = useRef<SVGPathElement[]>([]);

    useEffect(() => {
        // Đảm bảo các refs đã được gán
        if (speedLineRefs.current.length === 0) return;

        // Lấy tất cả các đường speed line
        const speedLines = speedLineRefs.current;

        // Thiết lập ban đầu: Tất cả các đường đều ẩn
        speedLines.forEach(line => {
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
        const tl = gsap.timeline({
            repeat: -1,
            repeatDelay: 0.1,
        });

        // Sử dụng stagger cho các đường để tạo cảm giác chuyển động liên tục
        tl.to(speedLines, {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 0.2,
            ease: "power4.out",
            stagger: {
                amount: 0.15,
                from: "edges",
                ease: "power2.inOut"
            }
        }).to(speedLines, {
            opacity: 0,
            duration: 0.15,
            ease: "power2.in",
            stagger: {
                amount: 0.1,
                from: "start"
            }
        }, "+=0.05");

        return () => {
            // Cleanup
            tl.kill();
            speedLines.forEach(line => gsap.killTweensOf(line));
        };
    }, []);

    // Hàm để thêm ref vào mảng
    const addToRefs = (el: SVGPathElement | null) => {
        if (el && !speedLineRefs.current.includes(el)) {
            speedLineRefs.current.push(el);
        }
    };

    return (
        <div className="app-pull-course-state">
            <div className={`pushable`}>
                <span className={`front font-craft-demi`}>
                    {`Bot starts pulling courses`}
                    <div className="pull-course-state-img">
                        <svg width="510" height="266" viewBox="0 0 510 266" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M249.923 181.485C246.481 174.31 249.496 165.703 256.664 162.246L317.563 132.924C323.21 130.205 329.993 132.579 332.713 138.227L336.144 145.353C338.444 150.13 336.436 155.868 331.659 158.168L269.184 188.249C265.733 189.907 261.764 190.126 258.152 188.858C254.539 187.589 251.579 184.937 249.923 181.485Z" fill="#72A7FF" stroke="black" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M263.39 189.82L221.92 192.54C218.102 192.792 214.34 191.517 211.463 188.994C208.586 186.471 206.829 182.908 206.58 179.09C206.06 171.152 212.063 164.29 220 163.75L261.5 161" fill="#72A7FF" />
                            <path d="M263.39 189.82L221.92 192.54C218.102 192.792 214.34 191.517 211.463 188.994C208.586 186.471 206.829 182.908 206.58 179.09V179.09C206.06 171.152 212.063 164.29 220 163.75L261.5 161" stroke="black" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M300.32 141.23L317.56 132.93C323.204 130.217 329.98 132.589 332.7 138.23L343.79 161.23C347.439 168.813 344.252 177.919 336.67 181.57C329.087 185.22 319.981 182.032 316.33 174.45L312.84 167.2" fill="#72A7FF" />
                            <path d="M300.32 141.23L317.56 132.93C323.204 130.217 329.98 132.589 332.7 138.23L343.79 161.23C347.439 168.813 344.252 177.919 336.67 181.57V181.57C329.087 185.22 319.981 182.032 316.33 174.45L312.84 167.2" stroke="black" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M256.494 205.271C255.379 197.381 260.87 190.081 268.76 188.965L335.654 179.505C341.86 178.628 347.602 182.947 348.48 189.153L349.587 196.984C350.329 202.233 346.676 207.09 341.427 207.832L272.79 217.538C264.904 218.648 257.61 213.157 256.494 205.271H256.494Z" fill="#72A7FF" stroke="black" stroke-width="5.9991" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M268.3 216.81L226.76 215.36C218.796 215.078 212.569 208.394 212.85 200.43C213.132 192.47 219.81 186.245 227.77 186.52L269.31 188" fill="#72A7FF" />
                            <path d="M268.3 216.81L226.76 215.36C218.796 215.078 212.569 208.394 212.85 200.43V200.43C213.132 192.47 219.81 186.245 227.77 186.52L269.31 188" stroke="black" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M315.06 181.06L334 178.3C336.977 177.866 340.005 178.632 342.417 180.431C344.829 182.229 346.427 184.913 346.86 187.89L350.55 213.18C351.133 217.178 350.104 221.245 347.688 224.484C345.272 227.723 341.669 229.869 337.67 230.45C329.342 231.665 321.605 225.898 320.39 217.57L319.23 209.57" fill="#72A7FF" />
                            <path d="M315.06 181.06L334 178.3C336.977 177.866 340.005 178.632 342.417 180.431C344.829 182.229 346.427 184.913 346.86 187.89L350.55 213.18C351.133 217.178 350.104 221.245 347.688 224.484C345.272 227.723 341.669 229.869 337.67 230.45V230.45C329.342 231.665 321.605 225.898 320.39 217.57L319.23 209.57" stroke="black" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M241.92 161.76C334.67 155.66 391.92 122.03 449.97 66.3701C449.97 66.3701 424.09 72.8601 405.14 60.0101C394.65 52.9001 390.31 36.3601 372.71 29.8201C349.43 21.1701 331.97 31.3101 315.84 26.5201C308.018 24.1651 301.531 18.6569 297.94 11.3201C287.71 46.8601 261.53 82.0801 205.94 103.57L241.92 161.76Z" fill="#FF79AB" stroke="black" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M312.17 45.8301C308.7 52.7201 303.33 60.1601 298.83 65.8901" stroke="black" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M296.64 109.54C315.37 106.8 345.3 100.19 368.56 84.54" stroke="black" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M74.0001 177.19C74.0001 177.19 -6.27986 168.54 4.53014 194.69C15.3401 220.84 80.6801 222.36 80.6801 222.36" fill="#72A7FF" />
                            <path d="M74.0001 177.19C74.0001 177.19 -6.27986 168.54 4.53014 194.69C15.3401 220.84 80.6801 222.36 80.6801 222.36" stroke="black" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M94.9998 26.6399C94.9998 26.6399 63.4998 19.5599 49.4998 25.4499C35.4998 31.3399 45.4998 70.5999 45.4998 70.5999" fill="#72A7FF" />
                            <path d="M94.9998 26.6399C94.9998 26.6399 63.4998 19.5599 49.4998 25.4499C35.4998 31.3399 45.4998 70.5999 45.4998 70.5999" stroke="black" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
                            <circle cx="147.64" cy="124.31" r="120.78" fill="#72A7FF" stroke="black" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M67.9 104.3C58.68 117.58 73.04 122.3 86.78 114.36C100.86 121.92 120.67 119.77 108.9 104.26" stroke="black" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
                            <ellipse cx="55.6498" cy="89.14" rx="8.58" ry="13.61" fill="black" />
                            <ellipse cx="120.01" cy="89.14" rx="8.58" ry="13.61" fill="black" />
                            <ellipse cx="112.839" cy="28.2162" rx="19.02" ry="9.2" transform="rotate(-20.71 112.839 28.2162)" fill="#9BC3FF" />
                            <path d="M195 25.54C195 25.54 220.9 19.54 234.89 25.45C248.88 31.36 237.79 79.84 237.79 79.84" fill="#72A7FF" />
                            <path d="M195 25.54C195 25.54 220.9 19.54 234.89 25.45C248.88 31.36 237.79 79.84 237.79 79.84" stroke="black" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M75.1899 158.19C75.1899 158.19 80.3199 130.46 90.5899 130.97C99.2999 131.39 109.08 137.97 109.24 144.59C109.44 153.06 86.1599 161.05 86.1599 161.05" fill="#FF79AB" />
                            <path d="M75.1899 158.19C75.1899 158.19 80.3199 130.46 90.5899 130.97C99.2999 131.39 109.08 137.97 109.24 144.59C109.44 153.06 86.1599 161.05 86.1599 161.05" stroke="black" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M77.55 154.46C77.55 154.46 70.64 128.18 60.65 130.6C52.17 132.66 42.36 138.44 43.45 144.96C44.85 153.32 66.04 160.96 66.04 160.96" fill="#FF79AB" />
                            <path d="M77.55 154.46C77.55 154.46 70.64 128.18 60.65 130.6C52.17 132.66 42.36 138.44 43.45 144.96C44.85 153.32 66.04 160.96 66.04 160.96" stroke="black" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
                            <rect x="22.6475" y="153.273" width="111.83" height="103.11" transform="rotate(3.2 22.6475 153.273)" fill="white" stroke="black" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
                            <rect x="56.1953" y="155.149" width="44.63" height="103.11" transform="rotate(3.2 56.1953 155.149)" fill="#FF79AB" stroke="black" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M161.24 185.68C138.24 184.32 109.4 185.73 116.01 203.35C122.23 219.91 145.82 227.04 165.81 230.45" fill="#72A7FF" />
                            <path d="M161.24 185.68C138.24 184.32 109.4 185.73 116.01 203.35C122.23 219.91 145.82 227.04 165.81 230.45" stroke="black" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />

                            {/* Sử dụng các đường tốc độ từ SVG gốc */}
                            <path
                                ref={addToRefs}
                                d="M482.63 171.61H506.51"
                                stroke="black"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                ref={addToRefs}
                                d="M405.66 171.61H470.5"
                                stroke="black"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                ref={addToRefs}
                                d="M461.46 195.5H489.09"
                                stroke="black"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                ref={addToRefs}
                                d="M430.69 142.65H457.57"
                                stroke="black"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </span>
            </div>
        </div>
    );
};
export default PullCourseState;