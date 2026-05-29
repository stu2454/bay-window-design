import type { BayWindowDesign } from "./types";

export const defaultDesign: BayWindowDesign = {
  units: "mm",

  overallWidth: 2600,
  overallHeight: 2100,
  overallWidthMode: "front_apparent",

  frontFaceWidth: 1650,
  frontBayCount: 3,
  glassPanesPerFrontBay: 3,

  sideReturnWidth: 475,
  sideReturnGlassPanes: 3,
  projection: 550,
  sideAngleDegrees: 40,

  timberBaseHeight: 500,
  glazingHeight: 1200,
  headRailHeight: 120,
  sillHeight: 90,

  mullionWidth: 70,
  railWidth: 55,
  frameWidth: 80,

  showDividedBasePanels: false,
  showDimensionLabels: true,
  showHistoricUncertaintyNotes: true,
};
