/*
 * Hero reveal fragment shader.
 *
 * Texture A (base) fills the card 1:1 — the card's aspect-ratio equals the
 * base image's natural aspect, so it is sampled with plain uv (no cover/crop
 * math). Texture B (reveal) is cover-fitted to the card using its own aspect
 * (uImageAspect.y), with dev alignment controls uRevealScale / uRevealOffset.
 *
 * Blob mask / wobble / hover logic unchanged from the original spec.
 *
 * UV convention: three.js uploads textures with flipY=true, so v=0 is the
 * BOTTOM of the image. PlaneGeometry uv has (0,0) bottom-left. We sample in
 * that native space (no top-left flip), which keeps both textures upright.
 */

export const heroRevealVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const heroRevealFragment = /* glsl */ `
uniform sampler2D uTextureA;
uniform sampler2D uTextureB;
uniform vec2 uResolution;      // drawing buffer size in pixels (the card)
uniform vec2 uImageAspect;     // vec2(aspectBase, aspectReveal) — each image's w/h
uniform vec2 uMouse;          // mouse in UV space (0..1, native space), lerped on CPU
uniform float uMouseVelocity; // smoothed, clamped 0..1; grows the blob
uniform float uTime;          // seconds since start
uniform float uHover;         // 0..1 eased; 1 = pointer in hero, 0 = left (Lissajous: ~0.6)
uniform float uWaveAmp;       // idle wave amplitude (0 when prefers-reduced-motion)
uniform vec2 uRevealScale;   // dev alignment control for Texture B (1,1 = default)
uniform vec2 uRevealOffset;  // dev alignment offset for Texture B in uv units

varying vec2 vUv;

// ---- smooth value noise (2D), output 0..1 ----
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i + vec2(0.0, 0.0));
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float wobble(vec2 p) {
  return vnoise(p) * 2.0 - 1.0;
}

// Cover-fit the reveal image against the card.
// cardAspect = cardW / cardH ; aspect = reveal image's w/h.
// Returns a uv window in [0,1] that fills the card without stretching.
vec2 coverUV(vec2 uv, float aspect, float cardAspect) {
  vec2 size;
  if (cardAspect > aspect) {
    // card is relatively wider: image fills the height, crop the width.
    size = vec2(cardAspect / aspect, 1.0);
  } else {
    // card is relatively taller: image fills the width, crop the height.
    size = vec2(1.0, aspect / cardAspect);
  }
  vec2 offset = (1.0 - size) * 0.5;
  return uv * size + offset;
}

void main() {
  // vUv in native plane space: (0,0) bottom-left, (1,1) top-right.
  vec2 uv = vUv;
  float cardAspect = uResolution.x / uResolution.y;

  // ---- clamp every sampled uv to (0.002, 0.998): edge pixels never smear ----
  vec2 uvA = clamp(uv, 0.002, 0.998);

  // ---- 1. idle wave on the base image, ZERO at the borders ----
  float t = uTime;
  float border = min(min(uvA.x, 1.0 - uvA.x), min(uvA.y, 1.0 - uvA.y));
  float falloff = smoothstep(0.0, 0.08, border);
  vec2 pos = vec2(uvA.x * cardAspect, uvA.y); // aspect-corrected for blob math
  float n1 = wobble(pos * 0.8 + vec2(t * 0.05, -t * 0.04));
  float n2 = wobble(pos * 0.8 + vec2(-t * 0.03, t * 0.05) + 4.7);
  vec2 wave = vec2(n1, n2) * 0.5 * uWaveAmp * falloff;
  vec2 uvAwave = clamp(uvA + wave, 0.002, 0.998);
  vec4 colA = texture2D(uTextureA, uvAwave); // base: plain uv, no cover math

  // ---- 2. blob mask (unchanged: wobble radius + velocity growth + hover) ----
  vec2 mousePos = vec2(uMouse.x * cardAspect, uMouse.y);
  float d = distance(pos, mousePos);
  float rBase = 0.18 * 0.55 + uMouseVelocity * 0.08;
  float r = rBase + wobble(pos * 3.0 + vec2(t * 0.6, -t * 0.3)) * 0.05;
  float edge = 1.0 - smoothstep(r - 0.03, r + 0.03, d);
  float mask = edge * uHover;

  // ---- 3. Texture B: its own cover-fit + alignment uniforms + liquid feel ----
  vec2 uvBcover = coverUV(uv, uImageAspect.y, cardAspect);
  // Dev alignment: scale around the center, then offset in uv units.
  uvBcover = (uvBcover - 0.5) * uRevealScale + 0.5 + uRevealOffset;
  uvBcover = clamp(uvBcover, 0.002, 0.998);

  float liquidStrength = uHover * (1.0 - smoothstep(r, r + 0.08, d));
  float nL = wobble(pos * 5.0 + vec2(t * 0.9, t * 0.5));
  vec2 liquid = vec2(nL * 0.012 * liquidStrength * falloff, nL * 0.008 * liquidStrength * falloff);
  uvBcover = clamp(uvBcover + liquid, 0.002, 0.998);
  vec4 colB = texture2D(uTextureB, uvBcover);

  // ---- 4. final color ----
  gl_FragColor = vec4(mix(colA.rgb, colB.rgb, mask), 1.0);
}
`;
