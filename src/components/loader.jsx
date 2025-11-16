import React from 'react';
import '../styles/dashboard/dashboard.css';

const ImageLoader = () => {
    return (
        <div className="fullscreen-loader-container">
            <img src="/logo12.png" alt="APX Loading" className="pulsing-logo" />
        </div>
    );
};

export default ImageLoader;