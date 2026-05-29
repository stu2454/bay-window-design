import type { BayWindowDesign } from "../lib/types";
import type { ValidationWarning } from "../lib/types";

type Props = {
  design: BayWindowDesign;
  onChange: (d: BayWindowDesign) => void;
  warnings: ValidationWarning[];
};

function NumericField({
  label, value, field, design, onChange, min, max, step = 1,
}: {
  label: string;
  value: number;
  field: keyof BayWindowDesign;
  design: BayWindowDesign;
  onChange: (d: BayWindowDesign) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
          onChange={(e) =>
            onChange({ ...design, [field]: parseFloat(e.target.value) || 0 })
          }
        />
        <span className="text-xs text-gray-400">mm</span>
      </div>
    </label>
  );
}

function ToggleField({
  label, value, field, design, onChange,
}: {
  label: string;
  value: boolean;
  field: keyof BayWindowDesign;
  design: BayWindowDesign;
  onChange: (d: BayWindowDesign) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={value}
        className="w-4 h-4"
        onChange={(e) => onChange({ ...design, [field]: e.target.checked })}
      />
      <span className="text-xs text-gray-600">{label}</span>
    </label>
  );
}

export default function ControlsPanel({ design, onChange, warnings }: Props) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white border border-gray-200 rounded-lg text-sm min-w-[220px]">
      <h2 className="font-semibold text-gray-700 border-b pb-1">Parameters</h2>

      {warnings.length > 0 && (
        <div className="flex flex-col gap-1">
          {warnings.map((w, i) => (
            <div key={i} className="text-xs bg-amber-50 border border-amber-300 text-amber-800 rounded px-2 py-1">
              {w.message}
            </div>
          ))}
        </div>
      )}

      <section className="flex flex-col gap-2">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Overall</p>
        <NumericField label="Overall width" value={design.overallWidth} field="overallWidth" design={design} onChange={onChange} min={500} />
        <NumericField label="Overall height" value={design.overallHeight} field="overallHeight" design={design} onChange={onChange} min={500} />
        <label className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-500">Width mode</span>
          <select
            value={design.overallWidthMode}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            onChange={(e) =>
              onChange({ ...design, overallWidthMode: e.target.value as BayWindowDesign["overallWidthMode"] })
            }
          >
            <option value="front_apparent">Front apparent width</option>
            <option value="wall_span">Wall span</option>
          </select>
        </label>
      </section>

      <section className="flex flex-col gap-2">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Front Face</p>
        <NumericField label="Front face width" value={design.frontFaceWidth} field="frontFaceWidth" design={design} onChange={onChange} min={300} />
        <NumericField label="Front bay count" value={design.frontBayCount} field="frontBayCount" design={design} onChange={onChange} min={1} max={6} step={1} />
        <NumericField label="Glass panes per bay" value={design.glassPanesPerFrontBay} field="glassPanesPerFrontBay" design={design} onChange={onChange} min={1} max={6} step={1} />
      </section>

      <section className="flex flex-col gap-2">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Side Returns</p>
        <NumericField label="Side return width" value={design.sideReturnWidth} field="sideReturnWidth" design={design} onChange={onChange} min={100} />
        <NumericField label="Return glass panes" value={design.sideReturnGlassPanes} field="sideReturnGlassPanes" design={design} onChange={onChange} min={1} max={6} step={1} />
        <NumericField label="Projection (from wall)" value={design.projection} field="projection" design={design} onChange={onChange} min={100} />
        <label className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-500">Side angle (° from wall face)</span>
          <input
            type="number"
            value={design.sideAngleDegrees}
            min={5} max={85} step={1}
            className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
            onChange={(e) =>
              onChange({ ...design, sideAngleDegrees: parseFloat(e.target.value) || 45 })
            }
          />
        </label>
      </section>

      <section className="flex flex-col gap-2">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Heights</p>
        <NumericField label="Glazing height" value={design.glazingHeight} field="glazingHeight" design={design} onChange={onChange} min={300} />
        <NumericField label="Timber base height" value={design.timberBaseHeight} field="timberBaseHeight" design={design} onChange={onChange} min={100} />
        <NumericField label="Head rail height" value={design.headRailHeight} field="headRailHeight" design={design} onChange={onChange} min={30} />
        <NumericField label="Sill height" value={design.sillHeight} field="sillHeight" design={design} onChange={onChange} min={30} />
      </section>

      <section className="flex flex-col gap-2">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Timber Members</p>
        <NumericField label="Mullion width" value={design.mullionWidth} field="mullionWidth" design={design} onChange={onChange} min={20} />
        <NumericField label="Rail width" value={design.railWidth} field="railWidth" design={design} onChange={onChange} min={20} />
        <NumericField label="Frame width" value={design.frameWidth} field="frameWidth" design={design} onChange={onChange} min={20} />
      </section>

      <section className="flex flex-col gap-2">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Display</p>
        <ToggleField label="Show dimension labels" value={design.showDimensionLabels} field="showDimensionLabels" design={design} onChange={onChange} />
        <ToggleField label="Divide base panels" value={design.showDividedBasePanels} field="showDividedBasePanels" design={design} onChange={onChange} />
        <ToggleField label="Show uncertainty notes" value={design.showHistoricUncertaintyNotes} field="showHistoricUncertaintyNotes" design={design} onChange={onChange} />
      </section>
    </div>
  );
}
