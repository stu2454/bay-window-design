import { useRef } from "react";
import type { BayWindowDesign } from "../lib/types";
import { deriveGeometry } from "../lib/geometry";
import { downloadJson } from "../lib/exportSvg";
import { defaultDesign } from "../lib/defaults";

type Props = {
  design: BayWindowDesign;
  onImport: (d: BayWindowDesign) => void;
};

export default function JsonModelPanel({ design, onImport }: Props) {
  const geo = deriveGeometry(design);
  const fileRef = useRef<HTMLInputElement>(null);

  const derived = {
    frontBayWidth: Math.round(geo.frontBayWidth),
    glassPaneHeight: Math.round(geo.glassPaneHeight),
    totalNominalHeight: geo.totalNominalHeight,
    sideReturnRun: Math.round(geo.sideReturnRun),
    sideReturnDepth: Math.round(geo.sideReturnDepth),
    totalPlanWidth: Math.round(geo.totalPlanWidth),
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        onImport({ ...defaultDesign, ...parsed });
      } catch {
        alert("Could not parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Design Model JSON</h2>
        <div className="flex gap-2">
          <button
            className="text-xs text-blue-600 underline"
            onClick={() => downloadJson({ design, derived }, "bay-window-design.json")}
          >
            Export JSON
          </button>
          <button
            className="text-xs text-blue-600 underline"
            onClick={() => fileRef.current?.click()}
          >
            Import JSON
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-1">Parameters</p>
          <pre className="text-xs bg-gray-50 border border-gray-200 rounded p-2 overflow-auto max-h-64">
            {JSON.stringify(design, null, 2)}
          </pre>
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-1">Derived geometry</p>
          <pre className="text-xs bg-gray-50 border border-gray-200 rounded p-2 overflow-auto max-h-64">
            {JSON.stringify(derived, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
