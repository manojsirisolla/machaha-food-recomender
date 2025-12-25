import React, { useState } from 'react'
import './AppDownload.css'
import { assets } from '../../assets/assets'
const AppDownload = () => {
  const [showScanImage, setShowScanImage] = useState(false);

  const handleDownload = () => {
    window.open('https://radiant-pasca-fe8504.netlify.app', '_blank');
  };

  const handleScanClick = () => {
    setShowScanImage(prev => !prev);
  };

  return (
    <div className='app-download' id='app-download'>
        <p> For Better Experience Download <br/> Machaha App</p>

        <div className="scan-section">
          <button className="scan-button" onClick={handleScanClick}>
            {showScanImage ? 'Stop Scanning' : 'Scan QR Code'}
          </button>

          {showScanImage && (
            <div className="scanner-container">
              <img
                src={assets.mobile_scan}
                alt="Mobile Scan QR Code"
                className="mobile-scan-image"
              />
            </div>
          )}
        </div>
    </div>
  )
}

export default AppDownload
