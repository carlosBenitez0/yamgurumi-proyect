export default function Yarn404() {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-lg"
      role="img"
      aria-label="Ovillo de lana enredado"
    >
      {/* Background glow */}
      <circle cx="120" cy="120" r="100" fill="#acedfe" opacity="0.1" />

      {/* Yarn ball body */}
      <circle cx="120" cy="125" r="62" fill="#206776" opacity="0.9" />
      <circle cx="120" cy="125" r="62" fill="url(#yarnGrad)" />

      {/* Yarn wrapping strands */}
      {[
        { x1: 72, y1: 90, x2: 168, y2: 160, opacity: 0.3 },
        { x1: 80, y1: 170, x2: 160, y2: 80, opacity: 0.25 },
        { x1: 65, y1: 130, x2: 175, y2: 120, opacity: 0.2 },
        { x1: 90, y1: 70, x2: 150, y2: 175, opacity: 0.3 },
        { x1: 100, y1: 180, x2: 140, y2: 68, opacity: 0.25 },
        { x1: 70, y1: 105, x2: 170, y2: 145, opacity: 0.2 },
        { x1: 85, y1: 155, x2: 155, y2: 95, opacity: 0.3 },
        { x1: 75, y1: 75, x2: 165, y2: 170, opacity: 0.2 },
        { x1: 95, y1: 65, x2: 145, y2: 180, opacity: 0.25 },
      ].map((strand, i) => (
        <path
          key={i}
          d={`M${strand.x1},${strand.y1} Q${120 + (i - 4) * 6},${90 + (i % 3) * 20} ${strand.x2},${strand.y2}`}
          stroke="#90d0e1"
          strokeWidth={2 + (i % 3) * 0.5}
          strokeLinecap="round"
          fill="none"
          opacity={strand.opacity}
        />
      ))}

      {/* Loose thread trailing off (the "escaped" stitch) */}
      <path
        d="M165,100 C180,85 195,70 200,50 C205,30 195,20 185,25 C175,30 178,45 182,40"
        stroke="#206776"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      {/* Small loop at the end of the thread */}
      <path
        d="M182,40 C184,36 188,36 186,32"
        stroke="#206776"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />

      {/* Question mark from the loose thread */}
      <text
        x="195"
        y="28"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fill="#206776"
        fontFamily="Comfortaa, cursive"
        opacity="0.8"
      >
        ?
      </text>

      {/* Crochet hook */}
      <g transform="translate(80, 55) rotate(-25)">
        <rect x="0" y="0" width="4" height="70" rx="2" fill="#555" opacity="0.4" />
        <path
          d="M2,0 C2,-6 -2,-8 -2,-4"
          stroke="#555"
          strokeWidth="2.5"
          fill="none"
          opacity="0.4"
          strokeLinecap="round"
        />
      </g>

      {/* Gradients */}
      <defs>
        <radialGradient id="yarnGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#90d0e1" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#206776" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
