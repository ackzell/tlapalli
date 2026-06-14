import { findZedToken } from "./zed-token-map";

// ---------------------------------------------------------------------------
// VS Code color key → Zed theme style property
// ---------------------------------------------------------------------------
// Maps the most common VS Code keys to the nearest Zed equivalent.
// Keys not listed are dropped silently.

const VSCODE_TO_ZED: Record<string, string> = {
  // Borders
  "focusBorder": "border.focused",
  "sideBar.border": "border",
  "panel.border": "border",
  "panelSection.border": "border",
  "editorGroup.border": "border",
  "editorGroupHeader.tabsBorder": "border",
  "tab.border": "border.variant",

  // Surfaces / backgrounds
  "editor.background": "editor.background",
  "sideBar.background": "panel.background",
  "panel.background": "panel.background",
  "activityBar.background": "background",
  "statusBar.background": "status_bar.background",
  "titleBar.activeBackground": "title_bar.background",
  "titleBar.inactiveBackground": "title_bar.inactive_background",
  "editorGroupHeader.tabsBackground": "toolbar.background",
  "tab.activeBackground": "tab.active_background",
  "tab.inactiveBackground": "tab.inactive_background",
  "editorWidget.background": "elevated_surface.background",
  "editorSuggestWidget.background": "elevated_surface.background",
  "notifications.background": "elevated_surface.background",
  "notification.background": "elevated_surface.background",
  "menu.background": "surface.background",
  "settings.dropdownBackground": "surface.background",
  "settings.textInputBackground": "surface.background",
  "input.background": "element.background",
  "dropdown.background": "element.background",
  "badge.background": "element.background",
  "button.background": "element.background",

  // Element hover / active / selected
  "button.hoverBackground": "element.hover",
  "list.hoverBackground": "element.hover",
  "menu.selectionBackground": "element.hover",

  // Text — only map VS Code's global `foreground` to Zed's `text`.
  // Component-specific foregrounds (sideBar, statusBar, etc.) do NOT set `text`.
  "foreground": "text",
  "editor.foreground": "editor.foreground",
  "descriptionForeground": "text.muted",
  "input.placeholderForeground": "text.placeholder",
  "disabledForeground": "text.disabled",
  "textLink.foreground": "text.accent",
  "textLink.activeForeground": "text.accent",
  "textPreformat.foreground": "text.literal",

  // Icons
  "icon.foreground": "icon",

  // Editor gutter
  "editorGutter.background": "editor.gutter.background",
  "editorLineNumber.foreground": "editor.line_number",
  "editorLineNumber.activeForeground": "editor.active_line_number",

  // Editor highlights
  "editor.lineHighlightBackground": "editor.active_line.background",
  "editor.selectionBackground": "editor.document_highlight.read_background",
  "editor.wordHighlightBackground": "editor.document_highlight.read_background",
  "editor.wordHighlightStrongBackground": "editor.document_highlight.write_background",
  "editor.findMatchBackground": "search.active_match_background",
  "editor.findMatchHighlightBackground": "search.match_background",
  "editor.findMatchBorder": "border.selected",
  "editorIndentGuide.background1": "editor.wrap_guide",
  "editorIndentGuide.activeBackground1": "editor.active_wrap_guide",
  "editorWhitespace.foreground": "editor.invisible",

  // Scrollbar
  "scrollbarSlider.background": "scrollbar.thumb.background",
  "scrollbarSlider.hoverBackground": "scrollbar.thumb.hover_background",
  "scrollbarSlider.activeBackground": "scrollbar.thumb.hover_background",

  // Terminal
  "terminal.background": "terminal.background",
  "terminal.foreground": "terminal.foreground",
  "terminal.ansiBlack": "terminal.ansi.black",
  "terminal.ansiRed": "terminal.ansi.red",
  "terminal.ansiGreen": "terminal.ansi.green",
  "terminal.ansiYellow": "terminal.ansi.yellow",
  "terminal.ansiBlue": "terminal.ansi.blue",
  "terminal.ansiMagenta": "terminal.ansi.magenta",
  "terminal.ansiCyan": "terminal.ansi.cyan",
  "terminal.ansiWhite": "terminal.ansi.white",
  "terminal.ansiBrightBlack": "terminal.ansi.bright_black",
  "terminal.ansiBrightRed": "terminal.ansi.bright_red",
  "terminal.ansiBrightGreen": "terminal.ansi.bright_green",
  "terminal.ansiBrightYellow": "terminal.ansi.bright_yellow",
  "terminal.ansiBrightBlue": "terminal.ansi.bright_blue",
  "terminal.ansiBrightMagenta": "terminal.ansi.bright_magenta",
  "terminal.ansiBrightCyan": "terminal.ansi.bright_cyan",
  "terminal.ansiBrightWhite": "terminal.ansi.bright_white",

  // Git decorations
  "gitDecoration.addedResourceForeground": "version_control.added",
  "gitDecoration.modifiedResourceForeground": "version_control.modified",
  "gitDecoration.deletedResourceForeground": "version_control.deleted",
  "gitDecoration.untrackedResourceForeground": "version_control.added",
  "gitDecoration.ignoredResourceForeground": "version_control.word_deleted",
  "gitDecoration.conflictingResourceForeground": "conflict",

  // Diagnostic / status colors
  "editorError.foreground": "error",
  "editorWarning.foreground": "warning",
  "editorInfo.foreground": "info",
};

const ALL_ZED_KEYS = [
  "border",
  "border.variant",
  "border.focused",
  "border.selected",
  "border.transparent",
  "border.disabled",
  "elevated_surface.background",
  "surface.background",
  "background",
  "element.background",
  "element.hover",
  "element.active",
  "element.selected",
  "element.disabled",
  "drop_target.background",
  "ghost_element.background",
  "ghost_element.hover",
  "ghost_element.active",
  "ghost_element.selected",
  "ghost_element.disabled",
  "text",
  "text.muted",
  "text.placeholder",
  "text.disabled",
  "text.accent",
  "icon",
  "icon.muted",
  "icon.disabled",
  "icon.placeholder",
  "icon.accent",
  "status_bar.background",
  "title_bar.background",
  "title_bar.inactive_background",
  "toolbar.background",
  "tab_bar.background",
  "tab.inactive_background",
  "tab.active_background",
  "search.match_background",
  "search.active_match_background",
  "panel.background",
  "scrollbar.thumb.background",
  "scrollbar.thumb.hover_background",
  "scrollbar.thumb.border",
  "scrollbar.track.background",
  "scrollbar.track.border",
  "editor.foreground",
  "editor.background",
  "editor.gutter.background",
  "editor.subheader.background",
  "editor.active_line.background",
  "editor.highlighted_line.background",
  "editor.line_number",
  "editor.active_line_number",
  "editor.hover_line_number",
  "editor.invisible",
  "editor.wrap_guide",
  "editor.active_wrap_guide",
  "editor.document_highlight.read_background",
  "editor.document_highlight.write_background",
  "terminal.background",
  "terminal.foreground",
  "terminal.bright_foreground",
  "terminal.dim_foreground",
  "terminal.ansi.black",
  "terminal.ansi.bright_black",
  "terminal.ansi.dim_black",
  "terminal.ansi.red",
  "terminal.ansi.bright_red",
  "terminal.ansi.dim_red",
  "terminal.ansi.green",
  "terminal.ansi.bright_green",
  "terminal.ansi.dim_green",
  "terminal.ansi.yellow",
  "terminal.ansi.bright_yellow",
  "terminal.ansi.dim_yellow",
  "terminal.ansi.blue",
  "terminal.ansi.bright_blue",
  "terminal.ansi.dim_blue",
  "terminal.ansi.magenta",
  "terminal.ansi.bright_magenta",
  "terminal.ansi.dim_magenta",
  "terminal.ansi.cyan",
  "terminal.ansi.bright_cyan",
  "terminal.ansi.dim_cyan",
  "terminal.ansi.white",
  "terminal.ansi.bright_white",
  "terminal.ansi.dim_white",
  "link_text.hover",
  "version_control.added",
  "version_control.modified",
  "version_control.word_added",
  "version_control.word_deleted",
  "version_control.deleted",
  "conflict",
  "conflict.background",
  "conflict.border",
  "created",
  "created.background",
  "created.border",
  "deleted",
  "deleted.background",
  "deleted.border",
  "error",
  "error.background",
  "error.border",
  "hidden",
  "hidden.background",
  "hidden.border",
  "hint",
  "hint.background",
  "hint.border",
  "ignored",
  "ignored.background",
  "ignored.border",
  "info",
  "info.background",
  "info.border",
  "modified",
  "modified.background",
  "modified.border",
  "predictive",
  "predictive.background",
  "predictive.border",
  "renamed",
  "renamed.background",
  "renamed.border",
  "success",
  "success.background",
  "success.border",
  "unreachable",
  "unreachable.background",
  "unreachable.border",
  "warning",
  "warning.background",
  "warning.border",

  "drop_target.border",
  "element.selection_background",
  "panel.focused_border",
  "panel.indent_guide",
  "panel.indent_guide_hover",
  "panel.indent_guide_active",
  "pane.focused_border",
  "pane.group_border",
  "panel.overlay_background",
  "panel.overlay_hover",
  "scrollbar.thumb.active_background",
  "editor.indent_guide",
  "editor.indent_guide_active",
  "editor.document_highlight.bracket_background",
  "debugger.accent",
];

const ZED_SYNTAX_KEYS = [
  "attribute", "boolean", "comment", "comment.doc", "constant", "constructor",
  "embedded", "emphasis", "emphasis.strong", "enum", "function", "hint",
  "keyword", "label", "link_text", "link_uri", "namespace", "number",
  "operator", "predictive", "preproc", "primary", "property", "punctuation",
  "punctuation.bracket", "punctuation.delimiter", "punctuation.list_marker",
  "punctuation.markup", "punctuation.special", "selector", "selector.pseudo",
  "string", "string.escape", "string.regex", "string.special",
  "string.special.symbol", "tag", "text.literal", "title", "type",
  "variable", "variable.special", "variant", "diff.plus", "diff.minus",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function to8DigitHex(hex: string): string {
  const raw = hex.replace(/^#/, "");
  if (raw.length === 8) return `#${raw}`;
  if (raw.length === 6) return `#${raw}ff`;
  return `#${raw.padEnd(8, "f")}`;
}

function parseHex(hex: string): [number, number, number] {
  const raw = hex.replace(/^#/, "").slice(0, 6);
  return [
    parseInt(raw.slice(0, 2), 16),
    parseInt(raw.slice(2, 4), 16),
    parseInt(raw.slice(4, 6), 16),
  ];
}

function toHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${clamp(r).toString(16).padStart(2, "0")}${clamp(g).toString(16).padStart(2, "0")}${clamp(b).toString(16).padStart(2, "0")}`;
}

// Mix two hex colors by a ratio (0 = all color1, 1 = all color2)
function mixColors(hex1: string, hex2: string, ratio: number): string {
  const [r1, g1, b1] = parseHex(hex1);
  const [r2, g2, b2] = parseHex(hex2);
  return toHex(
    r1 + (r2 - r1) * ratio,
    g1 + (g2 - g1) * ratio,
    b1 + (b2 - b1) * ratio,
  );
}

function parseFontStyle(fontStyle: string | undefined): string | null {
  if (!fontStyle || fontStyle === "") return null;
  if (fontStyle === "italic" || fontStyle === "bold")
    return fontStyle;
  return null;
}

function parseFontWeight(fontStyle: string | undefined): number | null {
  if (!fontStyle) return null;
  if (fontStyle === "bold") return 700;
  return null;
}

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

interface VSCodeTokenColor {
  name?: string;
  scope?: string | string[];
  settings: {
    foreground?: string;
    fontStyle?: string;
  };
}

interface VSCodeTheme {
  name: string;
  type: string;
  colors?: Record<string, string>;
  tokenColors?: VSCodeTokenColor[];
}

interface ZedSyntaxEntry {
  color: string;
  font_style: string | null;
  font_weight: number | null;
}

// ---------------------------------------------------------------------------
// Conversion
// ---------------------------------------------------------------------------

export function vscodeToZedEntry(
  vscode: VSCodeTheme,
  cursorPalette: string[] = [],
): object {
  const appearance = vscode.type === "light" ? "light" : "dark";
  const isDark = appearance === "dark";

  // --- UI colors ---
  const style: Record<string, string | null | object> = {
    "border.transparent": "#00000000",
  };

  const vscodeColors = vscode.colors ?? {};

  // Apply mapped VS Code → Zed
  for (const [vscKey, zedKey] of Object.entries(VSCODE_TO_ZED)) {
    const val = vscodeColors[vscKey];
    if (val) {
      style[zedKey] = to8DigitHex(val);
    }
  }

  // version_control.* comes from gitDecoration.* in VSCODE_TO_ZED above.
  // created/deleted/modified/error/warning/info/hint/etc. are filled by the
  // fallback loop below if the VS Code theme doesn't provide them.

  // If `text` wasn't set by `foreground`, fall back to `editor.foreground`
  if (!style["text"]) {
    const ef = vscodeColors["editor.foreground"];
    if (ef) style["text"] = to8DigitHex(ef);
  }

  // Fill remaining Zed keys with best-guess fallbacks from VS Code values
  const fallbackBg =
    to8DigitHex(vscodeColors["editor.background"] ?? "#000000");
  const fallbackFg = style["text"] ?? fallbackBg;
  const fallbackFgMuted = style["text.muted"] ?? fallbackFg;
  const fallbackBorder =
    vscodeColors["sideBar.border"] ?? vscodeColors["panel.border"] ?? fallbackBg;

  for (const key of ALL_ZED_KEYS) {
    if (key in style) continue;

    if (
      key.endsWith(".background") ||
      key.endsWith("_background")
    ) {
      style[key] = to8DigitHex(fallbackBorder);
    } else if (
      key === "border" ||
      key === "border.variant" ||
      key === "border.transparent" ||
      key.endsWith("_border") ||
      (key.endsWith(".border") && !key.startsWith("terminal."))
    ) {
      style[key] = to8DigitHex(fallbackBorder);
    } else if (key.startsWith("scrollbar.")) {
      style[key] = fallbackFgMuted;
    } else if (key.startsWith("terminal.ansi.")) {
      style[key] = fallbackFgMuted;
    } else if (
      key.startsWith("version_control.") ||
      key === "conflict" ||
      key === "created" ||
      key === "deleted" ||
      key === "error" ||
      key === "warning" ||
      key === "info" ||
      key === "hint" ||
      key === "modified" ||
      key === "renamed" ||
      key === "success" ||
      key === "unreachable" ||
      key.startsWith("predictive")
    ) {
      style[key] = fallbackFg;
    } else {
      style[key] = fallbackFgMuted;
    }
  }

  // --- Element variant post-processing ---
  // element.hover is already set from VSCODE_TO_ZED mapping.
  // Derive element.active, .selected, .disabled to be surface colors
  // (fallback loop gives them text colors, which is wrong for surface keys).
  const elBg = style["element.background"] as string | undefined;
  let elHover = style["element.hover"] as string | undefined;
  // Reduce alpha of hover/active/selected for a subtler interaction feel
  if (elHover && elHover.length === 9) {
    const alpha = parseInt(elHover.slice(7, 9), 16);
    const newAlpha = Math.round(alpha * 0.67);
    elHover = elHover.slice(0, 7) + newAlpha.toString(16).padStart(2, "0");
    style["element.hover"] = elHover;
  }
  style["element.active"] = elHover ?? elBg ?? fallbackBg;
  style["element.selected"] = elHover ?? elBg ?? fallbackBg;
  style["element.disabled"] = elBg ?? fallbackBg;

  // Re-derive ghost_element values from finalized element values
  // (fallback loop derived them before element.* was finalized)
  for (const gKey of ALL_ZED_KEYS) {
    if (!gKey.startsWith("ghost_element.")) continue;
    if (gKey === "ghost_element.background") {
      style[gKey] = "#00000000";
    } else {
      const suffix = gKey.slice("ghost_element.".length);
      const eKey = `element.${suffix}`;
      const eVal = style[eKey];
      style[gKey] = (eVal && typeof eVal === "string") ? eVal : "#00000000";
    }
  }

  // --- Active line / highlighted line ---
  // Ensure both are visible. For very dark/light themes the VS Code highlight
  // can be too subtle, so we derive a visible highlight from the editor bg:
  // dark → lighten by mixing with white, light → darken by mixing with black.
  const edBgHex = (style["editor.background"] as string ?? "#000000ff").slice(0, 7);
  const mixRatio = 0.12; // 12% white/black blend for a subtle but visible highlight
  const highlightBase = mixColors(edBgHex, isDark ? "#ffffff" : "#000000", mixRatio);
  style["editor.active_line.background"] = highlightBase + "bf";  // 75% opacity
  style["editor.highlighted_line.background"] = highlightBase + "ff";

  // --- Focus border ---
  // Zed uses border.focused for active tab bottom border (PR #52120) and
  // file explorer selection focus ring. VS Code's focusBorder is often set
  // to the background color (invisible). Override to a visible highlight.
  const focusBorder = style["border.focused"] as string | undefined;
  if (focusBorder) {
    const fgClr = isDark ? "#ffffff" : "#000000";
    const blended = mixColors(focusBorder.slice(0, 7), fgClr, 0.25);
    style["border.focused"] = blended + "ff";
  }

  // --- Tab backgrounds (One Dark pattern) ---
  // inactive tabs = tab_bar.background (blend into tab bar)
  // active tab   = editor.background (connect to editor area)
  const tabBarBg = style["tab_bar.background"] as string | undefined;
  const edBg = style["editor.background"] as string | undefined;
  if (tabBarBg) {
    style["tab.inactive_background"] = tabBarBg;
  }
  if (edBg) {
    style["tab.active_background"] = edBg;
  }

  // --- Panel / pane focused borders ---
  // Reuse the visible border.focused color so these don't default to blue
  const visFocus = style["border.focused"] as string | undefined ?? fallbackBg;
  style["panel.focused_border"] = visFocus;
  style["pane.focused_border"] = visFocus;
  style["drop_target.border"] = visFocus;

  // --- Element selection background ---
  // Used for selection backgrounds in UI elements (file explorer, etc.)
  style["element.selection_background"] =
    style["element.selected"] ?? style["element.hover"] ?? fallbackBg;

  // --- Indent guides ---
  // Subtle guide lines for panels and editors
  const guideColor = mixColors(
    (style["panel.background"] as string ?? fallbackBg).slice(0, 7),
    isDark ? "#ffffff" : "#000000",
    0.08,
  ) + "ff";
  style["panel.indent_guide"] = guideColor;
  style["panel.indent_guide_hover"] =
    mixColors(
      (style["panel.background"] as string ?? fallbackBg).slice(0, 7),
      isDark ? "#ffffff" : "#000000",
      0.15,
    ) + "ff";
  style["panel.indent_guide_active"] = style["panel.indent_guide_hover"];
  style["editor.indent_guide"] = guideColor;
  style["editor.indent_guide_active"] = style["panel.indent_guide_hover"];

  // --- Panel overlays ---
  {
    const edBg = style["editor.background"] as string ?? fallbackBg;
    style["panel.overlay_background"] = edBg;
  }
  style["panel.overlay_hover"] =
    style["element.hover"] ?? style["panel.overlay_background"] ?? fallbackBg;

  // --- Scrollbar active thumb ---
  style["scrollbar.thumb.active_background"] =
    style["scrollbar.thumb.hover_background"] ??
    style["scrollbar.thumb.background"] ??
    fallbackFgMuted;

  // --- Document highlight bracket background ---
  style["editor.document_highlight.bracket_background"] =
    style["editor.document_highlight.read_background"] ??
    style["editor.background"] ?? fallbackBg;

  // --- Debugger accent ---
  style["debugger.accent"] = style["text.accent"] ?? style["text"] ?? fallbackFg;

  // --- Syntax tokens ---
  const syntax: Record<string, ZedSyntaxEntry> = {};
  const seenTokens = new Set<string>();

  // Collect Zed syntax defaults from the One theme reference
  const defaultFg = to8DigitHex(vscodeColors["editor.foreground"] ?? "#cccccc");

  for (const key of ZED_SYNTAX_KEYS) {
    syntax[key] = { color: defaultFg, font_style: null, font_weight: null };
  }

  // Parse VS Code tokenColors
  const tokens = vscode.tokenColors ?? [];
  for (const entry of tokens) {
    const fg = entry.settings?.foreground;
    if (!fg) continue;

    const scopes = normalizeScopes(entry.scope);
    for (const scope of scopes) {
      const zedKey = findZedToken(scope);
      if (!zedKey || !ZED_SYNTAX_KEYS.includes(zedKey)) continue;

      // Only set if not already set by a more specific rule
      if (!seenTokens.has(zedKey)) {
        syntax[zedKey] = {
          color: to8DigitHex(fg),
          font_style: parseFontStyle(entry.settings?.fontStyle),
          font_weight: parseFontWeight(entry.settings?.fontStyle),
        };
        seenTokens.add(zedKey);
      }
    }
  }

  style["syntax"] = syntax;

  // --- Players ---
  // Player 0 = local user's cursor: use the theme's edtiorCursor.foreground
  const localCursor =
    to8DigitHex(vscodeColors["editorCursor.foreground"] ?? "#ffffff");
  const localSelection = vscodeColors["editor.selectionBackground"]
    ? to8DigitHex(vscodeColors["editor.selectionBackground"])
    : localCursor.slice(0, 7) + "3d";

  const players: Record<string, string>[] = [
    { cursor: localCursor, background: localCursor, selection: localSelection },
  ];

  // Players 1-7 = collaborators: use supplied cursor palette (other variant cursors)
  for (let i = 0; i < 7; i++) {
    const c = cursorPalette[i] ?? "#ccccccff";
    players.push({
      cursor: c,
      background: c,
      selection: c.slice(0, 7) + "3d",
    });
  }

  style["players"] = players;

  return {
    name: vscode.name,
    appearance,
    style,
  };
}

function normalizeScopes(scope: string | string[] | undefined): string[] {
  if (!scope) return [];
  if (Array.isArray(scope)) return scope;
  return scope.split(",").map((s) => s.trim());
}
