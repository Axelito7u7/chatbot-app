import React, { useEffect } from 'react';

const HubSpotTracking = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = '//js-na1.hs-scripts.com/47344437.js';
    script.id = 'hs-script-loader';

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup script on unmount
    };
  }, []);

  return null; // No UI needed
};

export default HubSpotTracking;
