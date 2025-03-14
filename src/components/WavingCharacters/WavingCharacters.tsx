import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './WavingCharacters.scss';

const WavingCharacters = () => {
    const purpleArmRef = useRef<SVGPathElement>(null);
    const purpleArmStrokeRef = useRef<SVGPathElement>(null);
    const greenArmRef = useRef<SVGPathElement>(null);
    const greenArmStrokeRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        if (!purpleArmRef.current || !greenArmRef.current ||
            !purpleArmStrokeRef.current || !greenArmStrokeRef.current) return;

        const purpleArm = purpleArmRef.current;
        const purpleArmStroke = purpleArmStrokeRef.current;
        const greenArm = greenArmRef.current;
        const greenArmStroke = greenArmStrokeRef.current;

        // Thiết lập lại transformOrigin chính xác dựa trên điểm kết nối của cánh tay
        gsap.set([purpleArm, purpleArmStroke], {
            transformOrigin: '33.9px 239.09px', // Chính xác điểm đầu path
            svgOrigin: '0 0'
        });

        // Đặt greenArm ở trạng thái của bước 1 ngay từ đầu
        gsap.set([greenArm, greenArmStroke], {
            transformOrigin: '389.83px 236.67px', // Chính xác điểm đầu path
            svgOrigin: '0 0',
            // Giá trị từ bước 1 - chỉ dùng thuộc tính 2D
            rotation: 2, // Thay thế rotationZ
            scaleX: 1.08,
            scaleY: 1.08,
            scale: 1.08
        });

        // Purple arm animation - đơn giản hơn
        const purpleArmTimeline = gsap.timeline({
            repeat: -1,
            repeatDelay: 0.5,
            onComplete: () => {
                gsap.set([purpleArm, purpleArmStroke], { rotation: 0 });
            }
        });

        purpleArmTimeline
            .to([purpleArm, purpleArmStroke], {
                rotation: -5,
                duration: 0.5,
                ease: 'power1.out'
            })
            .to([purpleArm, purpleArmStroke], {
                rotation: 5,
                duration: 0.4,
                ease: 'power1.inOut'
            })
            .to([purpleArm, purpleArmStroke], {
                rotation: 0,
                duration: 0.5,
                ease: 'power2.inOut'
            });

        // Green arm animation - bỏ qua bước 1
        const greenArmTimeline = gsap.timeline({
            repeat: -1,
            repeatDelay: 0.8,
            delay: 0.3,
            onComplete: () => {
                // Đặt về trạng thái của bước 1 khi kết thúc
                gsap.set([greenArm, greenArmStroke], {
                    rotation: 2, // Thay thế rotationZ
                    scaleX: 1.08,
                    scaleY: 1.08,
                    scale: 1.08
                });
            }
        });

        greenArmTimeline
            // Bỏ qua bước 1, bắt đầu từ bước 2
            .to([greenArm, greenArmStroke], {
                rotation: 5, // Thay thế rotationZ
                scaleY: 0.9,
                scaleX: 1.1,
                duration: 0.5,
                ease: 'power1.out'
            })
            // Bước 3: Trở về vị trí ban đầu (bước 1)
            .to([greenArm, greenArmStroke], {
                rotation: 2, // Thay thế rotationZ
                scale: 1.08,
                scaleX: 1.08,
                scaleY: 1.08,
                duration: 0.6,
                ease: 'power2.inOut'
            });

        return () => {
            purpleArmTimeline.kill();
            greenArmTimeline.kill();
        };
    }, []);

    return (
        <div className="waving-characters">
            <svg
                width="100%"
                height="100%"
                style={{ maxWidth: '350px', maxHeight: '340px' }}
                viewBox="0 0 412 371"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M248.53 250.11C239.71 260.5 215.58 277.89 219.89 291.62C224.2 305.35 259.7 284.24 273.89 265.48" fill="#61DA80" />
                <path d="M248.53 250.11C239.71 260.5 215.58 277.89 219.89 291.62C224.2 305.35 259.7 284.24 273.89 265.48" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M305.11 284.14C307.996 284.129 310.768 285.269 312.812 287.307C314.855 289.345 316.003 292.114 316 295V345.8C316 350.511 312.181 354.33 307.47 354.33H301.52C297.538 354.33 294.31 351.102 294.31 347.12V295C294.31 289.008 299.168 284.15 305.16 284.15L305.11 284.14Z" fill="#61DA80" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M294.27 294.76V263.52C294.267 260.643 295.408 257.884 297.441 255.848C299.475 253.813 302.233 252.67 305.11 252.67C307.995 252.659 310.765 253.798 312.808 255.834C314.851 257.87 316 260.635 316 263.52V294.76" fill="#61DA80" />
                <path d="M294.27 294.76V263.52C294.267 260.643 295.408 257.884 297.441 255.848C299.475 253.813 302.233 252.67 305.11 252.67V252.67C307.995 252.659 310.765 253.798 312.808 255.834C314.851 257.87 316 260.635 316 263.52V294.76" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M316 331.42V345.8C316 350.511 312.181 354.33 307.47 354.33H288.22C281.894 354.33 276.765 349.205 276.76 342.88C276.76 336.551 281.891 331.42 288.22 331.42H294.22" fill="#61DA80" />
                <path d="M316 331.42V345.8C316 350.511 312.181 354.33 307.47 354.33H288.22C281.894 354.33 276.765 349.205 276.76 342.88V342.88C276.76 336.551 281.891 331.42 288.22 331.42H294.22" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M345.99 283.312C351.829 281.967 357.653 285.611 358.998 291.45L370.404 340.974C371.461 345.564 368.597 350.143 364.006 351.2L358.208 352.536C354.327 353.43 350.457 351.008 349.564 347.128L337.859 296.309C337.213 293.504 337.708 290.558 339.234 288.119C340.76 285.679 343.193 283.946 345.997 283.3L345.99 283.312Z" fill="#61DA80" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M337.79 296.12L330.79 265.68C329.456 259.844 333.097 254.029 338.93 252.68C344.767 251.341 350.586 254.984 351.93 260.82L358.93 291.27" fill="#61DA80" />
                <path d="M337.79 296.12L330.79 265.68C329.456 259.844 333.097 254.029 338.93 252.68V252.68C344.767 251.341 350.586 254.984 351.93 260.82L358.93 291.27" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M367.15 327L370.38 341C370.889 343.204 370.5 345.52 369.299 347.437C368.099 349.354 366.185 350.715 363.98 351.22L345.26 355.53C339.097 356.945 332.953 353.101 331.53 346.94C330.109 340.774 333.955 334.623 340.12 333.2L346.02 331.85" fill="#61DA80" />
                <path d="M367.15 327L370.38 341C370.889 343.204 370.5 345.52 369.299 347.437C368.099 349.354 366.185 350.715 363.98 351.22L345.26 355.53C339.097 356.945 332.953 353.101 331.53 346.94V346.94C330.109 340.774 333.955 334.623 340.12 333.2L346.02 331.85" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M259.44 133.55C259.44 133.55 245.94 105.07 236.44 120.71C226.94 136.35 251.59 152 251.59 152" fill="#61DA80" />
                <path d="M259.44 133.55C259.44 133.55 245.94 105.07 236.44 120.71C226.94 136.35 251.59 152 251.59 152" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="304.25" cy="207.84" r="90.8" fill="#61DA80" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M262.23 199.62C258.97 211.33 270.34 211.16 278.12 202.08C289.99 203.96 303.51 197.53 291.32 189.44" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <ellipse cx="249.774" cy="191.861" rx="6.45" ry="10.23" transform="rotate(-19.23 249.774 191.861)" fill="black" />
                <ellipse cx="295.468" cy="175.932" rx="6.45" ry="10.23" transform="rotate(-19.23 295.468 175.932)" fill="black" />
                <ellipse cx="267.517" cy="140.049" rx="11.53" ry="7.65" transform="rotate(-35.42 267.517 140.049)" fill="#BAFFCC" />
                <path d="M300.11 119.36C300.11 119.36 293 88.6699 310.17 94.9999C327.34 101.33 317.72 129 317.72 129" fill="#61DA80" />
                <path d="M300.11 119.36C300.11 119.36 293 88.6699 310.17 94.9999C327.34 101.33 317.72 129 317.72 129" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path
                    ref={greenArmRef}
                    d="M389.83 236.67C389.83 236.67 416.75 172.39 406.68 158.55C400.78 150.45 388.6 151.89 382.77 166.8C382.77 166.8 379.07 156.72 373.92 160.08C368.77 163.44 374.26 185.9 374.26 185.9C374.26 185.9 364.26 203.5 362.21 212.43"
                    fill="#61DA80"
                />
                <path
                    ref={greenArmStrokeRef}
                    d="M389.83 236.67C389.83 236.67 416.75 172.39 406.68 158.55C400.78 150.45 388.6 151.89 382.77 166.8C382.77 166.8 379.07 156.72 373.92 160.08C368.77 163.44 374.26 185.9 374.26 185.9C374.26 185.9 364.26 203.5 362.21 212.43"
                    stroke="black"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path d="M186.66 220.41C186.66 220.41 211.61 246.79 215.74 257.93C219.87 269.07 193.68 270.78 174.14 253.56" fill="#A87DFF" />
                <path d="M186.66 220.41C186.66 220.41 211.61 246.79 215.74 257.93C219.87 269.07 193.68 270.78 174.14 253.56" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M128.92 365.58H122.97C118.259 365.58 114.44 361.761 114.44 357.05V306.23C114.44 300.238 119.298 295.38 125.29 295.38C131.282 295.38 136.14 300.238 136.14 306.23V358.37C136.14 362.352 132.912 365.58 128.93 365.58L128.92 365.58Z" fill="#A87DFF" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M136.13 306V274.77C136.133 271.893 134.992 269.133 132.959 267.098C130.925 265.063 128.167 263.92 125.29 263.92C122.412 263.92 119.653 265.063 117.618 267.098C115.583 269.133 114.44 271.892 114.44 274.77V306" fill="#A87DFF" />
                <path d="M136.13 306V274.77C136.133 271.893 134.992 269.133 132.959 267.098C130.925 265.063 128.167 263.92 125.29 263.92V263.92C122.412 263.92 119.653 265.063 117.618 267.098C115.583 269.133 114.44 271.892 114.44 274.77V306" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M114.44 342.67V357.05C114.44 361.761 118.259 365.58 122.97 365.58H142.18C148.509 365.58 153.64 360.449 153.64 354.12C153.634 347.795 148.505 342.67 142.18 342.67H136.13" fill="#A87DFF" />
                <path d="M114.44 342.67V357.05C114.44 361.761 118.259 365.58 122.97 365.58H142.18C148.509 365.58 153.64 360.449 153.64 354.12V354.12C153.634 347.795 148.505 342.67 142.18 342.67H136.13" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M78.2237 364.617L72.3674 363.566C67.7306 362.733 64.6467 358.299 65.4793 353.663L74.4613 303.643C75.5204 297.745 81.1602 293.822 87.0581 294.881C92.9561 295.94 96.8788 301.58 95.8197 307.478L86.6044 358.797C85.9006 362.716 82.1529 365.323 78.2336 364.619L78.2237 364.617Z" fill="#A87DFF" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M95.8502 307.26L101.37 276.51C102.426 270.618 98.5103 264.985 92.6202 263.92C89.784 263.399 86.8571 264.031 84.4882 265.675C82.1192 267.319 80.5039 269.841 80.0002 272.68L74.4702 303.43" fill="#A87DFF" />
                <path d="M95.8502 307.26L101.37 276.51C102.426 270.618 98.5103 264.985 92.6202 263.92V263.92C89.784 263.399 86.8571 264.031 84.4882 265.675C82.1192 267.319 80.5039 269.841 80.0002 272.68L74.4702 303.43" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M67.9998 339.51L65.4598 353.67C64.6293 358.306 67.7138 362.738 72.3498 363.57L91.2798 367C97.5062 368.116 103.459 363.976 104.58 357.75C105.69 351.525 101.552 345.576 95.3298 344.45L89.3298 343.38" fill="#A87DFF" />
                <path d="M67.9998 339.51L65.4598 353.67C64.6293 358.306 67.7138 362.738 72.3498 363.57L91.2798 367C97.5062 368.116 103.459 363.976 104.58 357.75V357.75C105.69 351.525 101.552 345.576 95.3298 344.45L89.3298 343.38" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M172.53 156.7C172.53 156.7 200.65 160.31 200.86 177.38C200.96 185.38 179.43 186.27 179.43 186.27" fill="#A87DFF" />
                <path d="M172.53 156.7C172.53 156.7 200.65 160.31 200.86 177.38C200.96 185.38 179.43 186.27 179.43 186.27" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="105.6" cy="211.88" r="90.8" fill="#A87DFF" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M127.79 202.22C136.31 210.89 126.27 216.22 115.07 212.07C105.59 219.45 90.6501 220.37 97.4001 207.39" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <ellipse cx="134.955" cy="189.424" rx="6.45" ry="10.23" transform="rotate(-9.71 134.955 189.424)" fill="black" />
                <ellipse cx="87.2544" cy="197.582" rx="6.45" ry="10.23" transform="rotate(-9.71 87.2544 197.582)" fill="black" />
                <path d="M26.7798 171.7C-10.6702 187.08 -1.73023 223.25 39.2798 193.36L26.7798 171.7Z" fill="#A87DFF" />
                <path d="M26.7798 171.7C-10.6702 187.08 -1.73023 223.25 39.2798 193.36" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <ellipse cx="152.989" cy="152.136" rx="7.65" ry="11.53" transform="rotate(-53.49 152.989 152.136)" fill="#C5A8FF" />
                <path
                    ref={purpleArmRef}
                    d="M33.9001 239.09C33.9001 239.09 7.00007 174.82 17.0501 161C22.9501 152.9 35.1301 154.34 40.9601 169.24C40.9601 169.24 44.6501 159.16 49.8101 162.52C54.9701 165.88 49.4701 188.35 49.4701 188.35C49.4701 188.35 59.4701 205.95 61.5201 214.88"
                    fill="#A87DFF"
                />
                <path
                    ref={purpleArmStrokeRef}
                    d="M33.9001 239.09C33.9001 239.09 7.00007 174.82 17.0501 161C22.9501 152.9 35.1301 154.34 40.9601 169.24C40.9601 169.24 44.6501 159.16 49.8101 162.52C54.9701 165.88 49.4701 188.35 49.4701 188.35C49.4701 188.35 59.4701 205.95 61.5201 214.88"
                    stroke="black"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path d="M236.52 89.6799C246.35 78.8799 251.73 65.1299 250.45 50.6799C247.74 20.1399 216.45 -2.02006 180.45 1.16994C144.45 4.35994 117.58 31.6899 120.29 62.2299C121.51 75.9799 128.55 88.0299 139.2 96.8399L133.83 109.79C132.37 113.31 135.99 116.79 139.21 115L154.69 106.24C177.095 115.563 202.62 113.524 223.26 100.76L238.57 106.76C239.632 107.174 240.839 106.911 241.631 106.092C242.424 105.273 242.648 104.058 242.2 103.01L236.52 89.6799Z" fill="black" />
                <path d="M177.36 35.8201L183.64 75.1801C184.013 77.5836 182.388 79.8417 179.99 80.2501C177.52 80.6201 174.5 79.1401 174.07 76.7501L172.27 63.5301L164.27 63.6001L166.13 78.8301C166.435 80.4098 165.858 82.0305 164.623 83.0615C163.387 84.0925 161.69 84.3709 160.19 83.7884C158.69 83.2059 157.625 81.8545 157.41 80.2601L150.91 39.6301C149.91 33.4401 160.07 32.1901 161.07 38.5301L163.07 54.1101L170.79 52.7201L168.59 37.2501C168.335 35.6799 168.936 34.0927 170.168 33.0864C171.4 32.0801 173.076 31.8076 174.563 32.3714C176.051 32.9353 177.125 34.2499 177.38 35.8201H177.36Z" fill="#FF79AB" />
                <path d="M196.52 47.2901L197.92 74.3701C198.047 75.9564 197.318 77.4898 196.008 78.3927C194.697 79.2957 193.005 79.431 191.568 78.7477C190.13 78.0645 189.167 76.6664 189.04 75.0801L187 48.4301C186.47 42.1701 196.08 42.3901 196.52 47.2901Z" fill="#FF79AB" />
                <path d="M186.09 37.9099L186 37.1999C185.839 34.7697 187.662 32.6617 190.09 32.4699C191.257 32.3589 192.42 32.7193 193.32 33.4706C194.219 34.2219 194.781 35.3019 194.88 36.4699L194.95 37.1799C195.14 39.6328 193.312 41.7781 190.86 41.9799C188.442 42.1051 186.347 40.318 186.09 37.9099Z" fill="#FF79AB" />
                <path d="M208.54 62L211 35.19C211.088 34.0197 211.646 32.9347 212.546 32.1815C213.446 31.4282 214.612 31.0707 215.78 31.19C216.945 31.2916 218.022 31.8528 218.772 32.7497C219.523 33.6466 219.885 34.8053 219.78 35.97L217.35 62.81C217.234 64.4067 216.264 65.816 214.814 66.4943C213.364 67.1727 211.661 67.0139 210.361 66.0794C209.061 65.1448 208.369 63.5806 208.55 61.99L208.54 62Z" fill="#FF79AB" />
                <path d="M216.47 73.0001L216.31 75.0001C216.164 76.5738 215.189 77.9499 213.752 78.6099C212.316 79.27 210.637 79.1137 209.347 78.1999C208.058 77.2862 207.354 75.7538 207.5 74.1801L207.67 72.2601C207.739 70.6373 208.692 69.1828 210.152 68.4721C211.613 67.7615 213.345 67.9092 214.665 68.8567C215.984 69.8043 216.677 71.3991 216.47 73.0101V73.0001Z" fill="#FF79AB" />
            </svg>
        </div>
    );
};

export default WavingCharacters; 