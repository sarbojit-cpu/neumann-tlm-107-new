import { clamp, easeInOutSine, easeOutCubic, easeOutExpo, lerp } from "../lib/ease.ts";

// ─────────────────────────────────────────────────────────────────────────────
// THE VIRTUAL CAMERA — every still and every clip is "shot" by one of these.
//
// Moves are written the way a gimbal operator thinks: a start pose, an end
// pose, and a velocity curve that never starts or stops dead (sine in/out), so
// even a 1.3 s shot has the weight of a real rig. Focus moves pull a genuine
// defocus (blur) with the focus-breathing scale change real lenses show.
//
// Each move also reports a nominal focal length and focus distance; the HUD
// prints them, so the picture and the viewfinder data always agree.
// ─────────────────────────────────────────────────────────────────────────────

export type Pose = {
  x: number; // % of frame
  y: number; // % of frame
  s: number; // scale
  r: number; // roll, deg
  ry: number; // yaw (orbit), deg — cut-outs only
  rx: number; // tilt, deg
  blur: number; // px (design space)
  mm: number; // focal length readout
  focus: number; // metres readout
};

const P = (p: Partial<Pose>): Pose => ({ x: 0, y: 0, s: 1, r: 0, ry: 0, rx: 0, blur: 0, mm: 50, focus: 1.2, ...p });

const mix = (a: Pose, b: Pose, t: number): Pose => ({
  x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), s: lerp(a.s, b.s, t), r: lerp(a.r, b.r, t),
  ry: lerp(a.ry, b.ry, t), rx: lerp(a.rx, b.rx, t), blur: lerp(a.blur, b.blur, t),
  mm: lerp(a.mm, b.mm, t), focus: lerp(a.focus, b.focus, t),
});

/**
 * @param move  plan move name
 * @param p     0..1 through the shot
 * @param kick  0..1 bass envelope (a hair of scale on the downbeats)
 */
export const camera = (move: string, p: number, kick = 0): Pose => {
  const e = easeInOutSine(p);
  let pose: Pose;
  switch (move) {
    case "gimbalL":
      pose = mix(P({ x: 4.5, s: 1.14, r: 0.9, mm: 35 }), P({ x: -4.5, s: 1.14, r: -0.7, mm: 35 }), e);
      pose.y = Math.sin(p * Math.PI) * -0.8;
      break;
    case "gimbalR":
      pose = mix(P({ x: -4.5, s: 1.14, r: -0.9, mm: 35 }), P({ x: 4.5, s: 1.14, r: 0.7, mm: 35 }), e);
      pose.y = Math.sin(p * Math.PI) * -0.8;
      break;
    case "zoomIn":
      pose = mix(P({ s: 1.02, mm: 35, focus: 2.4 }), P({ s: 1.24, mm: 85, focus: 1.1 }), easeOutCubic(p));
      break;
    case "zoomOut":
      pose = mix(P({ s: 1.26, mm: 85, focus: 1.0 }), P({ s: 1.03, mm: 35, focus: 2.6 }), easeOutCubic(p));
      break;
    case "focusIn": {
      const f = clamp(p / 0.5);
      pose = P({ s: lerp(1.1, 1.04, easeOutCubic(f)) + 0.04 * p, blur: lerp(16, 0, easeOutCubic(f)), mm: 50, focus: lerp(0.4, 1.3, f) });
      break;
    }
    case "focusOut": {
      const f = clamp((p - 0.55) / 0.45);
      pose = P({ s: 1.04 + 0.05 * p + 0.03 * f, blur: lerp(0, 12, easeOutCubic(f)), mm: 50, focus: lerp(1.3, 6, f) });
      break;
    }
    case "craneUp":
      pose = mix(P({ y: 5.5, s: 1.14, rx: 5, mm: 28 }), P({ y: -5, s: 1.16, rx: -3, mm: 28 }), e);
      break;
    case "craneDown":
      pose = mix(P({ y: -5.5, s: 1.14, rx: -5, mm: 28 }), P({ y: 5, s: 1.16, rx: 3, mm: 28 }), e);
      break;
    case "dutch":
      pose = mix(P({ s: 1.2, r: -5, mm: 24 }), P({ s: 1.1, r: 0.5, mm: 24 }), easeOutCubic(p));
      break;
    case "pushTilt":
      pose = mix(P({ s: 1.06, r: 0, mm: 40 }), P({ s: 1.22, r: 1.8, x: -1.5, mm: 70 }), e);
      break;
    case "pushIn":
      pose = mix(P({ s: 1.0, mm: 50 }), P({ s: 1.1, mm: 65 }), e);
      break;
    case "pullOut":
      pose = mix(P({ s: 1.12, mm: 65 }), P({ s: 1.0, mm: 50 }), e);
      break;
    case "floatUp":
      pose = mix(P({ y: 2.4, s: 1.07 }), P({ y: -2.4, s: 1.07 }), e);
      break;
    case "orbitL":
      pose = mix(P({ ry: 22, x: 3, s: 0.98, mm: 50 }), P({ ry: -14, x: -2, s: 1.04, mm: 50 }), e);
      break;
    case "orbitR":
      pose = mix(P({ ry: -22, x: -3, s: 0.98, mm: 50 }), P({ ry: 14, x: 2, s: 1.04, mm: 50 }), e);
      break;
    case "heroRise":
      pose = mix(P({ y: 16, s: 0.9, rx: 8, mm: 35 }), P({ y: 0, s: 1.02, rx: 0, mm: 35 }), easeOutCubic(p * 1.25));
      pose.s += 0.03 * p;
      break;
    case "heroReveal": {
      const q = easeOutExpo(clamp(p / 0.35));
      pose = P({ s: lerp(1.35, 1.0, q) + 0.05 * p, blur: lerp(22, 0, q), mm: lerp(24, 50, q), y: lerp(4, 0, q) });
      break;
    }
    case "drift":
      pose = mix(P({ x: 1.5, s: 1.03 }), P({ x: -1.5, s: 1.06 }), e);
      break;
    default:
      pose = P({});
  }
  pose.s += kick * 0.012;
  return pose;
};

export const poseTransform = (c: Pose, persp = 1800) =>
  `perspective(${persp}px) translate3d(${c.x}%, ${c.y}%, 0) rotateX(${c.rx}deg) rotateY(${c.ry}deg) rotate(${c.r}deg) scale(${c.s})`;
