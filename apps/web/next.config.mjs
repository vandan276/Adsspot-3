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
  async redirects() {
    return [
      {
        source: '/pricing',
        destination: '/#pricing',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
