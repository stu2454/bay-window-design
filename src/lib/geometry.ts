import type { BayWindowDesign, DerivedGeometry, ValidationWarning } from "./types";

export function deriveGeometry(d: BayWindowDesign): DerivedGeometry {
  const frontBayWidth = d.frontFaceWidth / d.frontBayCount;
  const glassPaneHeight =
    (d.glazingHeight - d.railWidth * (d.glassPanesPerFrontBay - 1)) /
    d.glassPanesPerFrontBay;
  const totalNominalHeight =
    d.headRailHeight + d.glazingHeight + d.timberBaseHeight + d.sillHeight;

  // sideAngleDegrees is the angle of the return panel from the wall face.
  // In plan: the return panel runs from a corner of the front face back to the wall.
  // sideReturnRun  = horizontal (along-wall) distance the return spans
  // sideReturnDepth = perpendicular (projection) distance the return spans
  // The panel length along the face = sideReturnWidth (the nominal glazed width).
  // angle θ from wall => the panel makes angle θ with the wall:
  //   run  = sideReturnWidth * cos(θ)   [along wall]
  //   depth= sideReturnWidth * sin(θ)   [into room / projection]
  const angleRad = (d.sideAngleDegrees * Math.PI) / 180;
  const sideReturnRun = d.sideReturnWidth * Math.cos(angleRad);
  const sideReturnDepth = d.sideReturnWidth * Math.sin(angleRad);

  // Total plan width = front face + two side return lateral runs
  const totalPlanWidth = d.frontFaceWidth + 2 * sideReturnRun;

  return {
    frontBayWidth,
    glassPaneHeight,
    totalNominalHeight,
    sideReturnDepth,
    sideReturnRun,
    totalPlanWidth,
  };
}

export function validate(d: BayWindowDesign): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];
  const geo = deriveGeometry(d);

  if (d.frontBayCount !== 3) {
    warnings.push({
      field: "frontBayCount",
      message:
        "Heritage interpretation assumes three front vertical bays. Current value deviates.",
    });
  }

  if (d.glassPanesPerFrontBay !== 3) {
    warnings.push({
      field: "glassPanesPerFrontBay",
      message:
        "Heritage interpretation assumes three stacked glass panes above the timber base per front bay. Current value deviates.",
    });
  }

  if (d.frontFaceWidth > d.overallWidth) {
    warnings.push({
      field: "frontFaceWidth",
      message: "Front face width exceeds overall width.",
    });
  }

  if (geo.totalNominalHeight > d.overallHeight) {
    warnings.push({
      field: "overallHeight",
      message: `Sum of rail heights (${geo.totalNominalHeight} mm) exceeds overall height (${d.overallHeight} mm).`,
    });
  }

  if (geo.glassPaneHeight < 150) {
    warnings.push({
      field: "glassPanesPerFrontBay",
      message: `Derived glass pane height (${Math.round(geo.glassPaneHeight)} mm) is below the 150 mm minimum. Reduce pane count or increase glazing height.`,
    });
  }

  if (d.sideAngleDegrees <= 0 || d.sideAngleDegrees >= 90) {
    warnings.push({
      field: "sideAngleDegrees",
      message: "Side angle must be between 0° and 90° (exclusive).",
    });
  }

  if (geo.sideReturnDepth > d.projection + 1) {
    warnings.push({
      field: "sideAngleDegrees",
      message: `Side return depth (${Math.round(geo.sideReturnDepth)} mm) exceeds projection (${d.projection} mm). Check angle and return width.`,
    });
  }

  return warnings;
}
