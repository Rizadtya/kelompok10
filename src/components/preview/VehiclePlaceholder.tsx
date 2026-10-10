interface VehiclePlaceholderProps {
  paintColor?: string;
  className?: string;
}

/**
 * Stylized side-profile sports car used when no photo is uploaded. The body
 * color follows the selected paint so the preview reacts to configuration,
 * but this is explicitly a placeholder — never presented as a real render.
 */
export function VehiclePlaceholder({ paintColor, className }: VehiclePlaceholderProps) {
  const body = paintColor && /^#/.test(paintColor) ? paintColor : '#2f3540';
  return (
    <svg
      viewBox="0 0 400 180"
      className={className}
      role="img"
      aria-label="Vehicle placeholder silhouette"
    >
      <defs>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#14171c" />
          <stop offset="100%" stopColor="#0a0b0d" />
        </linearGradient>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={body} stopOpacity="1" />
          <stop offset="100%" stopColor="#0a0b0d" stopOpacity="0.6" />
        </linearGradient>
        <radialGradient id="headlight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c6ff00" />
          <stop offset="100%" stopColor="#c6ff00" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="180" fill="url(#floor)" />
      {/* ground reflection glow */}
      <ellipse cx="200" cy="150" rx="150" ry="12" fill="#c6ff00" opacity="0.06" />

      {/* car body */}
      <path
        d="M40 120 L70 118 C85 95 110 80 150 78 L250 76 C285 76 305 88 330 100 L360 108 C372 110 378 116 378 124 L378 130 L40 130 Z"
        fill="url(#bodyGrad)"
        stroke="#c6ff00"
        strokeOpacity="0.35"
        strokeWidth="1.2"
      />
      {/* greenhouse / windows */}
      <path
        d="M120 82 C140 70 165 66 195 66 L240 68 C258 70 270 78 282 88 L120 90 Z"
        fill="#0f1115"
        stroke="#2f3540"
        strokeWidth="1"
      />
      {/* headlight glow */}
      <circle cx="368" cy="116" r="16" fill="url(#headlight)" />
      <circle cx="366" cy="116" r="3" fill="#c6ff00" />

      {/* wheels */}
      <g>
        <circle cx="110" cy="130" r="22" fill="#0a0b0d" stroke="#2f3540" strokeWidth="2" />
        <circle cx="110" cy="130" r="11" fill="#14171c" stroke="#4b4f55" strokeWidth="1.5" />
        <circle cx="300" cy="130" r="22" fill="#0a0b0d" stroke="#2f3540" strokeWidth="2" />
        <circle cx="300" cy="130" r="11" fill="#14171c" stroke="#4b4f55" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
