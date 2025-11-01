import React, { useState, useEffect } from 'react';
import { MapPin, Phone, MessageCircle, Mail, ChevronDown, X, AlertCircle } from 'lucide-react';

const OwnerProfileCard = ({ shop }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isData, setIsData] = useState(false);

    useEffect(() => {

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsExpanded(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // If shop data is null or undefined, show error message
    if (!shop || typeof shop !== 'object' || Object.keys(shop).length === 0) {
        return (
            <div className="owner-card-container">
                <div className="owner-card owner-card-error">
                    <div className="owner-card-error-content">
                        <AlertCircle size={64} className="owner-card-error-icon" />
                        <h2 className="owner-card-error-title">Shop Not Found</h2>
                        <p className="owner-card-error-message">
                            This shop does not exist. Please check the URL and try with another shop.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="owner-card-container">
            <div className="owner-card">
                <div className="owner-card-header">
                    {/* Left Section - Shop Image & Name */}
                    <div className="owner-card-left-section">
                        <div className="owner-card-shop-image">
                            <img
                                src={shop?.image || "https://via.placeholder.com/150"}
                                alt={shop?.name}
                            />
                        </div>
                        <div className="owner-card-text-section">
                            <h1 className="owner-card-shop-name">{shop?.name}</h1>
                            <p className="owner-card-owner-name">{shop?.ownerName}</p>
                        </div>
                    </div>

                    {/* Right Section - Location & Contact Icons */}
                    <div className={`owner-card-right-section ${isExpanded ? 'expanded' : ''}`}>
                        <div className="owner-card-location-container">
                            <MapPin className="owner-card-location-icon" />
                            <span className="owner-card-location-text">{shop?.location}</span>
                        </div>
                        <div className="owner-card-contact-icons">
                            <button
                                className="owner-card-icon-button"
                                onClick={() => window.open(`https://wa.me/${shop?.whatsapp}`, '_blank')}
                            >
                                <MessageCircle />
                            </button>
                            <button
                                className="owner-card-icon-button"
                                onClick={() => window.location.href = `tel:${shop?.phone}`}
                            >
                                <Phone />
                            </button>
                            <button
                                className="owner-card-icon-button"
                                onClick={() => window.location.href = `mailto:${shop?.email}`}
                            >
                                <Mail />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Toggle Button */}
                    {isMobile && (
                        <button
                            className="owner-card-toggle-button"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? <X /> : <ChevronDown />}
                        </button>
                    )}
                </div>

                {/* Expanded Content for Mobile */}
                {isMobile && isExpanded && (
                    <div className="owner-card-expanded-content">
                        <div className="owner-card-expanded-row">
                            <div className="owner-card-info-card">
                                <div className="owner-card-info-label">Location</div>
                                <div className="owner-card-info-value">{shop?.location}</div>
                            </div>

                            <div className="owner-card-info-card">
                                <div className="owner-card-info-label">Service</div>
                                <div className="owner-card-info-value">{shop?.service}</div>
                            </div>

                            <div className="owner-card-info-card">
                                <div className="owner-card-info-label">Contact</div>
                                <div className="owner-card-contact-buttons">
                                    <button
                                        className="owner-card-full-width-button"
                                        onClick={() => window.open(`https://wa.me/${shop?.whatsapp}`, '_blank')}
                                    >
                                        <MessageCircle />
                                        WhatsApp
                                    </button>
                                    <button
                                        className="owner-card-full-width-button"
                                        onClick={() => window.location.href = `tel:${shop?.phone}`}
                                    >
                                        <Phone />
                                        Call
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OwnerProfileCard;