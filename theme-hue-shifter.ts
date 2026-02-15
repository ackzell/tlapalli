/**
 * theme-hue-shifter.ts
 *
 * Takes a dark theme (e.g., Obsidian) and shifts all colors to a target hue
 * while preserving saturation and lightness.
 *
 * Usage:
 *   npx tsx theme-hue-shifter.ts <input.json> <target-hue> [output.json] [theme-name]
 *
 * target-hue can be:
 *   - A number 0-360 (degrees)
 *   - A color name: "purple", "red", "green", "blue", "magenta", "cyan", "yellow", "gold"
 *   - A hex color: "#ff0000" (will extract hue)
 *
 * Examples:
 *   npx tsx theme-hue-shifter.ts tlapalli-obsidian-theme.json 270 tlapalli-amethyst-theme.json "Tlapalli 05: Amethyst"
 *   npx tsx theme-hue-shifter.ts tlapalli-obsidian-theme.json red tlapalli-fire-opal-theme.json
 *   cat obsidian.json | npx tsx theme-hue-shifter.ts - 120  # green via stdin
 */

import { readFileSync, writeFileSync } from "fs";

// ---------------------------------------------------------------------------
// Color name to hue mapping
// ---------------------------------------------------------------------------

const HUE_MAP: Record<string, number> = {
  purple: 270,
  amethyst: 270,
  red: 0,
  "fire-opal": 10,
  fireapal: 10,
  crimson: 0,
  green: 120,
  jade: 150,
  cyan: 180,
  turquoise: 175,
  blue: 240,
  "lapis-lazuli": 220,
  lapislazuli: 220,
  magenta: 300,
  quartz: 310,
  pink: 330,
  yellow: 60,
  gold: 30,
  orange: 30,
};

// ---------------------------------------------------------------------------
// HLS ↔ RGB (no external deps)
// ---------------------------------------------------------------------------

function rgbToHls(r: number, g: number, b: number): [number, number, number] {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return [0, l, 0]; // achromatic

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h: number;
  switch (max) {
    case r:
      h = (g - b) / d + (g < b ? 6 : 0);
      break;
    case g:
      h = (b - r) / d + 2;
      break;
    default:
      h = (r - g) / d + 4;
      break;
  }
  h /= 6;

  return [h, l, s];
}

function hue2rgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hlsToRgb(h: number, l: number, s: number): [number, number, number] {
  if (s === 0) return [l, l, l]; // achromatic

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return [
    hue2rgb(p, q, h + 1 / 3),
    hue2rgb(p, q, h),
    hue2rgb(p, q, h - 1 / 3),
  ];
}

// ---------------------------------------------------------------------------
// Hue shifting
// ---------------------------------------------------------------------------

function parseTargetHue(input: string): number {
  // Try as named color first
  const lowerInput = input.toLowerCase().trim();
  if (lowerInput in HUE_MAP) {
    return HUE_MAP[lowerInput];
  }

  // Try as hex color
  if (input.startsWith("#")) {
    const hex = input.replace(/^#/, "");
    const r = parseInt(hex[0] + hex[1], 16) / 255;
    const g = parseInt(hex[2] + hex[3], 16) / 255;
    const b = parseInt(hex[4] + hex[5], 16) / 255;
    const [h] = rgbToHls(r, g, b);
    return h * 360;
  }

  // Try as number (0-360)
  const num = parseFloat(input);
  if (!isNaN(num)) {
    return ((num % 360) + 360) % 360; // normalize to 0-360
  }

  throw new Error(
    `Invalid target hue: "${input}". Use a number (0-360), hex color, or color name.`
  );
}

function shiftHue(hex: string, targetHue: number): string {
  const raw = hex.replace(/^#/, "");

  let rgb: string;
  let alpha: string | null = null;

  if (raw.length === 8) {
    rgb = raw.slice(0, 6);
    alpha = raw.slice(6, 8);
  } else {
    rgb = raw.slice(0, 6);
  }

  const r = parseInt(rgb[0] + rgb[1], 16) / 255;
  const g = parseInt(rgb[2] + rgb[3], 16) / 255;
  const b = parseInt(rgb[4] + rgb[5], 16) / 255;

  let [, l, s] = rgbToHls(r, g, b);
  
  // If color is achromatic (grayscale), add saturation so hue shift works
  // Keep saturation moderate to preserve contrast relationships
  if (s === 0 || s < 0.1) {
    if (l < 0.15) s = 0.25;      // very dark → subtle saturation
    else if (l < 0.3) s = 0.35;  // dark → moderate saturation
    else if (l < 0.45) s = 0.4;
    else if (l < 0.6) s = 0.35;
    else if (l < 0.75) s = 0.28;
    else s = 0.18;               // light → subtle saturation
  } else {
    // For colors with minimal saturation, boost them moderately
    s = Math.max(s, 0.25);
  }
  
  const newHue = targetHue / 360; // normalize to 0-1
  const [r2, g2, b2] = hlsToRgb(newHue, l, s);

  const toHex = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v * 255)))
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r2)}${toHex(g2)}${toHex(b2)}${alpha ?? ""}`;
}

// ---------------------------------------------------------------------------
// Theme transformation
// ---------------------------------------------------------------------------

interface TokenColor {
  scope: string;
  settings: Record<string, string>;
}

interface VSCodeTheme {
  name?: string;
  type?: string;
  colors?: Record<string, string>;
  tokenColors?: TokenColor[];
  [key: string]: unknown;
}

function shiftThemeHue(
  theme: VSCodeTheme,
  targetHue: number,
  newName?: string
): VSCodeTheme {
  const shifted: VSCodeTheme = JSON.parse(JSON.stringify(theme)); // deep clone

  if (newName) {
    shifted.name = newName;
  }

  // Shift UI colors
  if (shifted.colors) {
    for (const key in shifted.colors) {
      shifted.colors[key] = shiftHue(shifted.colors[key], targetHue);
    }
  }

  // Shift token foregrounds
  if (shifted.tokenColors) {
    for (const token of shifted.tokenColors) {
      if (token.settings && token.settings.foreground) {
        token.settings.foreground = shiftHue(token.settings.foreground, targetHue);
      }
    }
  }

  return shifted;
}

// ---------------------------------------------------------------------------
// CLI entry
// ---------------------------------------------------------------------------

function readInput(path: string): string {
  if (path === "-") {
    return readFileSync(0, "utf-8");
  }
  return readFileSync(path, "utf-8");
}

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error(`
Usage:
  npx tsx theme-hue-shifter.ts <input.json> <target-hue> [output.json] [theme-name]

Examples:
  npx tsx theme-hue-shifter.ts obsidian.json purple amethyst.json "Tlapalli 05: Amethyst"
  npx tsx theme-hue-shifter.ts obsidian.json 270 > output.json
  cat obsidian.json | npx tsx theme-hue-shifter.ts - red
`);
  process.exit(1);
}

const inputPath = args[0];
const targetHueInput = args[1];
const outputPath = args[2] ?? null;
const themeName = args[3] ?? null;

try {
  const input = readInput(inputPath);
  const theme: VSCodeTheme = JSON.parse(input);
  const targetHue = parseTargetHue(targetHueInput);
  const shifted = shiftThemeHue(theme, targetHue, themeName);
  const output = JSON.stringify(shifted, null, "\t");

  if (outputPath) {
    writeFileSync(outputPath, output, "utf-8");
    console.error(`✓ Written to ${outputPath}`);
  } else {
    console.log(output);
  }
} catch (err) {
  console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}
