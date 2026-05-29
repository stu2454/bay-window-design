import type { BayWindowDesign } from "../lib/types";
import { deriveGeometry } from "../lib/geometry";
import DimensionLine from "./DimensionLine";

type Props = { design: BayWindowDesign };

const SCALE = 0.30;
const PAD = 55;

export default function TypicalPanelSvg({ design: d }: Props) {
  const geo = deriveGeometry(d);

  const W = (d.frontFaceWidth / d.frontBayCount) * SCALE;
  const paneH = geo.glassPaneHeight * SCALE;
  const railH = d.railWidth * SCALE;
  const frameW = d.frameWidth * SCALE;
  const baseH = d.timberBaseHeight * SCALE;
  const headH = d.headRailHeight * SCALE;
  const sillH = d.sillHeight * SCALE;
  const totalH = headH + d.glazingHeight * SCALE + baseH + sillH;

  const svgW = W + PAD * 2;
  const svgH = totalH + PAD * 2;

  const xLeft = PAD;
  const yTop = PAD;
  const yGlazingTop = yTop + headH;
  const yGlazingBot = yGlazingTop + d.glazingHeight * SCALE;
  const yBaseBot = yGlazingBot + baseH;
  const ySill = yBaseBot + sillH;

  return (
    <div className="flex flex-col items-start gap-2">
      <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
        Typical Front Bay Panel
      </h2>
      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ background: "white", border: "1px solid #ccc" }}
        fontFamily="system-ui, sans-serif"
      >
        {/* Outer frame */}
        <rect
          x={xLeft} y={yTop}
          width={W} height={ySill - yTop}
          fill="none" stroke="#111" strokeWidth={1.5}
        />

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
        {Array.from({ length: d.glassPanesPerFrontBay }, (_, p) => {
          const paneY = yGlazingTop + p * (paneH + railH);
          return (
            <g key={p}>
              {p > 0 && (
                <rect x={xLeft} y={paneY - railH} width={W} height={railH}
                  fill="#c8bfaa" stroke="#555" strokeWidth={0.5} />
              )}
              <rect x={xLeft + frameW / 4} y={paneY} width={W - frameW / 2} height={paneH}
                fill="rgba(200,230,255,0.4)" stroke="#335577" strokeWidth={0.8} />
            </g>
          );
        })}

        {/* Dimension lines */}
        {d.showDimensionLabels && (
          <>
            <DimensionLine
              x1={xLeft} y1={ySill + 6}
              x2={xLeft + W} y2={ySill + 6}
              label={`${Math.round(geo.frontBayWidth)} mm`}
              offset={18}
            />
            <DimensionLine
              x1={xLeft - 6} y1={yGlazingTop}
              x2={xLeft - 6} y2={yGlazingBot}
              label={`${d.glazingHeight}`}
              offset={28}
            />
            <DimensionLine
              x1={xLeft - 6} y1={yGlazingBot}
              x2={xLeft - 6} y2={yBaseBot}
              label={`${d.timberBaseHeight}`}
              offset={28}
            />
            {/* One pane height */}
            <DimensionLine
              x1={xLeft + W + 4} y1={yGlazingTop}
              x2={xLeft + W + 4} y2={yGlazingTop + paneH}
              label={`${Math.round(geo.glassPaneHeight)}`}
              offset={22}
            />
          </>
        )}

        <text x={xLeft} y={svgH - 8} fontSize={9} fill="#666">
          Typical bay — 1 of {d.frontBayCount} — {d.glassPanesPerFrontBay} panes above base — dims mm
        </text>
      </svg>
    </div>
  );
}
