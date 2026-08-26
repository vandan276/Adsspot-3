import React, { useEffect, useState } from 'react';

export interface AnimatedLogoMarkProps {
  size?: number;
  className?: string;
  loop?: boolean;
}

// 4 Main Node Petals (exact vector geometry and directional physics)
const GROUPS = [
  {
    key: 'yellow',
    dir: [-0.756, -0.655] as [number, number],
    mag: 46,
    rot: -30,
    delay: 0,
    el: (
      <g>
        <path
          d="M35.598 50.3602C35.598 50.3602 37.9681 50.6368 39.1944 50.6368C39.9654 50.6368 41.2381 50.6368 41.2381 50.6368C41.2381 50.6368 44.9509 50.349 47.2981 50.9692C51.6878 52.1292 53.157 55 53.157 55L55 55L55 53.3725C55 53.3725 52.525 52.1747 51.3484 47.5713C50.7062 45.0589 50.8074 40.4844 50.7079 37.7988C50.6251 35.5639 50.2936 34.9591 50.2936 34.9591L35.598 50.3602Z"
          fill="#F2B604"
        />
        <path
          d="M28.1604 37.4921C28.1604 42.7566 32.4282 47.0244 37.6927 47.0244C42.9573 47.0244 47.225 42.7566 47.225 37.4921C47.225 32.2275 42.9573 27.9598 37.6927 27.9598C32.4282 27.9598 28.1604 32.2275 28.1604 37.4921Z"
          fill="none"
          stroke="#F2B604"
          strokeWidth="7"
          strokeLinecap="butt"
          strokeLinejoin="round"
        />
      </g>
    ),
  },
  {
    key: 'green',
    dir: [0.756, -0.655] as [number, number],
    mag: 46,
    rot: 30,
    delay: 0.15,
    el: (
      <g>
        <path
          d="M74.402 50.3602C74.402 50.3602 72.0319 50.6368 70.8056 50.6368C70.0346 50.6368 68.7619 50.6368 68.7619 50.6368C68.7619 50.6368 65.0491 50.349 62.7019 50.9692C58.3122 52.1292 56.843 55 56.843 55L55 55L55 53.3725C55 53.3725 57.475 52.1747 58.6516 47.5713C59.2938 45.0589 59.1926 40.4844 59.2921 37.7988C59.3749 35.5639 59.7064 34.9591 59.7064 34.9591L74.402 50.3602Z"
          fill="#35AB4E"
        />
        <path
          d="M81.8396 37.4921C81.8396 42.7566 77.5718 47.0244 72.3073 47.0244C67.0427 47.0244 62.775 42.7566 62.775 37.4921C62.775 32.2275 67.0427 27.9598 72.3073 27.9598C77.5718 27.9598 81.8396 32.2275 81.8396 37.4921Z"
          fill="none"
          stroke="#35AB4E"
          strokeWidth="7"
          strokeLinecap="butt"
          strokeLinejoin="round"
        />
      </g>
    ),
  },
  {
    key: 'blue',
    dir: [0.78, 0.63] as [number, number],
    mag: 46,
    rot: -30,
    delay: 0.3,
    el: (
      <g>
        <path
          d="M74.402 59.6398C74.402 59.6398 72.0319 59.3632 70.8056 59.3632C70.0346 59.3632 68.7619 59.3632 68.7619 59.3632C68.7619 59.3632 65.0491 59.651 62.7019 59.0308C58.3122 57.8708 56.843 55 56.843 55L55 55L55 56.6275C55 56.6275 57.475 57.8253 58.6516 62.4287C59.2938 64.9411 59.1926 69.5156 59.2921 72.2012C59.3749 74.4361 59.7064 75.0409 59.7064 75.0409L74.402 59.6398Z"
          fill="#4787F2"
        />
        <path
          d="M81.8396 72.5079C81.8396 67.2434 77.5718 62.9756 72.3073 62.9756C67.0427 62.9756 62.775 67.2434 62.775 72.5079C62.775 77.7725 67.0427 82.0402 72.3073 82.0402C77.5718 82.0402 81.8396 77.7725 81.8396 72.5079Z"
          fill="none"
          stroke="#4787F2"
          strokeWidth="7"
          strokeLinecap="butt"
          strokeLinejoin="round"
        />
      </g>
    ),
  },
  {
    key: 'maroon',
    dir: [-0.78, 0.63] as [number, number],
    mag: 46,
    rot: 30,
    delay: 0.45,
    el: (
      <g>
        <path
          d="M35.598 59.6398C35.598 59.6398 37.9681 59.3632 39.1944 59.3632C39.9654 59.3632 41.2381 59.3632 41.2381 59.3632C41.2381 59.3632 44.9509 59.651 47.2981 59.0308C51.6878 57.8708 53.157 55 53.157 55L55 55L55 56.6275C55 56.6275 52.525 57.8253 51.3484 62.4287C50.7062 64.9411 50.8074 69.5156 50.7079 72.2012C50.6251 74.4361 50.2936 75.0409 50.2936 75.0409L35.598 59.6398Z"
          fill="#981837"
        />
        <path
          d="M28.1604 72.5079C28.1604 67.2434 32.4282 62.9756 37.6927 62.9756C42.9573 62.9756 47.225 67.2434 47.225 72.5079C47.225 77.7725 42.9573 82.0402 37.6927 82.0402C32.4282 82.0402 28.1604 77.7725 28.1604 72.5079Z"
          fill="none"
          stroke="#981837"
          strokeWidth="7"
          strokeLinecap="butt"
          strokeLinejoin="round"
        />
      </g>
    ),
  },
];

// 4 Cardinal Dots
const DOTS = [
  {
    key: 'n',
    dir: [0, -1] as [number, number],
    mag: 34,
    rot: 45,
    delay: 0.75,
    el: <circle cx="55" cy="27.9598" r="5.8392" fill="#981837" />,
  },
  {
    key: 'e',
    dir: [1, 0] as [number, number],
    mag: 34,
    rot: -45,
    delay: 0.85,
    el: <circle cx="81.8396" cy="55" r="5.8392" fill="#F2B604" />,
  },
  {
    key: 's',
    dir: [0, 1] as [number, number],
    mag: 34,
    rot: 45,
    delay: 0.95,
    el: <circle cx="55" cy="82.0402" r="5.8392" fill="#35AB4E" />,
  },
  {
    key: 'w',
    dir: [-1, 0] as [number, number],
    mag: 34,
    rot: -45,
    delay: 1.05,
    el: <circle cx="28.1604" cy="55" r="5.8392" fill="#4787F2" />,
  },
];

function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function easeInBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return c3 * t * t * t - c1 * t * t;
}

export const AnimatedLogoMark: React.FC<AnimatedLogoMarkProps> = ({
  size = 110,
  className = '',
  loop = true,
}) => {
  // Start at 1.5 (fully assembled) on mount/SSR so it is immediately visible
  const [time, setTime] = useState(1.5);
  const [mounted, setMounted] = useState(false);

  // Total loop cycle duration = 2.7s (Assemble: 1.5s, Hold: 0.8s, Disperse: 0.4s)
  const TOTAL = 2.7;
  const CUE_ASSEMBLE = 0;
  const CUE_HOLD = 1.5;
  const CUE_DISPERSE = 2.3;

  useEffect(() => {
    setMounted(true);
    let animFrame: number;
    const startStamp = performance.now();

    const frame = (now: number) => {
      const elapsed = (now - startStamp) / 1000;
      const t = loop ? elapsed % TOTAL : Math.min(elapsed, CUE_HOLD + 0.3);
      setTime(t);
      animFrame = requestAnimationFrame(frame);
    };

    animFrame = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animFrame);
  }, [loop]);

  // Hold breathing and slight rock
  const holdLen = CUE_DISPERSE - CUE_HOLD;
  const holdActive = time >= CUE_HOLD - 0.05 && time <= CUE_DISPERSE + 0.05;
  const pulse = holdActive ? 1 + 0.022 * Math.sin((2 * Math.PI * 2 * (time - CUE_HOLD)) / holdLen) : 1;
  const rockDeg = holdActive ? 1.4 * Math.sin((2 * Math.PI * 2 * (time - CUE_HOLD)) / holdLen) : 0;

  const getTransform = (
    item: { dir: [number, number] | number[]; mag: number; rot: number; delay: number },
    isDot: boolean
  ) => {
    if (!mounted) {
      // Default initial state: perfectly assembled and visible
      return {
        transform: 'translate(0px, 0px) rotate(0deg) scale(1)',
        transformOrigin: '55px 55px',
        opacity: 1,
      };
    }

    const dur = isDot ? 0.32 : 0.62;
    const enterStart = CUE_ASSEMBLE + item.delay;
    const enterEnd = enterStart + dur;

    let p = 0;
    if (time < enterStart) {
      p = 0;
    } else if (time <= enterEnd) {
      p = easeOutBack((time - enterStart) / dur);
    } else if (time < CUE_DISPERSE) {
      p = 1;
    } else {
      const dispProgress = (time - CUE_DISPERSE) / (TOTAL - CUE_DISPERSE);
      p = 1 - easeInBack(Math.min(1, Math.max(0, dispProgress)));
    }

    const dirX = item.dir[0] ?? 0;
    const dirY = item.dir[1] ?? 0;
    const dx = dirX * item.mag * (1 - p);
    const dy = dirY * item.mag * (1 - p);
    const rot = item.rot * (1 - p);
    const scale = 0.2 + 0.8 * Math.max(p, 0);
    const opacity = Math.max(0.1, Math.min(1, p * 1.4));

    return {
      transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${scale})`,
      transformOrigin: '55px 55px',
      opacity,
    };
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 110 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        transform: `scale(${pulse}) rotate(${rockDeg}deg)`,
        transformOrigin: 'center',
        display: 'inline-block',
      }}
    >
      {GROUPS.map((g) => (
        <g key={g.key} style={getTransform(g, false)}>
          {g.el}
        </g>
      ))}
      {DOTS.map((d) => (
        <g key={d.key} style={getTransform(d, true)}>
          {d.el}
        </g>
      ))}
    </svg>
  );
};

