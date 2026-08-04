import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const requiredFiles = [
  "index.html",
  "styles.css",
  "app.js",
  ".nojekyll",
  ".github/workflows/pages.yml",
];

for (const file of requiredFiles) {
  const info = await stat(resolve(root, file));
  if (!info.isFile()) throw new Error(`${file} is not a file`);
}

const html = await readFile(resolve(root, "index.html"), "utf8");
const css = await readFile(resolve(root, "styles.css"), "utf8");
const js = await readFile(resolve(root, "app.js"), "utf8");

const requiredHtml = [
  'href="./styles.css"',
  'src="./app.js"',
  'content="noindex, nofollow"',
  "零费用 Mock",
  "纯虚构数据",
];
for (const token of requiredHtml) {
  if (!html.includes(token)) throw new Error(`Missing HTML contract: ${token}`);
}

const requiredRoutes = [
  "overview",
  "student",
  "practice",
  "report",
  "operations",
  "rater-a",
  "rater-b",
  "adjudication",
  "architecture",
];
for (const route of requiredRoutes) {
  if (!js.includes(`"${route}"`)) throw new Error(`Missing route: ${route}`);
}

const forbiddenPatterns = [
  [/\bfetch\s*\(/, "fetch"],
  [/\bXMLHttpRequest\b/, "XMLHttpRequest"],
  [/\bWebSocket\b/, "WebSocket"],
  [/\bEventSource\b/, "EventSource"],
  [/api\.anthropic\.com/i, "Anthropic API host"],
  [/sk-ant-/i, "Anthropic key prefix"],
  [/\bhttps?:\/\//i, "absolute network URL"],
];
for (const [pattern, label] of forbiddenPatterns) {
  if (pattern.test(js) || pattern.test(css)) {
    throw new Error(`Forbidden network capability found: ${label}`);
  }
}

if (/type=["']password["']/i.test(html)) {
  throw new Error("Static demos must not pretend to protect an embedded password");
}
if (/<form\b/i.test(html)) {
  throw new Error("Static demo must not contain a submittable HTML form");
}

console.log(
  `Static demo check passed: ${requiredFiles.length} files, ` +
    `${requiredRoutes.length} routes, 0 network capabilities.`,
);
