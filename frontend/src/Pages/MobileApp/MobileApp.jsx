import React, { useState } from 'react';
import './MobileApp.css';
import AppDownload from '../../Components/AppDownload/AppDownload';
import { assets } from '../../assets/assets';

const MobileApp = () => {
  const [showScanImage, setShowScanImage] = useState(false);

  const handleScanClick = () => {
    setShowScanImage(prev => !prev);
  };

  const features = [
    {
      icon: assets.parcel_icon,
      title: "Fast Delivery",
      description: "Get your favorite food delivered in 30 minutes or less"
    },
    {
      icon: assets.favorite_icon,
      title: "Save Favorites",
      description: "Bookmark your favorite restaurants and dishes"
    },
    {
      icon: assets.basket_icon,
      title: "Easy Ordering",
      description: "Simple and intuitive ordering process"
    },
    {
      icon: assets.rating_starts,
      title: "Rate & Review",
      description: "Share your experience and help others"
    }
  ];

  return (
    <div className="mobile-app-page">
      <div className="mobile-app-hero">
        <h1>Download Our Mobile App</h1>
        <p>Experience the best food delivery service on your mobile device</p>
      </div>

      <AppDownload />

      <div className="app-features">
        <h2>Why Choose Our Mobile App?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <img src={feature.icon} alt={feature.title} className="feature-icon" />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="scan-section">
        <h2>Scan to Download</h2>
        <p>Point your camera at the QR code to download the app instantly</p>
        <button className="scan-button" onClick={handleScanClick}>
          {showScanImage ? 'Hide QR Code' : 'Show QR Code'}
        </button>

        {showScanImage && (
          <div className="scanner-container">
            <img
              src={assets.mobile_scan}
              alt="Mobile Scan QR Code"
              className="mobile-scan-image"
            />
            <p className="scan-instructions">
              Scan this QR code with your phone's camera to download our app
            </p>
          </div>
        )}
      </div>


    </div>
  );
};

export default MobileApp;
