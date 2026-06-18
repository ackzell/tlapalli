import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { vscodeToZedEntry } from "./vscode-to-zed";

const ROOT_DIR = join(__dirname, "..");
const THEMES_DIR = join(ROOT_DIR, "themes");
const OUTPUT_DIR = join(ROOT_DIR, "zed-themes");

interface VSCodeTheme {
  name: string;
  type: string;
  colors?: Record<string, string>;
  tokenColors?: unknown[];
  [key: string]: unknown;
}

interface PackageJsonTheme {
  label: string;
  uiTheme: string;
  path: string;
}

interface PackageJson {
  description?: string;
  contributes?: {
    themes?: PackageJsonTheme[];
  };
}

function main() {
  // Read order from package.json
  const pkg: PackageJson = JSON.parse(
    readFileSync(join(ROOT_DIR, "package.json"), "utf-8"),
  );
  const themeEntries: PackageJsonTheme[] =
    pkg.contributes?.themes ?? [];

  if (themeEntries.length === 0) {
    console.error("No themes found in package.json contributes.themes");
    process.exit(1);
  }

  // Build cursor palette from the 8 dark themes (first 8 entries).
  // player[1..7] get one cursor each = 7 total for collaborators.
  const cursorPalette: string[] = [];
  for (let i = 0; i < 8 && i < themeEntries.length; i++) {
    const raw = readFileSync(join(ROOT_DIR, themeEntries[i].path), "utf-8");
    const vscode: VSCodeTheme = JSON.parse(raw);
    const cursor = vscode.colors?.["editorCursor.foreground"] ?? "#ffffff";
    const raw2 = cursor.replace(/^#/, "");
    cursorPalette.push(raw2.length === 8 ? cursor : `#${raw2.padEnd(8, "f")}`);
  }

  // Pad palette to 7 entries if needed (shouldn't happen with 8 darks)
  while (cursorPalette.length < 7) {
    cursorPalette.push("#ccccccff");
  }

  const zedThemes: object[] = [];

  for (const entry of themeEntries) {
    const filePath = join(ROOT_DIR, entry.path);
    const raw = readFileSync(filePath, "utf-8");
    const vscode: VSCodeTheme = JSON.parse(raw);

    console.error(`Converting: ${vscode.name}`);

    const zedEntry = vscodeToZedEntry(vscode, cursorPalette) as Record<string, unknown>;
    const style = zedEntry["style"] as Record<string, string>;



    zedThemes.push(zedEntry);
  }

  const output = {
    $schema: "https://zed.dev/schema/themes/v0.2.0.json",
    name: "Tlapalli",
    author: "ackzell",
    description: pkg.description,
    themes: zedThemes,
  };

  const outPath = join(OUTPUT_DIR, "tlapalli.json");
  writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");
  console.error(`\nWritten ${zedThemes.length} themes to ${outPath}`);
}

main();
