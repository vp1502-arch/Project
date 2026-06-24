// Unilever-INSPIRED "U" mark built from simple icon tiles.
// This is an original placeholder homage (clean, generic glyphs) and is NOT a
// reproduction of Unilever's trademarked 25-icon logo. Replace with the
// official brand asset (drop a file in /public and swap <BrandLogo/>) once
// brand approval is obtained.

// Grid cells (col,row) that form a "U" shape.
const cells: Array<[number, number]> = [
  [0, 0], [3, 0],
  [0, 1], [3, 1],
  [0, 2], [3, 2],
  [0, 3], [1, 3], [2, 3], [3, 3],
];

// A small set of simple glyphs cycled across the tiles.
const glyphs: string[] = [
  'M0,-3 L0,3 M-3,0 L3,0', // plus (sun-ish)
  'M0,-3 C2,-1 2,2 0,3 C-2,2 -2,-1 0,-3 Z', // leaf/drop
  'M0,2 C-3,-2 -1,-4 0,-1 C1,-4 3,-2 0,2 Z', // heart
  'M0,-3 L0.9,-0.9 L3,-0.9 L1.2,0.5 L1.9,2.8 L0,1.4 L-1.9,2.8 L-1.2,0.5 L-3,-0.9 L-0.9,-0.9 Z', // star
  'M-2.6,0 a2.6,2.6 0 1,0 5.2,0 a2.6,2.6 0 1,0 -5.2,0', // ring
];

export default function UnileverLogo({ size = 36 }: { size?: number }) {
  const cell = 20;
  const start = 14;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 108 108"
      role="img"
      aria-label="AI Hub logo (Unilever-inspired)"
    >
      <rect x="0" y="0" width="108" height="108" rx="22" fill="#ffffff" />
      {cells.map(([col, row], i) => {
        const x = start + col * cell;
        const y = start + row * cell;
        return (
          <g key={i} transform={`translate(${x + 8}, ${y + 8})`}>
            <rect x="-8" y="-8" width="16" height="16" rx="4" fill="#1F36C7" />
            <path
              d={glyphs[i % glyphs.length]}
              fill={glyphs[i % glyphs.length].includes('a2.6') ? 'none' : '#ffffff'}
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );
      })}
    </svg>
  );
}
