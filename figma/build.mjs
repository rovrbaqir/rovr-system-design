// Bundles the exported data with the builder into figma/plugin/code.js.
import fs from "node:fs";
import path from "node:path";

const here = path.dirname(new URL(import.meta.url).pathname.replace(/%20/g, " "));
const dataDir = path.join(here, "data");
const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".json") && f !== "tokens.json" && !f.startsWith("_"));
const order = ["Foundations", "Components", "Examples"];
const pages = files
  .map((f) => JSON.parse(fs.readFileSync(path.join(dataDir, f), "utf8")))
  .filter((p) => p.demos && p.demos.length > 0)
  .sort((a, b) => order.indexOf(a.group) - order.indexOf(b.group) || a.title.localeCompare(b.title));
const tokens = JSON.parse(fs.readFileSync(path.join(dataDir, "tokens.json"), "utf8"));
const builder = fs.readFileSync(path.join(here, "builder.js"), "utf8");
const read = (file) => (fs.existsSync(path.join(here, file)) ? JSON.parse(fs.readFileSync(path.join(here, file), "utf8")) : {});
// Components already brought in through Figma's HTML importer: their node ids and the names to give them.
const imported = read("imported.json");
const names = read("data/_names.json");
const code = `var DATA = ${JSON.stringify({ tokens, pages, imported, names })};\n${builder}`;
fs.writeFileSync(path.join(here, "plugin", "code.js"), code);
console.log(`figma/plugin/code.js: ${pages.length} pages, ${pages.reduce((n, p) => n + p.demos.length, 0)} examples, ${(code.length / 1e6).toFixed(1)} MB`);
