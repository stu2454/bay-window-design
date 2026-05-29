import { useRef } from "react";
import type { BayWindowDesign } from "../lib/types";
import { deriveGeometry } from "../lib/geometry";
import DimensionLine from "./DimensionLine";
import { downloadSvg } from "../lib/exportSvg";

type Props = { design: BayWindowDesign };

const SCALE = 0.28;
const PAD = 70;

export default function PlanViewSvg({ design: d }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const geo = deriveGeometry(d);

  // Plan coordinates — looking down from above.
  // The wall runs horizontally. The bay projects downward (toward viewer).
  //
  //   Wall ──────────────────────────────────────────
  //              L corner                R corner
  //                  ╲               ╱
  //                   ╲ side return ╱
  //                    ┌──┬──┬──┐
  //                    │  │  │  │  ← front face (3 bays)
  //
  // Origin: left wall attachment point at top-left.

  const wallY = PAD;
  const frontY = wallY + d.projection * SCALE;

  // X positions of key plan points
  const wallLeft = PAD;
  const wallRight = wallLeft + geo.totalPlanWidth * SCALE;

  // Left corner: where angled return meets front face (in plan)
  const cornerLeftX = wallLeft + geo.sideReturnRun * SCALE;
  const cornerRightX = cornerLeftX + d.frontFaceWidth * SCALE;

  // Front face bay divisions
  const bayW = (d.frontFaceWidth / d.frontBayCount) * SCALE;

  const svgW = wallRight - wallLeft + PAD * 2;
  const svgH = frontY + PAD + 40;

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          Plan View
        </h2>
        <button
          className="text-xs text-blue-600 underline"
          onClick={() => svgRef.current && downloadSvg(svgRef.current, "plan-view.svg")}
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
        {/* Wall line */}
        <line
          x1={wallLeft} y1={wallY}
          x2={wallRight} y2={wallY}
          stroke="#111" strokeWidth={3}
        />
        <text x={wallLeft} y={wallY - 6} fontSize={9} fill="#333">
          Building wall face
        </text>

        {/* Left angled return */}
        <line
          x1={wallLeft} y1={wallY}
          x2={cornerLeftX} y2={frontY}
          stroke="#111" strokeWidth={1.2}
        />

        {/* Right angled return */}
        <line
          x1={wallRight} y1={wallY}
          x2={cornerRightX} y2={frontY}
          stroke="#111" strokeWidth={1.2}
        />

        {/* Front face */}
        <line
          x1={cornerLeftX} y1={frontY}
          x2={cornerRightX} y2={frontY}
          stroke="#111" strokeWidth={1.5}
        />

        {/* Front bay mullion divisions */}
        {Array.from({ length: d.frontBayCount - 1 }, (_, i) => {
          const mx = cornerLeftX + (i + 1) * bayW;
          return (
            <line
              key={`plan-mullion-${i}`}
              x1={mx} y1={frontY - 3}
              x2={mx} y2={frontY + 3}
              stroke="#555" strokeWidth={1}
            />
          );
        })}

        {/* Hatch fill for side returns */}
        <polygon
          points={`${wallLeft},${wallY} ${cornerLeftX},${frontY} ${cornerLeftX},${wallY}`}
          fill="rgba(200,190,170,0.3)"
          stroke="none"
        />
        <polygon
          points={`${wallRight},${wallY} ${cornerRightX},${frontY} ${cornerRightX},${wallY}`}
          fill="rgba(200,190,170,0.3)"
          stroke="none"
        />

        {/* Dimension lines */}
        {d.showDimensionLabels && (
          <>
            {/* Front face width */}
            <DimensionLine
              x1={cornerLeftX} y1={frontY + 10}
              x2={cornerRightX} y2={frontY + 10}
              label={`${d.frontFaceWidth} mm`}
              offset={18}
            />
            {/* Total plan width (along wall) */}
            <DimensionLine
              x1={wallLeft} y1={wallY - 14}
              x2={wallRight} y2={wallY - 14}
              label={`${Math.round(geo.totalPlanWidth)} mm overall`}
              offset={16}
            />
            {/* Projection */}
            <DimensionLine
              x1={wallLeft - 10} y1={wallY}
              x2={wallLeft - 10} y2={frontY}
              label={`${d.projection} mm`}
              offset={28}
            />
            {/* Side return width label */}
            <text
              x={(wallLeft + cornerLeftX) / 2}
              y={(wallY + frontY) / 2 - 4}
              textAnchor="middle"
              fontSize={8}
              fill="#666"
              transform={`rotate(${-(d.sideAngleDegrees)}, ${(wallLeft + cornerLeftX) / 2}, ${(wallY + frontY) / 2})`}
            >
              {d.sideReturnWidth} mm
            </text>
          </>
        )}

        {/* Angle label */}
        <text
          x={wallLeft + 18}
          y={wallY + 18}
          fontSize={9}
          fill="#555"
        >
          {d.sideAngleDegrees}°
        </text>

        {/* Bay count label on front face */}
        <text
          x={(cornerLeftX + cornerRightX) / 2}
          y={frontY - 6}
          textAnchor="middle"
          fontSize={9}
          fill="#335577"
        >
          {d.frontBayCount} front bays
        </text>

        {d.showHistoricUncertaintyNotes && (
          <text x={wallLeft} y={svgH - 10} fontSize={8} fill="#888">
            Plan is interpretive. Side angle = {d.sideAngleDegrees}° from wall face (approx.). All dims mm.
          </text>
        )}
      </svg>
    </div>
  );
}
