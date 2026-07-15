import React from 'react';
import { theme } from 'antd';
import { AI_MATCH_THRESHOLDS } from '../../lib/constants';

export default function AIMatchScore({ score, size = 'md' }) {
  const normalizedScore = Math.min(100, Math.max(0, score));
  const { token } = theme.useToken();
  
  let color = '#ef4444'; // danger
  let bgColor = '#fee2e2';

  if (normalizedScore >= AI_MATCH_THRESHOLDS.HIGH) {
    color = token.colorPrimary;
    bgColor = '#eef2ff';
  } else if (normalizedScore >= AI_MATCH_THRESHOLDS.MEDIUM) {
    color = '#f59e0b'; // warning
    bgColor = '#fef3c7';
  }

  const sizes = {
    sm: { sizePx: 32, fontSize: '10px', strokeWidth: 2, radius: 14 },
    md: { sizePx: 48, fontSize: '12px', strokeWidth: 3, radius: 20 },
    lg: { sizePx: 64, fontSize: '14px', strokeWidth: 4, radius: 28 },
    xl: { sizePx: 96, fontSize: '24px', strokeWidth: 6, radius: 42 },
  };

  const { sizePx, fontSize, strokeWidth, radius } = sizes[size];
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: bgColor, width: sizePx, height: sizePx }}>
      <svg style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
        <circle
          style={{ stroke: 'rgba(255,255,255,0.5)' }}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
        <circle
          style={{ stroke: color, transition: 'all 1s ease-out' }}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
      </svg>
      <span style={{ fontWeight: 700, position: 'relative', zIndex: 10, color: color, fontSize: fontSize }}>
        {normalizedScore}
      </span>
    </div>
  );
}
