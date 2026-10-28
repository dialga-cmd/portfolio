/* Chibi configuration: layer names, sizes, and pivot points.
 * Keep all values here so real art can replace files in /public/chibi/ later
 * without changing component code.
 */
export const CHIBI_LAYERS = [
  "body",
  "head",
  "hair",
  "sunglasses",
  "eyes-open",
  "eyes-closed",
  "mouth-smile",
  "mouth-open",
  "arm-left",
  "arm-right",
  "headset",
  "scarf",
] as const;

export type ChibiLayer = (typeof CHIBI_LAYERS)[number];

export interface ChibiLayerConfig {
  src: string; // path under /public
  zIndex: number; // stacking order
  /** Pivot in normalized coords relative to the character container (0,0) top-left */
  pivotX: number;
  pivotY: number;
  /** Size as % of the character container */
  widthPercent: number;
  heightPercent: number;
  /** Base offset as % of container */
  offsetX: number;
  offsetY: number;
  visibleByDefault: boolean;
}

export const CHIBI_CONFIG: Record<ChibiLayer, ChibiLayerConfig> = {
  body: {
    src: "/chibi/body.png",
    zIndex: 0,
    pivotX: 0.5,
    pivotY: 0.95,
    widthPercent: 38,
    heightPercent: 42,
    offsetX: 0,
    offsetY: 26,
    visibleByDefault: true,
  },
  head: {
    src: "/chibi/head.png",
    zIndex: 5,
    pivotX: 0.5,
    pivotY: 0.9,
    widthPercent: 46,
    heightPercent: 48,
    offsetX: 0,
    offsetY: -18,
    visibleByDefault: true,
  },
  hair: {
    src: "/chibi/hair.png",
    zIndex: 10,
    pivotX: 0.5,
    pivotY: 0.8,
    widthPercent: 52,
    heightPercent: 52,
    offsetX: 0,
    offsetY: -28,
    visibleByDefault: true,
  },
  sunglasses: {
    src: "/chibi/sunglasses.png",
    zIndex: 15,
    pivotX: 0.5,
    pivotY: 0.5,
    widthPercent: 26,
    heightPercent: 14,
    offsetX: 0,
    offsetY: -8,
    visibleByDefault: true,
  },
  "eyes-open": {
    src: "/chibi/eyes-open.png",
    zIndex: 12,
    pivotX: 0.5,
    pivotY: 0.5,
    widthPercent: 18,
    heightPercent: 10,
    offsetX: 0,
    offsetY: -6,
    visibleByDefault: true,
  },
  "eyes-closed": {
    src: "/chibi/eyes-closed.png",
    zIndex: 12,
    pivotX: 0.5,
    pivotY: 0.5,
    widthPercent: 18,
    heightPercent: 10,
    offsetX: 0,
    offsetY: -6,
    visibleByDefault: false,
  },
  "mouth-smile": {
    src: "/chibi/mouth-smile.png",
    zIndex: 13,
    pivotX: 0.5,
    pivotY: 0.5,
    widthPercent: 10,
    heightPercent: 8,
    offsetX: 0,
    offsetY: 2,
    visibleByDefault: true,
  },
  "mouth-open": {
    src: "/chibi/mouth-open.png",
    zIndex: 13,
    pivotX: 0.5,
    pivotY: 0.5,
    widthPercent: 10,
    heightPercent: 10,
    offsetX: 0,
    offsetY: 2,
    visibleByDefault: false,
  },
  "arm-left": {
    src: "/chibi/arm-left.png",
    zIndex: 3,
    pivotX: 0.85,
    pivotY: 0.2,
    widthPercent: 16,
    heightPercent: 26,
    offsetX: -12,
    offsetY: 16,
    visibleByDefault: true,
  },
  "arm-right": {
    src: "/chibi/arm-right.png",
    zIndex: 8,
    pivotX: 0.15,
    pivotY: 0.2,
    widthPercent: 16,
    heightPercent: 26,
    offsetX: 12,
    offsetY: 16,
    visibleByDefault: true,
  },
  headset: {
    src: "/chibi/headset.png",
    zIndex: 16,
    pivotX: 0.5,
    pivotY: 0.6,
    widthPercent: 38,
    heightPercent: 32,
    offsetX: 0,
    offsetY: -12,
    visibleByDefault: true,
  },
  scarf: {
    src: "/chibi/scarf.png",
    zIndex: 7,
    pivotX: 0.5,
    pivotY: 0.1,
    widthPercent: 44,
    heightPercent: 24,
    offsetX: 0,
    offsetY: 10,
    visibleByDefault: true,
  },
};
