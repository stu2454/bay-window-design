import { useRef } from "react";
import type { BayWindowDesign } from "../lib/types";
import { deriveGeometry } from "../lib/geometry";
import DimensionLine from "./DimensionLine";
import { downloadSvg } from "../lib/exportSvg";

type Props = { design: BayWindowDesign };

const SCALE = 0.22; // mm → SVG px
const PAD = 60;     // padding for dimension labels

export default function FrontElevationSvg({ design: d }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const geo = deriveGeometry(d);

  const W = d.frontFaceWidth * SCALE;
  const H = geo.totalNominalHeight * SCALE;
  const svgW = W + PAD * 2;
  const svgH = H + PAD * 2;

  // Y positions (top-down in SVG)
  const yTop = PAD;                                              // top of head rail
  const yGlazingTop = yTop + d.headRailHeight * SCALE;          // top of glazing zone
  const yGlazingBot = yGlazingTop + d.glazingHeight * SCALE;    // bottom of glazing zone
  const yBaseBot = yGlazingBot + d.timberBaseHeight * SCALE;    // bottom of timber base
  const ySill = yBaseBot + d.sillHeight * SCALE;                // bottom of sill

  const xLeft = PAD;
  const xRight = PAD + W;

  // Bay divisions
  const bayW = (d.frontFaceWidth / d.frontBayCount) * SCALE;
  const mullW = d.mullionWidth * SCALE;
  const railH = d.railWidth * SCALE;
  const frameW = d.frameWidth * SCALE;

  // Glass pane heights within the glazing zone (accounting for rails between panes)
  const paneH = geo.glassPaneHeight * SCALE;

  const bays = Array.from({ length: d.frontBayCount }, (_, i) => i);

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          Front Elevation
        </h2>
        <button
          className="text-xs text-blue-600 underline"
          onClick={() => svgRef.current && downloadSvg(svgRef.current, "front-elevation.svg")}
        >
          Export SVG
        </button>
      </div>

      <svg
        ref={svgRef}
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ background: "white", border: "1px solid #ccc" }}
        fontFamily="system-ui, sans-serif"
      >
        {/* Outer frame */}
        <rect
          x={xLeft}
          y={yTop}
          width={W}
          height={ySill - yTop}
          fill="none"
          stroke="#111"
          strokeWidth={1.5}
        />

        {/* Head rail band */}
        <rect
          x={xLeft}
          y={yTop}
          width={W}
          height={d.headRailHeight * SCALE}
          fill="#e8e0d0"
          stroke="#111"
          strokeWidth={0.8}
        />

        {/* Sill band */}
        <rect
          x={xLeft}
          y={yBaseBot}
          width={W}
          height={d.sillHeight * SCALE}
          fill="#e8e0d0"
          stroke="#111"
          strokeWidth={0.8}
        />

        {/* Timber base */}
        <rect
          x={xLeft}
          y={yGlazingBot}
          width={W}
          height={d.timberBaseHeight * SCALE}
          fill="#d4c9b0"
          stroke="#111"
          strokeWidth={0.8}
        />

        {/* Divided base panels (optional) */}
        {d.showDividedBasePanels &&
          bays.map((i) => {
            const bx = xLeft + i * bayW;
            return (
              <rect
                key={`base-panel-${i}`}
                x={bx + frameW / 2}
                y={yGlazingBot + frameW / 2}
                width={bayW - frameW}
                height={d.timberBaseHeight * SCALE - frameW}
                fill="none"
                stroke="#777"
                strokeWidth={0.5}
                strokeDasharray="3 2"
              />
            );
          })}

        {/* Per-bay glazing */}
        {bays.map((i) => {
          const bx = xLeft + i * bayW;
          const glassX = bx + mullW / 2;
          const glassW = bayW - mullW;

          return (
            <g key={`bay-${i}`}>
              {/* Mullion */}
              {i > 0 && (
                <rect
                  x={bx - mullW / 2}
                  y={yGlazingTop}
                  width={mullW}
                  height={d.glazingHeight * SCALE}
                  fill="#c8bfaa"
                  stroke="#555"
                  strokeWidth={0.5}
                />
              )}

              {/* Three stacked panes */}
              {Array.from({ length: d.glassPanesPerFrontBay }, (_, p) => {
                const paneY = yGlazingTop + p * (paneH + railH);
                return (
                  <g key={`pane-${i}-${p}`}>
                    {/* Rail above pane (except first) */}
                    {p > 0 && (
                      <rect
                        x={glassX}
                        y={paneY - railH}
                        width={glassW}
                        height={railH}
                        fill="#c8bfaa"
                        stroke="#555"
                        strokeWidth={0.5}
                      />
                    )}
                    {/* Glass pane */}
                    <rect
                      x={glassX}
                      y={paneY}
                      width={glassW}
                      height={paneH}
                      fill="rgba(200,230,255,0.35)"
                      stroke="#335577"
                      strokeWidth={0.7}
                    />
                    {/* Pane label */}
                    <text
                      x={glassX + glassW / 2}
                      y={paneY + paneH / 2 + 3}
                      textAnchor="middle"
                      fontSize={8}
                      fill="#446688"
                    >
                      {String.fromCharCode(65 + p)}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Dimension lines */}
        {d.showDimensionLabels && (
          <>
            {/* Overall width */}
            <DimensionLine
              x1={xLeft} y1={ySill + 8}
              x2={xRight} y2={ySill + 8}
              label={`${d.frontFaceWidth} mm`}
              offset={20}
            />
            {/* Overall height */}
            <DimensionLine
              x1={xLeft - 8} y1={yTop}
              x2={xLeft - 8} y2={ySill}
              label={`${geo.totalNominalHeight} mm`}
              offset={30}
            />
            {/* Head rail */}
            <DimensionLine
              x1={xRight + 8} y1={yTop}
              x2={xRight + 8} y2={yGlazingTop}
              label={`${d.headRailHeight}`}
              offset={22}
            />
            {/* Glazing zone */}
            <DimensionLine
              x1={xRight + 8} y1={yGlazingTop}
              x2={xRight + 8} y2={yGlazingBot}
              label={`${d.glazingHeight}`}
              offset={22}
            />
            {/* Timber base */}
            <DimensionLine
              x1={xRight + 8} y1={yGlazingBot}
              x2={xRight + 8} y2={yBaseBot}
              label={`${d.timberBaseHeight}`}
              offset={22}
            />
          </>
        )}

        {/* Title */}
        <text x={xLeft} y={svgH - 8} fontSize={9} fill="#666">
          Front Elevation — {d.frontBayCount} bays × {d.glassPanesPerFrontBay} panes — all dims mm (approx.)
        </text>
      </svg>
    </div>
  );
}
