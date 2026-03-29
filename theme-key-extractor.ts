/**
 * theme-key-extractor.ts
 *
 * Extracts the values of one or more color keys across all themes.
 *
 * Usage:
 *   npx tsx theme-key-extractor.ts <key1> [key2] [key3] ...
 *
 * Examples:
 *   npx tsx theme-key-extractor.ts scrollbar.shadow
 *   npx tsx theme-key-extractor.ts scrollbar.shadow editor.background statusBar.foreground
 */

import { readdirSync, readFileSync } from "fs";
import { join } from "path";

const keys = process.argv.slice(2);

if (keys.length === 0) {
  console.error("Usage: npx tsx theme-key-extractor.ts <key1> [key2] [key3] ...");
  process.exit(1);
}

const themesDir = join(__dirname, "themes");
const themeFiles = readdirSync(themesDir)
  .filter((f) => f.endsWith(".json"))
  .sort();

type Result = Record<string, Record<string, string | undefined>>;

const result: Result = {};

for (const file of themeFiles) {
  const raw = readFileSync(join(themesDir, file), "utf-8");
  const theme = JSON.parse(raw);
  const themeName: string = theme.name ?? file.replace(".json", "");

  for (const key of keys) {
    if (!result[key]) result[key] = {};
    result[key][themeName] = theme.colors?.[key];
  }
}

console.log(JSON.stringify(result, null, 2));
