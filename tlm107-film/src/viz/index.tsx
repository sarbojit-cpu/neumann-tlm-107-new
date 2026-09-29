import React from "react";
import type { VizProps } from "./Shell.tsx";
import { Hook } from "./Hook.tsx";
import { Polar, Polar5 } from "./Polar.tsx";
import { Switch } from "./Switch.tsx";
import { NoiseFloor, Range, Sens, SPL } from "./Meters.tsx";
import { Freq, LowCut } from "./Plots.tsx";
import { Capsule, Dual, Signal } from "./Diagrams.tsx";
import { Awards, Dims, Ecosystem, Specs } from "./Cards.tsx";
import { Outro } from "./Brand.tsx";

export const VIZ: Record<string, React.FC<VizProps>> = {
  hook: Hook, polar: Polar, polar5: Polar5, switch: Switch, noisefloor: NoiseFloor, spl: SPL, range: Range, sens: Sens,
  lowcut: LowCut, freq: Freq, signal: Signal, capsule: Capsule, dual: Dual, specs: Specs, dims: Dims, awards: Awards,
  ecosystem: Ecosystem, outro: Outro,
};

/** Viz whose own typography replaces the caption lockup. */
export const OWN_TYPE = new Set(["outro"]);
