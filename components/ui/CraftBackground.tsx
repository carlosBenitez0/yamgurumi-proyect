import { type ReactNode } from "react";

interface CraftBackgroundProps {
  children: ReactNode;
  className?: string;
}

function YarnThread({
  d,
  color = "#e3c2b4",
  strokeWidth = 2,
  dashArray,
  opacity = 0.25,
  className = "",
}: {
  d: string;
  color?: string;
  strokeWidth?: number;
  dashArray?: string;
  opacity?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 1200 200"
      fill="none"
      className={`absolute pointer-events-none ${className}`}
      preserveAspectRatio="none"
    >
      <path
        d={d}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={dashArray}
        opacity={opacity}
      />
    </svg>
  );
}

function YarnBall({
  className = "",
  size = 56,
  color = "#e3c2b4",
  opacity = 0.18,
}: {
  className?: string;
  size?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      className={`absolute pointer-events-none ${className}`}
    >
      <circle cx="28" cy="28" r="24" fill={color} opacity={opacity * 0.5} />
      <circle
        cx="28"
        cy="28"
        r="24"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity={opacity}
      />
      <path
        d="M16 21 Q28 11 40 21 Q32 28 40 35 Q28 45 16 35 Q24 28 16 21Z"
        stroke={color}
        strokeWidth="1.2"
        fill="none"
        opacity={opacity * 0.8}
      />
      <path
        d="M23 16 Q28 28 23 40"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity={opacity * 0.6}
      />
      <path
        d="M33 16 Q28 28 33 40"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity={opacity * 0.6}
      />
    </svg>
  );
}

function CrochetHook({
  className = "",
  color = "#e3c2b4",
  opacity = 0.15,
}: {
  className?: string;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      width="120"
      height="24"
      viewBox="0 0 120 24"
      fill="none"
      className={`absolute pointer-events-none ${className}`}
    >
      <line
        x1="30"
        y1="12"
        x2="110"
        y2="12"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity={opacity}
      />
      <path
        d="M30 12 Q22 12 22 6 Q22 2 26 2 L30 2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity={opacity}
      />
      <circle cx="114" cy="12" r="3" fill={color} opacity={opacity * 0.7} />
    </svg>
  );
}

function StitchDots({
  className = "",
  color = "#e3c2b4",
  opacity = 0.12,
}: {
  className?: string;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      className={`absolute pointer-events-none ${className}`}
    >
      {[
        [12, 16],
        [28, 12],
        [44, 18],
        [60, 14],
        [20, 36],
        [36, 32],
        [52, 38],
        [68, 34],
        [12, 56],
        [28, 52],
        [44, 58],
        [60, 54],
        [20, 72],
        [36, 68],
        [52, 74],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="1.8"
          fill={color}
          opacity={opacity}
        />
      ))}
    </svg>
  );
}

function NeedlePair({
  className = "",
  color = "#e3c2b4",
  opacity = 0.13,
}: {
  className?: string;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      width="64"
      height="80"
      viewBox="0 0 64 80"
      fill="none"
      className={`absolute pointer-events-none ${className}`}
    >
      <line
        x1="20"
        y1="8"
        x2="20"
        y2="72"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity={opacity}
      />
      <ellipse
        cx="20"
        cy="6"
        rx="3"
        ry="4"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity={opacity}
      />
      <line
        x1="44"
        y1="14"
        x2="44"
        y2="68"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity={opacity * 0.8}
      />
      <ellipse
        cx="44"
        cy="12"
        rx="2.5"
        ry="3.5"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity={opacity * 0.8}
      />
    </svg>
  );
}

function ThreadSpool({
  className = "",
  color = "#acedfe",
  threadColor = "#e3c2b4",
  opacity = 0.14,
}: {
  className?: string;
  color?: string;
  threadColor?: string;
  opacity?: number;
}) {
  return (
    <svg
      width="48"
      height="64"
      viewBox="0 0 48 64"
      fill="none"
      className={`absolute pointer-events-none ${className}`}
    >
      <rect
        x="12"
        y="16"
        width="24"
        height="32"
        rx="4"
        fill={color}
        opacity={opacity * 0.6}
      />
      <rect
        x="12"
        y="16"
        width="24"
        height="32"
        rx="4"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity={opacity}
      />
      <rect
        x="8"
        y="12"
        width="32"
        height="6"
        rx="3"
        fill={color}
        opacity={opacity * 0.8}
      />
      <rect
        x="8"
        y="46"
        width="32"
        height="6"
        rx="3"
        fill={color}
        opacity={opacity * 0.8}
      />
      <path
        d="M18 22 Q24 28 30 22 Q24 34 18 28 Q24 40 30 34 Q24 46 18 40"
        stroke={threadColor}
        strokeWidth="1.2"
        fill="none"
        opacity={opacity * 0.7}
        strokeLinecap="round"
      />
    </svg>
  );
}

export {
  YarnThread,
  YarnBall,
  CrochetHook,
  StitchDots,
  NeedlePair,
  ThreadSpool,
};

export default function CraftBackground({
  children,
  className = "",
}: CraftBackgroundProps) {
  return (
    <div className={`relative ${className}`}>{children}</div>
  );
}
