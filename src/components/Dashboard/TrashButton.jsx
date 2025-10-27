import React, { useState } from 'react';

const AnimatedTrashButton = ({
    onClick,
    title = "Delete",
    className = "",
    disabled = false,
    size = 16
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`relative transition-all duration-300 ${className}`}
            style={{
                backgroundColor: disabled
                    ? '#9ca3af'
                    : isHovered
                        ? '#ff4757'
                        : '#f5f5f5',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                border: 'none',
                borderRadius: '50%',
                width: `${size + 16}px`,
                height: `${size + 16}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                boxShadow: isHovered && !disabled
                    ? '0 0 20px rgba(220, 38, 38, 0.6), 0 0 40px rgba(220, 38, 38, 0.4), 0 0 60px rgba(220, 38, 38, 0.2)'
                    : '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
            onMouseEnter={() => !disabled && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            title={title}
        >
            {/* Animated Trash Icon */}
            <svg
                width={size}
                height={30}
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: '#0a2463' }}
            >
                {/* Trash Can Body */}
                <path
                    d="M3 5 L3 13 C3 14 3.5 14.5 4 14.5 L12 14.5 C12.5 14.5 13 14 13 13 L13 5 Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="0.5"
                />

                {/* Vertical Lines inside trash */}
                <line
                    x1="6" y1="6.5" x2="6" y2="12.5"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                />
                <line
                    x1="8" y1="6.5" x2="8" y2="12.5"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                />
                <line
                    x1="10" y1="6.5" x2="10" y2="12.5"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                />

                {/* Trash Can Lid - Opens on hover */}
                <g
                    style={{
                        transition: 'all 0.5s ease-out',
                        transform: isHovered && !disabled
                            ? 'translate(2px, -2.5px) rotate(-20deg)'
                            : 'translate(0, 0) rotate(0deg)',
                        transformOrigin: '2.5px 4.5px'
                    }}
                >
                    <rect
                        x="2"
                        y="4"
                        width="12"
                        height="1.5"
                        rx="0.5"
                        fill="currentColor"
                    />

                    {/* Handle on top of lid */}
                    <rect
                        x="5.5"
                        y="2"
                        width="5"
                        height="2"
                        rx="0.8"
                        fill="currentColor"
                    />
                </g>
            </svg>

            {/* Glow Effect on hover */}
            {isHovered && !disabled && (
                <>
                    <div
                        style={{
                            position: 'absolute',
                            inset: '-4px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                            pointerEvents: 'none',
                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                            zIndex: -1,
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            inset: '-8px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(220, 38, 38, 0.3)',
                            pointerEvents: 'none',
                            animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
                            zIndex: -1,
                        }}
                    />
                </>
            )}
        </button>
    );
};

export default AnimatedTrashButton;
