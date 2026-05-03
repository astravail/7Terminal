import React, { useState, useEffect } from 'react';
import '../styles/MobileWarning.css';

function MobileWarning() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      setIsMobile(mobileRegex.test(userAgent) || window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <div className="mobile-warning">
      <div className="mobile-warning-content">
        <h2>Desktop Only</h2>
        <p>This website is optimized for desktop use only.</p>
        <p>Sorry for any inconvenience this may cause.</p>
        <p>Please visit this site on a desktop or laptop for the best experience.</p>
      </div>
    </div>
  );
}

export default MobileWarning;
