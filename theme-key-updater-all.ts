/**
 * theme-key-updater-all.ts
 *
 * Runs theme-key-updater for every theme file in the themes/ directory.
 * The value is resolved independently per theme, so source-key references
 * pick up that theme's own value for the key.
 *
 * Usage:
 *   npx tsx theme-key-updater-all.ts <key> <value-or-source-key>
 *
 * Examples:
 *   # Set list.hoverBackground to a literal value in every theme
 *   npx tsx theme-key-updater-all.ts list.hoverBackground 842d6377
 *
 *   # Set list.hoverBackground to editor.selectionBackground in every theme
 *   npx tsx theme-key-updater-all.ts list.hoverBackground editor.selectionBackground
 */

import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const [, , targetKey, valueArg] = process.argv;

if (!targetKey || !valueArg) {
  console.error("Usage: npx tsx theme-key-updater-all.ts <key> <value-or-source-key>");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface Theme {
  name?: string;
  type?: string;
  colors: Record<string, string>;
  tokenColors?: unknown[];
}

function updateTheme(filePath: string): void {
  let raw: string;
  try {
    raw = readFileSync(filePath, "utf-8");
  } catch {
    console.error(`  Could not read ${filePath}, skipping.`);
    return;
  }

  const theme: Theme = JSON.parse(raw);

  if (!theme.colors || typeof theme.colors !== "object") {
    console.warn(`  No "colors" object found in ${filePath}, skipping.`);
    return;
  }

  let resolvedValue: string;
  if (valueArg in theme.colors) {
    resolvedValue = theme.colors[valueArg];
  } else {
    resolvedValue = valueArg.startsWith("#") ? valueArg : `#${valueArg}`;
  }

  const previousValue = theme.colors[targetKey] ?? "(none)";

  if (!(targetKey in theme.colors)) {
    console.warn(`  Warning: key "${targetKey}" not found — it will be added.`);
  }

  theme.colors[targetKey] = resolvedValue;

  writeFileSync(filePath, JSON.stringify(theme, null, 2) + "\n", "utf-8");
  console.log(`  "${targetKey}": "${previousValue}" → "${resolvedValue}"`);
}

// ---------------------------------------------------------------------------
// Discover and process all theme files
// ---------------------------------------------------------------------------

const themesDir = join(__dirname, "themes");
const themeFiles = readdirSync(themesDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => join(themesDir, f));

console.log(`Updating "${targetKey}" across ${themeFiles.length} theme(s)...\n`);

for (const filePath of themeFiles) {
  console.log(filePath.split("/").at(-1));
  updateTheme(filePath);
}

console.log("\nDone.");
