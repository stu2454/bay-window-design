export default function HelpPanel() {
  return (
    <div className="max-w-2xl flex flex-col gap-6 text-sm text-gray-700">
      <div>
        <h2 className="text-lg font-semibold text-stone-800 mb-1">
          Bay Window Parametric Design Tool
        </h2>
        <p className="text-gray-500 text-xs">
          38 Myrtle St, Dorrigo — Heritage timber canted bay window reconstruction
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-800">
        <strong>Heritage note:</strong> All drawings are interpretive, based on a low-resolution
        archival photograph. Dimensions are approximate. Do not use for certified construction
        or heritage approval without site verification.
      </div>

      <section className="flex flex-col gap-2">
        <h3 className="font-semibold text-stone-700">What this tool does</h3>
        <p>
          It generates consistent architectural diagrams from an explicit set of parameters.
          Change a dimension in the controls panel and every drawing updates instantly.
          No geometry is hardcoded — everything derives from the parameter model.
        </p>
        <p>
          The goal is to move from a historic photograph interpretation to an adjustable,
          code-enforced design model you can share with a builder, joiner, or heritage adviser.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="font-semibold text-stone-700">The five tabs</h3>
        <div className="flex flex-col gap-2">
          {[
            {
              tab: "Front Elevation",
              desc: "The main view. Shows all three front bays, each with three stacked glass panes above the timber base. This is the most important view to get right.",
            },
            {
              tab: "Plan View",
              desc: "Looking down from above. Shows the wall line, the two angled side returns, and the flat front face divided into three bays. Confirms the plan geometry is consistent with the elevation.",
            },
            {
              tab: "Typical Panel",
              desc: "One isolated front bay with dimension labels. Useful for discussing rail heights, pane heights, and base dimensions with a joiner.",
            },
            {
              tab: "Side Return",
              desc: "One angled side return panel. Shown with an uncertainty hatch overlay because the exact arrangement of the side returns is less certain than the front face.",
            },
            {
              tab: "JSON Model",
              desc: "The raw parameter model and all derived geometry values. Export to save your design; import to restore a saved version.",
            },
          ].map(({ tab, desc }) => (
            <div key={tab} className="flex gap-3">
              <span className="shrink-0 font-medium text-stone-600 w-36">{tab}</span>
              <span className="text-gray-600">{desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="font-semibold text-stone-700">How to use the controls panel</h3>
        <ul className="list-disc list-inside flex flex-col gap-1 text-gray-600">
          <li>All dimensions are in <strong>millimetres</strong>.</li>
          <li>The defaults are current best estimates from the photograph — change them as site measurements become available.</li>
          <li><strong>Front face width</strong> is the flat central section only, not including the angled returns.</li>
          <li><strong>Side angle</strong> is measured from the building wall face (0° = panel runs along the wall, 90° = panel runs perpendicular). A typical canted bay is 30°–60°.</li>
          <li><strong>Projection</strong> is the perpendicular distance the front face sits out from the wall.</li>
          <li>The <strong>Divide base panels</strong> toggle splits the timber base into three recessed panels aligned with the bays above.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="font-semibold text-stone-700">Warnings</h3>
        <p className="text-gray-600">
          Orange warning badges appear when parameters deviate from the heritage interpretation
          (e.g. fewer than three bays or three panes), or when the geometry is inconsistent
          (e.g. sum of heights exceeds overall height). Warnings do not block drawing — they
          flag assumptions worth reviewing.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="font-semibold text-stone-700">Saving and sharing your design</h3>
        <p className="text-gray-600">
          Use <strong>Export JSON</strong> on the JSON Model tab to save the current parameters
          as a file. Use <strong>Import JSON</strong> to reload a saved design. Each SVG drawing
          can also be exported individually via the link above its diagram.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="font-semibold text-stone-700">Default dimensions</h3>
        <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs font-mono grid grid-cols-2 gap-x-6 gap-y-0.5 text-gray-700">
          {[
            ["Overall width", "2600 mm"],
            ["Overall height", "2100 mm"],
            ["Front face width", "1650 mm"],
            ["Front bays", "3"],
            ["Glass panes per bay", "3"],
            ["Side return width", "475 mm"],
            ["Projection", "550 mm"],
            ["Side angle", "40°"],
            ["Glazing height", "1200 mm"],
            ["Timber base height", "500 mm"],
            ["Head rail", "120 mm"],
            ["Sill", "90 mm"],
            ["Mullion width", "70 mm"],
            ["Rail width", "55 mm"],
          ].map(([k, v]) => (
            <>
              <span key={k} className="text-gray-500">{k}</span>
              <span key={v}>{v}</span>
            </>
          ))}
        </div>
      </section>
    </div>
  );
}
