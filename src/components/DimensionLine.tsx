
type Props = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  offset?: number; // perpendicular offset for the dim line from the two points
  textSide?: "above" | "below" | "left" | "right";
  fontSize?: number;
};

// Reusable architectural dimension line with ticks and a centred label.
// Works for horizontal and vertical dimensions; diagonal not supported.
export default function DimensionLine({
  x1, y1, x2, y2,
  label,
  offset = 20,
  fontSize = 10,
}: Props) {
  const isHorizontal = Math.abs(y2 - y1) < 1;
  const tickLen = 6;

  if (isHorizontal) {
    const dy = offset;
    const mx = (x1 + x2) / 2;
    const lineY = Math.min(y1, y2) + dy;
    return (
      <g fill="none" stroke="#444" strokeWidth={0.5}>
        {/* witness lines */}
        <line x1={x1} y1={y1} x2={x1} y2={lineY} strokeDasharray="2 2" />
        <line x1={x2} y1={y2} x2={x2} y2={lineY} strokeDasharray="2 2" />
        {/* dim line */}
        <line x1={x1} y1={lineY} x2={x2} y2={lineY} />
        {/* ticks */}
        <line x1={x1} y1={lineY - tickLen / 2} x2={x1} y2={lineY + tickLen / 2} />
        <line x1={x2} y1={lineY - tickLen / 2} x2={x2} y2={lineY + tickLen / 2} />
        <text
          x={mx}
          y={lineY - 3}
          textAnchor="middle"
          fontSize={fontSize}
          fill="#333"
          stroke="none"
          fontFamily="system-ui, sans-serif"
        >
          {label}
        </text>
      </g>
    );
  } else {
    // vertical
    const dx = offset;
    const my = (y1 + y2) / 2;
    const lineX = Math.min(x1, x2) - dx;
    return (
      <g fill="none" stroke="#444" strokeWidth={0.5}>
        <line x1={x1} y1={y1} x2={lineX} y2={y1} strokeDasharray="2 2" />
        <line x1={x2} y1={y2} x2={lineX} y2={y2} strokeDasharray="2 2" />
        <line x1={lineX} y1={y1} x2={lineX} y2={y2} />
        <line x1={lineX - tickLen / 2} y1={y1} x2={lineX + tickLen / 2} y2={y1} />
        <line x1={lineX - tickLen / 2} y1={y2} x2={lineX + tickLen / 2} y2={y2} />
        <text
          x={lineX - 3}
          y={my}
          textAnchor="middle"
          fontSize={fontSize}
          fill="#333"
          stroke="none"
          fontFamily="system-ui, sans-serif"
          transform={`rotate(-90, ${lineX - 3}, ${my})`}
        >
          {label}
        </text>
      </g>
    );
  }
}
