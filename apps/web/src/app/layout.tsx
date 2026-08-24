import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@adsspot/api';
import { DevPersonaBar } from '../components/DevPersonaBar';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'Adsspot — Hyperlocal Business Discovery & Marketing Platform',
  description:
    'Discover trending businesses, exclusive festival banners, digital visiting cards, and local services in your pincode.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F4F6FB] text-[#17181C] antialiased flex flex-col">
        <AuthProvider>
          <DevPersonaBar />
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
