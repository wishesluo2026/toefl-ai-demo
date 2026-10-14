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
const readme = await readFile(resolve(root, "README.md"), "utf8");

const requiredHtml = [
  'href="./styles.css"',
  'src="./app.js"',
  "新托福写作 AI 训练与评分平台 · 产品演示",
  "Product Demo",
  "安全演示环境",
  "模拟数据",
  "产品体验路线",
];
for (const token of requiredHtml) {
  if (!html.includes(token)) throw new Error(`Missing HTML contract: ${token}`);
}

if (/noindex|nofollow/i.test(html)) {
  throw new Error("Public portfolio demo must remain indexable");
}

for (const token of ["产品设计重点", "当前交互演示", "当前项目已经完成 / 验证的能力", "下一阶段验证", "5 分钟看懂这个 AI 产品", "3 个影响产品可用性的关键决策", "哪些已经验证"]) {
  if (!js.includes(token)) throw new Error(`Missing product demo contract: ${token}`);
}

if (/投资者|Investor Preview/i.test(`${html}\n${js}\n${readme}`)) {
  throw new Error("Legacy investor-facing copy remains in public content");
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
  "tour",
  "decisions",
  "evidence",
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
