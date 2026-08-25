import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@adsspot/api';
import { Navbar } from '../components/Navbar';
import { FloatingMobileNav } from '../components/FloatingMobileNav';

import { PwaInstallPrompt } from '../components/PwaInstallPrompt';

export const metadata: Metadata = {
  title: 'Adsspot — Hyperlocal Business Discovery & Marketing Platform',
  description:
    'Discover trending businesses, exclusive festival banners, digital visiting cards, and local services in your pincode.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Adsspot',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4787F2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link href="https://api.mapbox.com/mapbox-gl-js/v3.9.4/mapbox-gl.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
      </head>

      <body className="min-h-screen bg-[#F4F6FB] text-[#17181C] antialiased flex flex-col">
        <AuthProvider>
          <Navbar />
          <PwaInstallPrompt />
          <main className="flex-1 flex flex-col">{children}</main>
          <FloatingMobileNav />
        </AuthProvider>
      </body>
    </html>
  );
}


