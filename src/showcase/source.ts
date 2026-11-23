/**
 * Source code for the showcase's Code view. Every component file is loaded as
 * text on demand, so what a visitor copies is exactly what the page is running.
 */
const loaders = import.meta.glob<string>(["/src/components/**/*.tsx", "/src/lib/*.ts", "/src/styles/rovr.css", "/src/showcase/*.tsx"], {
  query: "?raw",
  import: "default",
});

const load = async (path: string): Promise<string | null> => {
  const loader = loaders[`/src/${path}`];
  return loader ? loader() : null;
};
const resolve = (id: string) => (id.startsWith("lib/") ? `${id}.ts` : `components/${id}.tsx`);

export interface SourceFile {
  /** Where the file lives in a project, e.g. `components/ui/button.tsx`. */
  path: string;
  /** The tab label. */
  name: string;
  code: string;
}
export interface DemoSource {
  files: SourceFile[];
  /** npm packages the files import, ready for `pnpm add`. */
  packages: string[];
}

const localImport = /from "@\/((?:components\/(?:ui|patterns)|lib)\/[\w-]+)"/g;
const anyImport = /from "([^"./@][^"]*|@[^"/]+\/[^"/]+)[^"]*"/g;
const packageOf = (spec: string) => (spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0]);

/** The helper components a demo uses that are written in the showcase file itself. */
function localHelpers(source: string, snippet: string, seen = new Set<string>()): string[] {
  const out: string[] = [];
  for (const [, name] of snippet.matchAll(/<([A-Z]\w+)/g)) {
    if (seen.has(name)) continue;
    const start = source.search(new RegExp(`^(?:export )?function ${name}\\(`, "m"));
    if (start < 0) continue;
    seen.add(name);
    const rest = source.slice(start);
    const end = rest.search(/\n}\n/);
    const body = end < 0 ? rest : rest.slice(0, end + 2);
    out.push(...localHelpers(source, body, seen), body);
  }
  return out;
}

const dedent = (text: string) => {
  const lines = text.replace(/^\n+|\s+$/g, "").split("\n");
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)?.[0].length ?? 0));
  return lines.map((l) => l.slice(indent)).join("\n");
};

/** The demo's own JSX, cut from the showcase source by its id, with any local helpers it relies on. */
async function usage(id: string): Promise<string | null> {
  for (const path of Object.keys(loaders).filter((p) => p.startsWith("/src/showcase/"))) {
    const source = await loaders[path]();
    const at = source.indexOf(`<Demo id="${id}"`);
    if (at < 0) continue;
    const open = source.indexOf(">\n", at);
    const close = source.indexOf("</Demo>", open);
    if (open < 0 || close < 0) return null;
    const snippet = dedent(source.slice(open + 2, close));
    const helpers = localHelpers(source, snippet);
    return [snippet, ...helpers].join("\n\n");
  }
  return null;
}

/** Everything needed to rebuild a demo: its usage, its components, what those import, and the tokens. */
export async function loadDemoSource(id: string, components: string[]): Promise<DemoSource> {
  const files: SourceFile[] = [];
  const packages = new Set<string>();
  const example = await usage(id);
  if (example) files.push({ path: "example.tsx", name: "Usage", code: example });

  const queue = [...components];
  const seen = new Set<string>();
  while (queue.length > 0) {
    const id = queue.shift() as string;
    const key = id.startsWith("lib/") ? id : id.replace(/^components\//, "");
    if (seen.has(key)) continue;
    seen.add(key);
    const path = resolve(key);
    const code = await load(path);
    if (!code) continue;
    files.push({ path, name: path.split("/").pop() as string, code });
    for (const [, dep] of code.matchAll(localImport)) queue.push(dep);
    // Components also import their neighbours by relative path: "./spinner", "../ui/button".
    const folder = key.split("/")[0];
    for (const [, up, name] of code.matchAll(/from "\.(\.\/(?:ui|patterns))?\/([\w-]+)"/g)) queue.push(up ? `${up.slice(2)}/${name}` : `${folder}/${name}`);
    for (const [, spec] of code.matchAll(anyImport)) if (spec !== "react") packages.add(packageOf(spec));
  }
  const tokens = await load("styles/rovr.css");
  if (tokens) files.push({ path: "styles/rovr.css", name: "rovr.css", code: tokens });
  return { files, packages: [...packages].sort() };
}

export type Token = { text: string; kind?: "comment" | "string" | "keyword" | "tag" | "number" };
const pattern =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(import|export|from|const|let|function|return|if|else|type|interface|extends|default|async|await|new|typeof|as|null|undefined|true|false)\b|(<\/?[A-Z][\w.]*)|\b(\d+(?:\.\d+)?)\b/g;

/** A small tokenizer: enough to tell comments, strings, keywords and components apart at a glance. */
export function highlight(code: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  for (const m of code.matchAll(pattern)) {
    const at = m.index ?? 0;
    if (at > last) tokens.push({ text: code.slice(last, at) });
    tokens.push({ text: m[0], kind: m[1] ? "comment" : m[2] ? "string" : m[3] ? "keyword" : m[4] ? "tag" : "number" });
    last = at + m[0].length;
  }
  if (last < code.length) tokens.push({ text: code.slice(last) });
  return tokens;
}
