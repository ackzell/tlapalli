/**
 * invert-theme.ts
 *
 * Inverts the lightness channel (HLS) of every color in a VS Code theme JSON,
 * producing a light variant — the same operation as Inkscape's "Invert lightness".
 *
 * Usage:
 *   npx tsx invert-theme.ts <input.json>            → writes to stdout
 *   npx tsx invert-theme.ts <input.json> <out.json> → writes to file
 *   cat dark-theme.json | npx tsx invert-theme.ts   → reads stdin, writes stdout
 */

import { readFileSync, writeFileSync } from "fs";

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

  return [hue2rgb(p, q, h + 1 / 3), hue2rgb(p, q, h), hue2rgb(p, q, h - 1 / 3)];
}

// ---------------------------------------------------------------------------
// Color inversion
// ---------------------------------------------------------------------------

function invertLightness(hex: string): string {
  const raw = hex.replace(/^#/, "");

  let rgb: string;
  let alpha: string | null = null;

  if (raw.length === 8) {
    rgb = raw.slice(0, 6);
    alpha = raw.slice(6, 8);
  } else {
    rgb = raw.slice(0, 6); // handles 6-char; anything else passes through
  }

  const r = parseInt(rgb[0] + rgb[1], 16) / 255;
  const g = parseInt(rgb[2] + rgb[3], 16) / 255;
  const b = parseInt(rgb[4] + rgb[5], 16) / 255;

  const [h, l, s] = rgbToHls(r, g, b);
  const [r2, g2, b2] = hlsToRgb(h, 1 - l, s); // ← lightness inverted

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

function invertTheme(dark: VSCodeTheme): VSCodeTheme {
  const light: VSCodeTheme = {
    ...dark,
    name: dark.name ? dark.name.replace(/(\s)(\d+):/, "$1l-$2:") + " Light" : "Light",
    type: "light",
  };

  // Invert UI colors
  if (dark.colors) {
    light.colors = {};
    for (const [key, val] of Object.entries(dark.colors)) {
      light.colors[key] = invertLightness(val);
    }
  }

  // Invert token foregrounds
  if (dark.tokenColors) {
    light.tokenColors = dark.tokenColors.map((token) => {
      const settings: Record<string, string> = {};
      for (const [k, v] of Object.entries(token.settings)) {
        settings[k] = k === "foreground" ? invertLightness(v) : v;
      }
      return { scope: token.scope, settings };
    });
  }

  return light;
}

// ---------------------------------------------------------------------------
// CLI entry
// ---------------------------------------------------------------------------

function readInput(): string {
  const args = process.argv.slice(2);

  if (args.length > 0) {
    return readFileSync(args[0], "utf-8");
  }

  // Fall back to stdin (synchronous read)
  return readFileSync(0, "utf-8");
}

const input = readInput();
const darkTheme: VSCodeTheme = JSON.parse(input);
const lightTheme = invertTheme(darkTheme);
const output = JSON.stringify(lightTheme, null, "\t");

const outPath = process.argv[3] ?? null;
if (outPath) {
  writeFileSync(outPath, output, "utf-8");
  console.error(`Written to ${outPath}`);
} else {
  console.log(output);
}
