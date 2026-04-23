/**
 * theme-key-updater.ts
 *
 * Updates a single color key in a theme's "colors" object with either
 * a literal hex value or the value of another key in the same theme.
 *
 * Usage:
 *   npx tsx theme-key-updater.ts <theme.json> <key> <value-or-source-key> [output.json]
 *
 * Examples:
 *   # Set list.hoverBackground to a literal value
 *   npx tsx theme-key-updater.ts themes/tlapalli-quartz-theme.json list.hoverBackground 842d6377
 *
 *   # Set list.hoverBackground to the value of editor.selectionBackground
 *   npx tsx theme-key-updater.ts themes/tlapalli-quartz-theme.json list.hoverBackground editor.selectionBackground
 *
 *   # Write result to a different file
 *   npx tsx theme-key-updater.ts themes/tlapalli-quartz-theme.json list.hoverBackground 842d6377 themes/tlapalli-quartz-theme-updated.json
 */

import { readFileSync, writeFileSync } from "fs";

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const [, , inputArg, targetKey, valueArg, outputArg] = process.argv;

if (!inputArg || !targetKey || !valueArg) {
  console.error(
    "Usage: npx tsx theme-key-updater.ts <theme.json> <key> <value-or-source-key> [output.json]",
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Load theme
// ---------------------------------------------------------------------------

let raw: string;
try {
  raw = readFileSync(inputArg, "utf-8");
} catch {
  console.error(`Could not read file: ${inputArg}`);
  process.exit(1);
}

interface Theme {
  name?: string;
  type?: string;
  colors: Record<string, string>;
  tokenColors?: unknown[];
}

const theme: Theme = JSON.parse(raw);

if (!theme.colors || typeof theme.colors !== "object") {
  console.error("Theme file does not contain a top-level 'colors' object.");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Resolve the new value
// ---------------------------------------------------------------------------

let resolvedValue: string;

if (valueArg in theme.colors) {
  // valueArg is a key that exists in the theme — use its value
  resolvedValue = theme.colors[valueArg];
  console.log(`Resolved source key "${valueArg}" → "${resolvedValue}"`);
} else {
  // Treat as a literal hex value; normalise by stripping a leading '#' if present
  resolvedValue = valueArg.startsWith("#") ? valueArg : `#${valueArg}`;
  console.log(`Using literal value "${resolvedValue}"`);
}

// ---------------------------------------------------------------------------
// Apply update
// ---------------------------------------------------------------------------

if (!(targetKey in theme.colors)) {
  console.warn(`Warning: key "${targetKey}" does not exist in the theme. It will be added.`);
}

const previousValue = theme.colors[targetKey] ?? "(none)";
theme.colors[targetKey] = resolvedValue;

console.log(`"${targetKey}": "${previousValue}" → "${resolvedValue}"`);

// ---------------------------------------------------------------------------
// Write output
// ---------------------------------------------------------------------------

const outputPath = outputArg ?? inputArg;
writeFileSync(outputPath, JSON.stringify(theme, null, 2) + "\n", "utf-8");
console.log(`Saved to ${outputPath}`);
