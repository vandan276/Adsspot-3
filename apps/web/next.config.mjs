/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@adsspot/ui', '@adsspot/api', '@adsspot/types'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
