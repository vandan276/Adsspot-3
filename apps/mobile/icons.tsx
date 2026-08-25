import React from 'react';
import { Image, ImageStyle } from 'react-native';


interface IconProps {
  size?: number;
  color?: string;
  fill?: string;
  style?: ImageStyle;
}

const encodeSvg = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export const Home: React.FC<IconProps> = ({ size = 20, color = '#17181C', style }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
  return <Image source={{ uri: encodeSvg(svg) }} style={[{ width: size, height: size }, style]} />;
};

export const Wallet: React.FC<IconProps> = ({ size = 20, color = '#17181C', style }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>`;
  return <Image source={{ uri: encodeSvg(svg) }} style={[{ width: size, height: size }, style]} />;
};

export const Compass: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF', style }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`;
  return <Image source={{ uri: encodeSvg(svg) }} style={[{ width: size, height: size }, style]} />;
};

export const Bookmark: React.FC<IconProps> = ({ size = 20, color = '#17181C', fill = 'none', style }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`;
  return <Image source={{ uri: encodeSvg(svg) }} style={[{ width: size, height: size }, style]} />;
};

export const User: React.FC<IconProps> = ({ size = 20, color = '#17181C', style }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
  return <Image source={{ uri: encodeSvg(svg) }} style={[{ width: size, height: size }, style]} />;
};

export const Heart: React.FC<IconProps> = ({ size = 20, color = '#17181C', fill = 'none', style }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
  return <Image source={{ uri: encodeSvg(svg) }} style={[{ width: size, height: size }, style]} />;
};

export const MessageCircle: React.FC<IconProps> = ({ size = 20, color = '#17181C', style }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`;
  return <Image source={{ uri: encodeSvg(svg) }} style={[{ width: size, height: size }, style]} />;
};

export const Share2: React.FC<IconProps> = ({ size = 20, color = '#17181C', style }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>`;
  return <Image source={{ uri: encodeSvg(svg) }} style={[{ width: size, height: size }, style]} />;
};

export const ShieldCheck: React.FC<IconProps> = ({ size = 12, color = '#1B6A2D', style }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`;
  return <Image source={{ uri: encodeSvg(svg) }} style={[{ width: size, height: size }, style]} />;
};

export const Crown: React.FC<IconProps> = ({ size = 12, color = '#F2B604', style }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>`;
  return <Image source={{ uri: encodeSvg(svg) }} style={[{ width: size, height: size }, style]} />;
};

export const MapPin: React.FC<IconProps> = ({ size = 12, color = '#4787F2', style }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`;
  return <Image source={{ uri: encodeSvg(svg) }} style={[{ width: size, height: size }, style]} />;
};

export const Plus: React.FC<IconProps> = ({ size = 12, color = '#FFFFFF', style }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`;
  return <Image source={{ uri: encodeSvg(svg) }} style={[{ width: size, height: size }, style]} />;
};

export const Search: React.FC<IconProps> = ({ size = 16, color = '#687182', style }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`;
  return <Image source={{ uri: encodeSvg(svg) }} style={[{ width: size, height: size }, style]} />;
};

export const ArrowRight: React.FC<IconProps> = ({ size = 16, color = '#FFFFFF', style }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;
  return <Image source={{ uri: encodeSvg(svg) }} style={[{ width: size, height: size }, style]} />;
};

export const Check: React.FC<IconProps> = ({ size = 16, color = '#35AB4E', style }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
  return <Image source={{ uri: encodeSvg(svg) }} style={[{ width: size, height: size }, style]} />;
};

export const Sparkles: React.FC<IconProps> = ({ size = 16, color = '#F2B604', style }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>`;
  return <Image source={{ uri: encodeSvg(svg) }} style={[{ width: size, height: size }, style]} />;
};

export const LogOut: React.FC<IconProps> = ({ size = 16, color = '#981837', style }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>`;
  return <Image source={{ uri: encodeSvg(svg) }} style={[{ width: size, height: size }, style]} />;
};

// ==========================================
// Authentic Adsspot Brand Logo Mark (From adsspot.svg)
// ==========================================
export const AdsspotLogoMarkNative: React.FC<{ size?: number; style?: ImageStyle }> = ({
  size = 36,
  style,
}) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 110 110" fill="none">
    <g id="Layer-1">
      <g>
        <path d="M35.598 59.6398C35.598 59.6398 37.9681 59.3632 39.1944 59.3632C39.9654 59.3632 41.2381 59.3632 41.2381 59.3632C41.2381 59.3632 44.9509 59.651 47.2981 59.0308C51.6878 57.8708 53.157 55 53.157 55L55 55L55 56.6275C55 56.6275 52.525 57.8253 51.3484 62.4287C50.7062 64.9411 50.8074 69.5156 50.7079 72.2012C50.6251 74.4361 50.2936 75.0409 50.2936 75.0409L35.598 59.6398Z" fill="#981837"/>
        <path d="M28.1604 72.5079C28.1604 67.2434 32.4282 62.9756 37.6927 62.9756C42.9573 62.9756 47.225 67.2434 47.225 72.5079C47.225 77.7725 42.9573 82.0402 37.6927 82.0402C32.4282 82.0402 28.1604 77.7725 28.1604 72.5079Z" fill="none" stroke="#981837" stroke-width="7" stroke-linecap="butt" stroke-linejoin="round"/>
      </g>
      <g>
        <path d="M74.402 50.3602C74.402 50.3602 72.0319 50.6368 70.8056 50.6368C70.0346 50.6368 68.7619 50.6368 68.7619 50.6368C68.7619 50.6368 65.0491 50.349 62.7019 50.9692C58.3122 52.1292 56.843 55 56.843 55L55 55L55 53.3725C55 53.3725 57.475 52.1747 58.6516 47.5713C59.2938 45.0589 59.1926 40.4844 59.2921 37.7988C59.3749 35.5639 59.7064 34.9591 59.7064 34.9591L74.402 50.3602Z" fill="#35ab4e"/>
        <path d="M81.8396 37.4921C81.8396 42.7566 77.5718 47.0244 72.3073 47.0244C67.0427 47.0244 62.775 42.7566 62.775 37.4921C62.775 32.2275 67.0427 27.9598 72.3073 27.9598C77.5718 27.9598 81.8396 32.2275 81.8396 37.4921Z" fill="none" stroke="#35ab4e" stroke-width="7" stroke-linecap="butt" stroke-linejoin="round"/>
      </g>
      <g>
        <path d="M74.402 59.6398C74.402 59.6398 72.0319 59.3632 70.8056 59.3632C70.0346 59.3632 68.7619 59.3632 68.7619 59.3632C68.7619 59.3632 65.0491 59.651 62.7019 59.0308C58.3122 57.8708 56.843 55 56.843 55L55 55L55 56.6275C55 56.6275 57.475 57.8253 58.6516 62.4287C59.2938 64.9411 59.1926 69.5156 59.2921 72.2012C59.3749 74.4361 59.7064 75.0409 59.7064 75.0409L74.402 59.6398Z" fill="#4787f2"/>
        <path d="M81.8396 72.5079C81.8396 67.2434 77.5718 62.9756 72.3073 62.9756C67.0427 62.9756 62.775 67.2434 62.775 72.5079C62.775 77.7725 67.0427 82.0402 72.3073 82.0402C77.5718 82.0402 81.8396 77.7725 81.8396 72.5079Z" fill="none" stroke="#4787f2" stroke-width="7" stroke-linecap="butt" stroke-linejoin="round"/>
      </g>
      <g>
        <path d="M35.598 50.3602C35.598 50.3602 37.9681 50.6368 39.1944 50.6368C39.9654 50.6368 41.2381 50.6368 41.2381 50.6368C41.2381 50.6368 44.9509 50.349 47.2981 50.9692C51.6878 52.1292 53.157 55 53.157 55L55 55L55 53.3725C55 53.3725 57.475 52.1747 58.6516 47.5713C50.7062 45.0589 50.8074 40.4844 50.7079 37.7988C50.6251 35.5639 50.2936 34.9591 50.2936 34.9591L35.598 50.3602Z" fill="#f2b604"/>
        <path d="M28.1604 37.4921C28.1604 42.7566 32.4282 47.0244 37.6927 47.0244C42.9573 47.0244 47.225 42.7566 47.225 37.4921C47.225 32.2275 42.9573 27.9598 37.6927 27.9598C32.4282 27.9598 28.1604 32.2275 28.1604 37.4921Z" fill="none" stroke="#f2b604" stroke-width="7" stroke-linecap="butt" stroke-linejoin="round"/>
      </g>
      <path d="M49.1608 27.9598C49.1608 24.7349 51.7751 22.1206 55 22.1206C58.2249 22.1206 60.8392 24.7349 60.8392 27.9598C60.8392 31.1847 58.2249 33.799 55 33.799C51.7751 33.799 49.1608 31.1847 49.1608 27.9598Z" fill="#981837"/>
      <path d="M76.0004 55C76.0004 51.7751 78.6147 49.1608 81.8396 49.1608C85.0645 49.1608 87.6787 51.7751 87.6787 55C87.6787 58.2249 85.0645 60.8392 81.8396 60.8392C78.6147 60.8392 76.0004 58.2249 76.0004 55Z" fill="#f2b604"/>
      <path d="M49.1608 82.0402C49.1608 78.8153 51.7751 76.201 55 76.201C58.2249 76.201 60.8392 78.8153 60.8392 82.0402C60.8392 85.2651 58.2249 87.8794 55 87.8794C51.7751 87.8794 49.1608 85.2651 49.1608 82.0402Z" fill="#35ab4e"/>
      <path d="M22.3213 55C22.3213 51.7751 24.9355 49.1608 28.1604 49.1608C31.3853 49.1608 33.9996 51.7751 33.9996 55C33.9996 58.2249 31.3853 60.8392 28.1604 60.8392C24.9355 60.8392 22.3213 58.2249 22.3213 55Z" fill="#4787f2"/>
    </g>
  </svg>`;

  return (
    <Image
      source={{ uri: encodeSvg(svg) }}
      style={[{ width: size, height: size }, style]}
      resizeMode="contain"
    />
  );
};

// ==========================================
// Authentic 4-Color Brand Theme Line Native (From logo line.svg)
// ==========================================
export const AdsspotThemeLineNative: React.FC<{
  width?: number;
  height?: number;
  thickness?: number;
  style?: ImageStyle;
}> = ({ width = 90, height = 3, thickness = 2, style }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 240 4" fill="none">
    <path d="M4 2H58" stroke="#F2B604" stroke-width="${thickness}" stroke-linecap="round" />
    <path d="M64 2H118" stroke="#35AB4E" stroke-width="${thickness}" stroke-linecap="round" />
    <path d="M124 2H178" stroke="#4787F2" stroke-width="${thickness}" stroke-linecap="round" />
    <path d="M184 2H236" stroke="#981837" stroke-width="${thickness}" stroke-linecap="round" />
  </svg>`;

  return (
    <Image
      source={{ uri: encodeSvg(svg) }}
      style={[{ width, height }, style]}
      resizeMode="contain"
    />
  );
};

// ==========================================
// Complete Unified Brand Logo Lockup Native (SVG)
// ==========================================
export const AdsspotBrandLockupNative: React.FC<{
  height?: number;
  style?: ImageStyle;
}> = ({ height = 36, style }) => {
  const width = Math.round((height / 70) * 280);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 70" width="${width}" height="${height}" fill="none">
    <g transform="translate(0, 6) scale(0.53)">
      <g id="Layer-1">
        <g>
          <path d="M35.598 59.6398C35.598 59.6398 37.9681 59.3632 39.1944 59.3632C39.9654 59.3632 41.2381 59.3632 41.2381 59.3632C41.2381 59.3632 44.9509 59.651 47.2981 59.0308C51.6878 57.8708 53.157 55 53.157 55L55 55L55 56.6275C55 56.6275 52.525 57.8253 51.3484 62.4287C50.7062 64.9411 50.8074 69.5156 50.7079 72.2012C50.6251 74.4361 50.2936 75.0409 50.2936 75.0409L35.598 59.6398Z" fill="#981837"/>
          <path d="M28.1604 72.5079C28.1604 67.2434 32.4282 62.9756 37.6927 62.9756C42.9573 62.9756 47.225 67.2434 47.225 72.5079C47.225 77.7725 42.9573 82.0402 37.6927 82.0402C32.4282 82.0402 28.1604 77.7725 28.1604 72.5079Z" fill="none" stroke="#981837" stroke-width="7" stroke-linecap="butt" stroke-linejoin="round"/>
        </g>
        <g>
          <path d="M74.402 50.3602C74.402 50.3602 72.0319 50.6368 70.8056 50.6368C70.0346 50.6368 68.7619 50.6368 68.7619 50.6368C68.7619 50.6368 65.0491 50.349 62.7019 50.9692C58.3122 52.1292 56.843 55 56.843 55L55 55L55 53.3725C55 53.3725 57.475 52.1747 58.6516 47.5713C59.2938 45.0589 59.1926 40.4844 59.2921 37.7988C59.3749 35.5639 59.7064 34.9591 59.7064 34.9591L74.402 50.3602Z" fill="#35ab4e"/>
          <path d="M81.8396 37.4921C81.8396 42.7566 77.5718 47.0244 72.3073 47.0244C67.0427 47.0244 62.775 42.7566 62.775 37.4921C62.775 32.2275 67.0427 27.9598 72.3073 27.9598C77.5718 27.9598 81.8396 32.2275 81.8396 37.4921Z" fill="none" stroke="#35ab4e" stroke-width="7" stroke-linecap="butt" stroke-linejoin="round"/>
        </g>
        <g>
          <path d="M74.402 59.6398C74.402 59.6398 72.0319 59.3632 70.8056 59.3632C70.0346 59.3632 68.7619 59.3632 68.7619 59.3632C68.7619 59.3632 65.0491 59.651 62.7019 59.0308C58.3122 57.8708 56.843 55 56.843 55L55 55L55 56.6275C55 56.6275 57.475 57.8253 58.6516 62.4287C59.2938 64.9411 59.1926 69.5156 59.2921 72.2012C59.3749 74.4361 59.7064 75.0409 59.7064 75.0409L74.402 59.6398Z" fill="#4787f2"/>
          <path d="M81.8396 72.5079C81.8396 67.2434 77.5718 62.9756 72.3073 62.9756C67.0427 62.9756 62.775 67.2434 62.775 72.5079C62.775 77.7725 67.0427 82.0402 72.3073 82.0402C77.5718 82.0402 81.8396 77.7725 81.8396 72.5079Z" fill="none" stroke="#4787f2" stroke-width="7" stroke-linecap="butt" stroke-linejoin="round"/>
        </g>
        <g>
          <path d="M35.598 50.3602C35.598 50.3602 37.9681 50.6368 39.1944 50.6368C39.9654 50.6368 41.2381 50.6368 41.2381 50.6368C41.2381 50.6368 44.9509 50.349 47.2981 50.9692C51.6878 52.1292 53.157 55 53.157 55L55 55L55 53.3725C55 53.3725 57.475 52.1747 58.6516 47.5713C50.7062 45.0589 50.8074 40.4844 50.7079 37.7988C50.6251 35.5639 50.2936 34.9591 50.2936 34.9591L35.598 50.3602Z" fill="#f2b604"/>
          <path d="M28.1604 37.4921C28.1604 42.7566 32.4282 47.0244 37.6927 47.0244C42.9573 47.0244 47.225 42.7566 47.225 37.4921C47.225 32.2275 42.9573 27.9598 37.6927 27.9598C32.4282 27.9598 28.1604 32.2275 28.1604 37.4921Z" fill="none" stroke="#f2b604" stroke-width="7" stroke-linecap="butt" stroke-linejoin="round"/>
        </g>
        <path d="M49.1608 27.9598C49.1608 24.7349 51.7751 22.1206 55 22.1206C58.2249 22.1206 60.8392 24.7349 60.8392 27.9598C60.8392 31.1847 58.2249 33.799 55 33.799C51.7751 33.799 49.1608 31.1847 49.1608 27.9598Z" fill="#981837"/>
        <path d="M76.0004 55C76.0004 51.7751 78.6147 49.1608 81.8396 49.1608C85.0645 49.1608 87.6787 51.7751 87.6787 55C87.6787 58.2249 85.0645 60.8392 81.8396 60.8392C78.6147 60.8392 76.0004 58.2249 76.0004 55Z" fill="#f2b604"/>
        <path d="M49.1608 82.0402C49.1608 78.8153 51.7751 76.201 55 76.201C58.2249 76.201 60.8392 78.8153 60.8392 82.0402C60.8392 85.2651 58.2249 87.8794 55 87.8794C51.7751 87.8794 49.1608 85.2651 49.1608 82.0402Z" fill="#35ab4e"/>
        <path d="M22.3213 55C22.3213 51.7751 24.9355 49.1608 28.1604 49.1608C31.3853 49.1608 33.9996 51.7751 33.9996 55C33.9996 58.2249 31.3853 60.8392 28.1604 60.8392C24.9355 60.8392 22.3213 58.2249 22.3213 55Z" fill="#4787f2"/>
      </g>
    </g>

    <g transform="translate(72, 51)">
      <text font-family="'DIN Condensed', 'DIN Alternate', 'Impact', 'Plus Jakarta Sans', sans-serif" font-size="54" font-weight="900" letter-spacing="0">
        <tspan fill="#4787F2">ADS</tspan>
        <tspan fill="#981837">SPOT</tspan>
      </text>
    </g>
  </svg>`;

  return (
    <Image
      source={{ uri: encodeSvg(svg) }}
      style={[{ width, height }, style]}
      resizeMode="contain"
    />
  );
};
