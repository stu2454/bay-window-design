export type BayWindowDesign = {
  units: "mm";

  overallWidth: number;
  overallHeight: number;
  overallWidthMode: "front_apparent" | "wall_span";

  frontFaceWidth: number;
  frontBayCount: number;
  glassPanesPerFrontBay: number;

  sideReturnWidth: number;
  sideReturnGlassPanes: number;
  projection: number;
  // Angle of side return panel measured from the building wall face (0° = parallel to wall, 90° = perpendicular)
  sideAngleDegrees: number;

  timberBaseHeight: number;
  glazingHeight: number;
  headRailHeight: number;
  sillHeight: number;

  mullionWidth: number;
  railWidth: number;
  frameWidth: number;

  showDividedBasePanels: boolean;
  showDimensionLabels: boolean;
  showHistoricUncertaintyNotes: boolean;
};

export type DerivedGeometry = {
  frontBayWidth: number;
  glassPaneHeight: number;
  totalNominalHeight: number;
  // Plan geometry
  sideReturnDepth: number; // horizontal depth of angled return in plan
  sideReturnRun: number;   // lateral extent of angled return in plan
  totalPlanWidth: number;
};

export type ValidationWarning = {
  field: string;
  message: string;
};
