import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@adsspot/api';
import { DevPersonaBar } from '../components/DevPersonaBar';
import { Navbar } from '../components/Navbar';
import { FloatingMobileNav } from '../components/FloatingMobileNav';

import { PwaInstallPrompt } from '../components/PwaInstallPrompt';

export const metadata: Metadata = {
  title: 'Adsspot — Hyperlocal Business Discovery & Marketing Platform',
  description:
    'Discover trending businesses, exclusive festival banners, digital visiting cards, and local services in your pincode.',
  manifest: '/manifest.json',
  themeColor: '#4787F2',
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
      </head>

      <body className="min-h-screen bg-[#F4F6FB] text-[#17181C] antialiased flex flex-col">
        <AuthProvider>
          <DevPersonaBar />
          <Navbar />
          <PwaInstallPrompt />
          <main className="flex-1 flex flex-col">{children}</main>
          <FloatingMobileNav />
        </AuthProvider>
      </body>
    </html>
  );
}


