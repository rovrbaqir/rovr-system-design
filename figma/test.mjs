// Runs figma/plugin/code.js against a strict stand-in for Figma's plugin API.
// It cannot prove the result looks right, but it catches the mistakes Figma
// would throw on: unloaded fonts, bad sizes, malformed paints and effects.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const here = path.dirname(new URL(import.meta.url).pathname.replace(/%20/g, " "));
const code = fs.readFileSync(path.join(here, "plugin", "code.js"), "utf8");

const AVAILABLE = {
  "DM Sans": ["Thin", "ExtraLight", "Light", "Regular", "Medium", "SemiBold", "Bold", "ExtraBold", "Black", "Italic", "Medium Italic", "SemiBold Italic", "Bold Italic"],
  "DM Mono": ["Light", "Regular", "Medium", "Italic"],
  Inter: ["Regular", "Medium", "Semi Bold", "Bold", "Italic"],
};
const loaded = new Set();
const counts = { FRAME: 0, TEXT: 0, VECTOR: 0, PAGE: 0, variables: 0, textStyles: 0, images: 0 };
let ids = 0;
const unit = (v, what) => {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > 1) throw new Error(`${what} out of range: ${v}`);
};
const checkPaints = (paints) => {
  if (!Array.isArray(paints)) throw new Error("fills must be an array");
  for (const p of paints) {
    if (p.type === "SOLID") {
      unit(p.color.r, "r");
      unit(p.color.g, "g");
      unit(p.color.b, "b");
      if ("a" in p.color) throw new Error("solid paint colour must not have alpha");
      if (p.opacity !== undefined) unit(p.opacity, "opacity");
    } else if (p.type === "IMAGE") {
      if (!p.imageHash) throw new Error("image paint without hash");
    } else throw new Error(`unknown paint ${p.type}`);
  }
};
const finite = (v, what, min = -1e6) => {
  if (typeof v !== "number" || !Number.isFinite(v) || v < min) throw new Error(`${what} invalid: ${v}`);
};

const registry = new Map();
function node(type, fixedId) {
  const state = { id: fixedId ?? `${++ids}:1`, type, children: [], data: {}, width: 100, height: 100, removed: false, parent: null };
  queueMicrotask(() => {});
  counts[type] = (counts[type] ?? 0) + 1;
  const target = {
    get id() {
      return state.id;
    },
    type,
    get children() {
      return state.children;
    },
    get width() {
      return state.width;
    },
    get height() {
      return state.height;
    },
    get removed() {
      return state.removed;
    },
    appendChild(child) {
      if (type === "TEXT" || type === "VECTOR") throw new Error("cannot append to a leaf");
      if (child.__detach) child.__detach();
      state.children.push(child);
      child.__setParent(target.__self);
    },
    __setParent(p) {
      state.parent = p;
    },
    __detach() {
      if (state.parent) state.parent.__drop(target.__self);
    },
    __drop(child) {
      const at = state.children.indexOf(child);
      if (at >= 0) state.children.splice(at, 1);
    },
    resizeWithoutConstraints(w, h) {
      if (type !== "SECTION") throw new Error("resizeWithoutConstraints is for sections in this test");
      finite(w, "width", 0.01);
      finite(h, "height", 0.01);
      state.width = w;
      state.height = h;
    },
    resize(w, h) {
      finite(w, "width", 0.01);
      finite(h, "height", 0.01);
      state.width = w;
      state.height = h;
    },
    setPluginData(k, v) {
      state.data[k] = v;
    },
    getPluginData(k) {
      return state.data[k] ?? "";
    },
    remove() {
      state.removed = true;
      target.__detach();
    },
    async setTextStyleIdAsync() {},
  };
  const proxy = new Proxy(target, {
    set(obj, prop, value) {
      if (prop === "__self") {
        obj[prop] = value;
        return true;
      }
      if (prop === "name" && typeof value !== "string") throw new Error("name must be a string");
      if (prop === "fills" || prop === "strokes") checkPaints(value);
      if (["x", "y"].includes(prop)) finite(value, prop);
      if (["opacity"].includes(prop)) unit(value, prop);
      if (/Radius$/.test(prop)) finite(value, prop, 0);
      if (/Weight$/.test(prop)) finite(value, prop, 0);
      if (prop === "effects") {
        for (const fx of value) {
          if (fx.type === "BACKGROUND_BLUR") finite(fx.radius, "blur", 0);
          else {
            if (!["DROP_SHADOW", "INNER_SHADOW"].includes(fx.type)) throw new Error(`effect ${fx.type}`);
            for (const c of ["r", "g", "b", "a"]) unit(fx.color[c], `effect ${c}`);
            finite(fx.offset.x, "offset");
            finite(fx.offset.y, "offset");
            finite(fx.radius, "radius", 0);
            if (!fx.blendMode) throw new Error("effect needs blendMode");
          }
        }
      }
      if (type === "TEXT") {
        if (prop === "fontName") {
          if (!loaded.has(`${value.family}/${value.style}`)) throw new Error(`font not loaded: ${value.family} ${value.style}`);
          state.font = value;
        }
        if (["characters", "fontSize", "lineHeight", "letterSpacing"].includes(prop) && !state.font) throw new Error(`set ${prop} before fontName`);
        if (prop === "characters") {
          if (typeof value !== "string") throw new Error("characters must be a string");
          state.width = Math.max(1, value.length * 7);
        }
        if (prop === "fontSize") finite(value, "fontSize", 1);
        if (prop === "lineHeight") finite(value.value, "lineHeight", 1);
        if (prop === "textAutoResize" && !["HEIGHT", "WIDTH_AND_HEIGHT", "NONE"].includes(value)) throw new Error("textAutoResize");
        if (prop === "textAlignHorizontal" && !["LEFT", "CENTER", "RIGHT", "JUSTIFIED"].includes(value)) throw new Error("align");
      }
      obj[prop] = value;
      return true;
    },
  });
  target.__self = proxy;
  registry.set(state.id, proxy);
  return proxy;
}

const messages = [];
const root = { children: [] };
const variableCollections = [];
const variablesById = new Map();
const rawData = JSON.parse(code.match(/^var DATA = (.*);\n/)[1]);
for (const name of ["Foundations", "Components", "Examples"]) {
  const p = node("PAGE");
  p.name = name;
  root.children.push(p);
  for (const pg of rawData.pages.filter((x) => x.group === name)) {
    const s = node("SECTION");
    s.name = pg.title;
    p.appendChild(s);
    // Frames the HTML importer left loose on the page.
    for (const id of rawData.imported[pg.slug] ?? []) {
      const f = node("FRAME", id);
      f.name = "Container";
      p.appendChild(f);
    }
  }
}
const existingColour = { name: "RoVR colour", modes: [{ modeId: "m1", name: "Light" }], variableIds: [], renameMode() {}, addMode() { throw new Error("Limited to 1 modes only"); }, remove() {} };
for (const c of rawData.tokens.colors) {
  const id = `V:pre:${c.name}`;
  variablesById.set(id, { id, name: c.name, setValueForMode() {} });
  existingColour.variableIds.push(id);
}
variableCollections.push(existingColour, { name: "RoVR radius", modes: [{ modeId: "r1" }], variableIds: [] });
let adoptedComponents = 0;
const figma = {
  root,
  fileKey: "TESTKEY",
  ui: { postMessage: (m) => messages.push(m), onmessage: null },
  showUI() {},
  createFrame: () => node("FRAME"),
  createComponent: () => {
    counts.components = (counts.components ?? 0) + 1;
    return node("FRAME");
  },
  createText: () => node("TEXT"),
  createPage: () => {
    if (root.children.length >= 3) throw new Error("The Starter plan only comes with 3 pages.");
    const p = node("PAGE");
    root.children.push(p);
    return p;
  },
  createSection: () => node("SECTION"),
  createComponentFromNode: (frame) => {
    if (frame.type !== "FRAME") throw new Error("not a frame");
    adoptedComponents++;
    return frame;
  },
  getNodeByIdAsync: async (id) => registry.get(id) ?? null,
  createNodeFromSvg(svg) {
    if (typeof svg !== "string" || !/^<svg[\s>]/.test(svg) || !svg.trim().endsWith("</svg>")) throw new Error("bad svg");
    if (/class=|style=/.test(svg)) throw new Error("svg still has class or style");
    return node("VECTOR");
  },
  createTextStyle: () => {
    counts.textStyles++;
    return { id: `S:${++ids}`, name: "" };
  },
  createImage: (bytes) => {
    if (!(bytes instanceof Uint8Array) || bytes.length < 8 || (bytes[0] !== 0x89 && bytes[0] !== 0xff)) throw new Error("not a PNG or JPEG");
    counts.images++;
    return { hash: `img${ids++}` };
  },
  base64Decode: (s) => new Uint8Array(Buffer.from(s, "base64")),
  async loadFontAsync({ family, style }) {
    if (!AVAILABLE[family]?.includes(style)) throw new Error(`no font ${family} ${style}`);
    loaded.add(`${family}/${style}`);
  },
  async setCurrentPageAsync() {},
  async getLocalTextStylesAsync() {
    return [];
  },
  variables: {
    async getLocalVariableCollectionsAsync() {
      return variableCollections;
    },
    async getVariableByIdAsync(id) {
      return variablesById.get(id) ?? null;
    },
    createVariableCollection(name) {
      const c = { name, modes: [{ modeId: "m1", name: "Mode 1" }], variableIds: [], renameMode() {}, addMode: () => "m2", remove() {} };
      variableCollections.push(c);
      return c;
    },
    createVariable(name, collection, type) {
      if (!/^[\w\- ./]+$/.test(name)) throw new Error(`bad variable name ${name}`);
      counts.variables++;
      return {
        id: `V:${++ids}`,
        name,
        setValueForMode(mode, value) {
          if (type === "COLOR") for (const c of ["r", "g", "b", "a"]) unit(value[c], `variable ${c}`);
          else finite(value, "variable");
        },
      };
    },
    setBoundVariableForPaint: (paint, field, variable) => ({ ...paint, boundVariables: { [field]: { type: "VARIABLE_ALIAS", id: variable.id } } }),
  },
};

// Count the layers the data asks for, to compare with what was built.
const dataMatch = code.match(/^var DATA = (.*);\n/);
const DATA = JSON.parse(dataMatch[1]);
const want = { F: 0, T: 0, S: 0 };
const tally = (n) => {
  want[n.t]++;
  (n.c ?? []).forEach(tally);
};
for (const page of DATA.pages) if (!(DATA.imported ?? {})[page.slug]) for (const demo of page.demos) [demo.node, ...demo.overlays].forEach(tally);

const context = vm.createContext({ figma, __html__: "<ui>", setTimeout, console, Promise });
vm.runInContext(`${code}\n;globalThis.__build = buildLibrary; globalThis.__failures = () => failures;`, context);
const result = await context.__build(true);
const failed = context.__failures();

console.log(result.summary);
console.log(`asked for: ${want.F} frames, ${want.T} texts, ${want.S} vectors`);
const importedFrames = Object.values(DATA.imported ?? {}).flat().length;
counts.FRAME -= importedFrames;
const sections = root.children.flatMap((p) => p.children.filter((c) => c.type === "SECTION"));
const empty = sections.filter((sec) => sec.children.length === 0).map((sec) => sec.name);
const loose = root.children.flatMap((p) => p.children.filter((c) => c.type !== "SECTION")).length;
console.log(`file:      ${root.children.length} pages, ${sections.length} sections, ${empty.length} empty, ${loose} loose nodes left on pages, ${adoptedComponents} imported frames adopted`);
console.log(`built:     ${counts.FRAME} frames, ${counts.TEXT} texts (incl. page labels), ${counts.VECTOR} vectors, ${counts.variables} variables, ${counts.textStyles} text styles, ${counts.images} images, ${counts.components} components`);
console.log(`fonts loaded: ${[...loaded].join(", ")}`);
console.log(`links: ${Object.keys(result.links.pages).length} pages, file ${result.links.file}`);
if (failed > 0 || counts.FRAME < want.F || counts.VECTOR < want.S || empty.length > 0 || loose > 0 || root.children.length !== 3) {
  if (empty.length) console.error(`empty sections: ${empty.join(", ")}`);
  console.error(`FAILED: ${failed} layers could not be created`);
  process.exit(1);
}
console.log("OK: every layer was created without an API error");
