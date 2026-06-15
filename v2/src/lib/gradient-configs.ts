// gradient-configs.ts
// Use "preset: 'custom' as const" — this satisfies animated-gradient's CustomConfig interface.
// Do not import types from animated-gradient.tsx (it doesn't export them).

export const heroGradientConfig = {
  preset: "custom" as const,
  color1: "#0a0a0a",  // true black
  color2: "#061b2e",  // quiet deep blue
  color3: "#111113",  // near-black
  speed: 7,
  swirl: 18,
  swirlIterations: 8,
  softness: 100,
  distortion: 2,
  scale: 0.55,
  proportion: 30,
  rotation: 0,
  offset: 0,
  shape: "Checks" as const,
  shapeSize: 10,
};

export const heroNoiseConfig = {
  opacity: 0.18,
  scale: 1.2,
};
