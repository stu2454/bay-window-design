import { useState } from "react";
import { defaultDesign } from "./lib/defaults";
import { validate } from "./lib/geometry";
import type { BayWindowDesign } from "./lib/types";
import ControlsPanel from "./components/ControlsPanel";
import FrontElevationSvg from "./components/FrontElevationSvg";
import PlanViewSvg from "./components/PlanViewSvg";
import TypicalPanelSvg from "./components/TypicalPanelSvg";
import SideReturnElevationSvg from "./components/SideReturnElevationSvg";
import JsonModelPanel from "./components/JsonModelPanel";
import HelpPanel from "./components/HelpPanel";
import "./index.css";

type Tab = "help" | "elevation" | "plan" | "panel" | "side" | "json";

export default function App() {
  const [design, setDesign] = useState<BayWindowDesign>(defaultDesign);
  const [activeTab, setActiveTab] = useState<Tab>("help");
  const warnings = validate(design);

  const tabs: { id: Tab; label: string }[] = [
    { id: "help", label: "How to Use" },
    { id: "elevation", label: "Front Elevation" },
    { id: "plan", label: "Plan View" },
    { id: "panel", label: "Typical Panel" },
    { id: "side", label: "Side Return" },
    { id: "json", label: "JSON Model" },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <header className="bg-stone-800 text-stone-100 px-6 py-3 flex items-baseline gap-4">
        <h1 className="text-base font-semibold tracking-wide">
          Bay Window Design — 38 Myrtle St, Dorrigo
        </h1>
        <span className="text-xs text-stone-400">
          Heritage timber canted bay window · Parametric model · All dims mm
        </span>
      </header>

      <div className="flex flex-1 gap-0 overflow-hidden">
        <aside className="w-56 shrink-0 overflow-y-auto bg-stone-50 border-r border-stone-200 p-3">
          <ControlsPanel design={design} onChange={setDesign} warnings={warnings} />
        </aside>

        <main className="flex-1 flex flex-col overflow-auto">
          <div className="flex gap-0 border-b border-stone-200 bg-white px-4 pt-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 text-sm border-b-2 -mb-px transition-colors ${
                  activeTab === t.id
                    ? "border-stone-700 text-stone-900 font-medium"
                    : "border-transparent text-stone-500 hover:text-stone-700"
                }`}
              >
                {t.label}
              </button>
            ))}
            {warnings.length > 0 && (
              <span className="ml-auto self-center text-xs text-amber-600 font-medium px-2">
                {warnings.length} warning{warnings.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="flex-1 p-6 overflow-auto">
            {activeTab === "help" && <HelpPanel />}
            {activeTab === "elevation" && <FrontElevationSvg design={design} />}
            {activeTab === "plan" && <PlanViewSvg design={design} />}
            {activeTab === "panel" && <TypicalPanelSvg design={design} />}
            {activeTab === "side" && <SideReturnElevationSvg design={design} />}
            {activeTab === "json" && (
              <JsonModelPanel design={design} onImport={setDesign} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
