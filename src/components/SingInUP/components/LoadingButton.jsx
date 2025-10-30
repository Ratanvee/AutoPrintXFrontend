import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * Reusable Loading Button Component
 */
const LoadingButton = ({
    loading,
    children,
    loadingText,
    className = "snin-button",
    disabled = false,
    onClick,
    type = "button",
    ...props
}) => {
    return (
        <button
            className={className}
            type={type}
            onClick={onClick}
            disabled={loading || disabled}
            {...props}
        >
            {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <CircularProgress size={16} color="inherit" />
                    {loadingText || children}
                </span>
            ) : (
                children
            )}
        </button>
    );
};

export default LoadingButton;