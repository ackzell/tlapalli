export const SCOPE_TO_ZED: Record<string, string> = {
  // Comments
  "comment": "comment",
  "comment.block": "comment",
  "comment.line": "comment",
  "comment.block.documentation": "comment.doc",
  "comment.line.documentation": "comment.doc",
  "punctuation.definition.comment": "comment",

  // Keywords
  "keyword": "keyword",
  "keyword.control": "keyword",
  "keyword.control.import": "keyword",
  "keyword.control.export": "keyword",
  "keyword.control.conditional": "keyword",
  "keyword.control.loop": "keyword",
  "keyword.control.flow": "keyword",
  "keyword.other.import": "keyword",
  "keyword.other.special-method": "keyword",
  "storage": "keyword",
  "storage.type": "keyword",
  "storage.modifier": "keyword",

  // Operators
  "keyword.operator": "operator",
  "keyword.operator.arithmetic": "operator",
  "keyword.operator.assignment": "operator",
  "keyword.operator.comparison": "operator",
  "keyword.operator.logical": "operator",
  "keyword.operator.ternary": "operator",

  // Variables
  "variable": "variable",
  "variable.parameter": "variable",
  "variable.parameter.function": "variable",
  "variable.language": "variable.special",
  "variable.other": "variable",
  "variable.other.readwrite": "variable",
  "variable.other.property": "variable",

  // Functions
  "entity.name.function": "function",
  "entity.name.function.constructor": "constructor",
  "meta.require": "function",
  "support.function": "function",
  "support.function.any-method": "function",
  "support.function.magic": "function",

  // Types / Classes
  "support.class": "type",
  "entity.name.class": "type",
  "entity.name.type": "type",
  "entity.name.type.class": "type",
  "entity.other.inherited-class": "type",
  "meta.class": "type",
  "meta.class.body": "type",

  // Strings
  "string": "string",
  "string.quoted": "string",
  "string.quoted.single": "string",
  "string.quoted.double": "string",
  "string.unquoted": "string",
  "string.template": "string",
  "constant.other.symbol": "string.special.symbol",
  "constant.character.escape": "string.escape",
  "string.regexp": "string.regex",
  "punctuation.definition.string": "punctuation",

  // Numbers
  "constant.numeric": "number",
  "constant.numeric.integer": "number",
  "constant.numeric.float": "number",

  // Constants
  "constant": "constant",
  "constant.language": "constant",
  "constant.other": "constant",
  "constant.other.color": "constant",
  "constant.other.unit": "constant",

  // Booleans
  "constant.language.boolean": "boolean",

  // Properties
  "support.type.property-name": "property",
  "meta.object-literal.key": "property",

  // Tags
  "entity.name.tag": "tag",
  "punctuation.definition.tag": "tag",

  // Attributes
  "entity.other.attribute-name": "attribute",
  "entity.other.attribute-name.id": "attribute",
  "entity.other.attribute-name.class": "attribute",
  "entity.other.attribute-name.parent-selector": "attribute",

  // Selectors
  "meta.selector": "selector",
  "selector": "selector",
  "selector.pseudo": "selector.pseudo",

  // Titles / Headings
  "markup.heading": "title",
  "entity.name.section": "title",
  "punctuation.definition.heading": "title",

  // Emphasis
  "markup.bold": "emphasis.strong",
  "punctuation.definition.bold": "emphasis.strong",
  "markup.italic": "emphasis",
  "punctuation.definition.italic": "emphasis",

  // Literal text / Inline code
  "markup.raw.inline": "text.literal",
  "markup.raw": "text.literal",

  // Links
  "string.other.link": "link_text",
  "string.other.link.title": "link_text",
  "meta.link": "link_uri",
  "markup.underline.link": "link_uri",

  // Lists
  "markup.list": "punctuation.list_marker",
  "markup.list.numbered": "punctuation.list_marker",
  "markup.list.unordered": "punctuation.list_marker",

  // Embedded / Interpolation
  "punctuation.section.embedded": "embedded",
  "variable.interpolation": "embedded",

  // Diff
  "markup.inserted": "diff.plus",
  "markup.deleted": "diff.minus",

  // Punctuation
  "punctuation": "punctuation",
  "punctuation.separator": "punctuation.delimiter",
  "punctuation.terminator": "punctuation.delimiter",
  "punctuation.bracket": "punctuation.bracket",
  "punctuation.delimiter": "punctuation.delimiter",
  "punctuation.definition.variable": "punctuation",
  "punctuation.definition.parameters": "punctuation",
  "punctuation.definition.array": "punctuation",
  "punctuation.section": "punctuation",

  // Preprocessor
  "meta.preprocessor": "preproc",

  // Enum
  "support.constant.enum": "enum",
  "meta.enum": "enum",

  // Primary / Default
  "none": "primary",

  // Invalid
  "invalid.illegal": "punctuation.special",
  "invalid.deprecated": "hint",

  // Units
  "keyword.other.unit": "number",

  // Quote
  "markup.quote": "punctuation",

  // Separator
  "meta.separator": "punctuation",

  // Changed
  "markup.changed": "punctuation.special",

  // Labels
  "entity.name.label": "label",

  // Namespace
  "entity.name.namespace": "namespace",
  "support.namespace": "namespace",

  // Variant
  "variable.other.constant": "variant",
  "variable.other.enummember": "variant",
};

export function findZedToken(scope: string): string | undefined {
  const trimmed = scope.trim();
  if (SCOPE_TO_ZED[trimmed]) return SCOPE_TO_ZED[trimmed];

  // Try parent scopes: "entity.name.function" → check "entity.name", then "entity"
  const parts = trimmed.split(".");
  for (let i = parts.length - 1; i > 0; i--) {
    const parent = parts.slice(0, i).join(".");
    if (SCOPE_TO_ZED[parent]) return SCOPE_TO_ZED[parent];
  }

  return undefined;
}
