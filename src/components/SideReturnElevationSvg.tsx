import type { BayWindowDesign } from "../lib/types";
import { deriveGeometry } from "../lib/geometry";
import DimensionLine from "./DimensionLine";

type Props = { design: BayWindowDesign };

const SCALE = 0.28;
const PAD = 55;

export default function SideReturnElevationSvg({ design: d }: Props) {
  const geo = deriveGeometry(d);

  const W = d.sideReturnWidth * SCALE;
  const headH = d.headRailHeight * SCALE;
  const sillH = d.sillHeight * SCALE;
  const baseH = d.timberBaseHeight * SCALE;
  const glazH = d.glazingHeight * SCALE;
  const totalH = headH + glazH + baseH + sillH;

  const paneCount = d.sideReturnGlassPanes;
  const railH = d.railWidth * SCALE;
  const paneH = (glazH - railH * (paneCount - 1)) / paneCount;

  const svgW = W + PAD * 2;
  const svgH = totalH + PAD * 2;

  const xLeft = PAD;
  const yTop = PAD;
  const yGlazingTop = yTop + headH;
  const yGlazingBot = yGlazingTop + glazH;
  const yBaseBot = yGlazingBot + baseH;
  const ySill = yBaseBot + sillH;

  return (
    <div className="flex flex-col items-start gap-2">
      <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
        Side Return Elevation
        {d.showHistoricUncertaintyNotes && (
          <span className="ml-2 text-xs text-amber-600 normal-case font-normal">
            (arrangement uncertain — interpretive)
          </span>
        )}
      </h2>
      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ background: "white", border: "1px solid #ccc" }}
        fontFamily="system-ui, sans-serif"
      >
        {/* Outer frame */}
        <rect x={xLeft} y={yTop} width={W} height={ySill - yTop}
          fill="none" stroke="#111" strokeWidth={1.5} />

        {/* Head rail */}
        <rect x={xLeft} y={yTop} width={W} height={headH}
          fill="#e8e0d0" stroke="#111" strokeWidth={0.8} />

        {/* Sill */}
        <rect x={xLeft} y={yBaseBot} width={W} height={sillH}
          fill="#e8e0d0" stroke="#111" strokeWidth={0.8} />

        {/* Timber base */}
        <rect x={xLeft} y={yGlazingBot} width={W} height={baseH}
          fill="#d4c9b0" stroke="#111" strokeWidth={0.8} />

        {/* Glass panes */}
        {Array.from({ length: paneCount }, (_, p) => {
          const paneY = yGlazingTop + p * (paneH + railH);
          return (
            <g key={p}>
              {p > 0 && (
                <rect x={xLeft} y={paneY - railH} width={W} height={railH}
                  fill="#c8bfaa" stroke="#555" strokeWidth={0.5} />
              )}
              <rect x={xLeft} y={paneY} width={W} height={paneH}
                fill="rgba(200,230,255,0.35)" stroke="#335577" strokeWidth={0.7} />
            </g>
          );
        })}

        {/* Uncertainty hatch overlay */}
        {d.showHistoricUncertaintyNotes && (
          <rect x={xLeft} y={yTop} width={W} height={ySill - yTop}
            fill="url(#hatch)" opacity={0.15} />
        )}
        <defs>
          <pattern id="hatch" patternUnits="userSpaceOnUse" width={6} height={6}>
            <line x1={0} y1={6} x2={6} y2={0} stroke="#aa6600" strokeWidth={0.8} />
          </pattern>
        </defs>

        {d.showDimensionLabels && (
          <>
            <DimensionLine
              x1={xLeft} y1={ySill + 6}
              x2={xLeft + W} y2={ySill + 6}
              label={`${d.sideReturnWidth} mm`}
              offset={18}
            />
            <DimensionLine
              x1={xLeft - 6} y1={yGlazingBot}
              x2={xLeft - 6} y2={yBaseBot}
              label={`${d.timberBaseHeight}`}
              offset={28}
            />
          </>
        )}

        <text x={xLeft} y={svgH - 8} fontSize={9} fill="#666">
          Side return — {paneCount} panes — {d.sideAngleDegrees}° from wall — dims mm (approx.)
        </text>
      </svg>
    </div>
  );
}
