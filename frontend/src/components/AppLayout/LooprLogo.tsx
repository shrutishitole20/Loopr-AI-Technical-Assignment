import React from 'react';

interface LooprIconProps {
  size?: number;
}

export const LooprIcon: React.FC<LooprIconProps> = ({ size = 20 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="looprGlowGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>
      </defs>
      {/* Precision Vector Loopr Infinity Brand Mark */}
      <path
        d="M9.5 9.5C5.91 9.5 3 12.41 3 16s2.91 6.5 6.5 6.5c3.22 0 5.5-2.18 6.5-3.5 1 1.32 3.28 3.5 6.5 3.5 3.59 0 6.5-2.91 6.5-6.5s-2.91-6.5-6.5-6.5c-3.22 0-5.5 2.18-6.5 3.5-1-1.32-3.28-3.5-6.5-3.5zm0 3.7c1.55 0 2.8 1.25 2.8 2.8s-1.25 2.8-2.8 2.8S6.7 17.55 6.7 16s1.25-2.8 2.8-2.8zm13 0c1.55 0 2.8 1.25 2.8 2.8s-1.25 2.8-2.8 2.8-2.8-1.25-2.8-2.8 1.25-2.8 2.8-2.8z"
        fill="url(#looprGlowGrad)"
      />
    </svg>
  );
};
