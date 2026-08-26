'use client';

import React, { useEffect, useState } from 'react';
import { WebSplashScreen } from './WebSplashScreen';

export const AppSplashScreenWrapper: React.FC = () => {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // Check if user has already seen splash screen in this session
    const hasSeen = sessionStorage.getItem('adsspot_has_seen_splash');
    if (!hasSeen) {
      setShowSplash(true);
      sessionStorage.setItem('adsspot_has_seen_splash', 'true');
    }

    const handleManualTrigger = () => {
      setShowSplash(true);
    };

    window.addEventListener('adsspot:trigger-splash', handleManualTrigger);
    return () => window.removeEventListener('adsspot:trigger-splash', handleManualTrigger);
  }, []);

  if (!showSplash) return null;

  return <WebSplashScreen onFinish={() => setShowSplash(false)} />;
};
