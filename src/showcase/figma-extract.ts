/**
 * Reads the live examples on a page and describes them as plain data a Figma
 * plugin can rebuild: frames, text, vectors, colours, radii, shadows.
 * Dev only. It is driven from the browser console by `figma/README.md`.
 */

type RGBA = [number, number, number, number];

interface Paint {
  kind: "solid" | "image";
  color?: RGBA;
  /** PNG as a data URL, for gradients Figma cannot take as CSS. */
  png?: string;
}
interface Shadow {
  inset: boolean;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: RGBA;
}
export interface FNode {
  t: "F" | "T" | "S";
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  opacity?: number;
  // frame
  fills?: Paint[];
  stroke?: { color: RGBA; top: number; right: number; bottom: number; left: number; dashed?: boolean };
  radius?: [number, number, number, number];
  shadows?: Shadow[];
  blur?: number;
  clip?: boolean;
  c?: FNode[];
  // text
  text?: string;
  font?: { family: string; weight: number; size: number; lineHeight: number; letterSpacing: number; italic: boolean };
  color?: RGBA;
  align?: "LEFT" | "CENTER" | "RIGHT";
  wrap?: boolean;
  underline?: boolean;
  // vector
  svg?: string;
}

const round = (n: number) => Math.round(n * 2) / 2;

// ---- colour --------------------------------------------------------------

const probeCanvas = document.createElement("canvas");
probeCanvas.width = probeCanvas.height = 1;
const probeCtx = probeCanvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
const colorCache = new Map<string, RGBA>();

/** Any CSS colour (rgb, oklab, color-mix result, ...) as 0..1 RGBA. */
function toRGBA(css: string): RGBA {
  const hit = colorCache.get(css);
  if (hit) return hit;
  probeCtx.clearRect(0, 0, 1, 1);
  probeCtx.fillStyle = "#000";
  probeCtx.fillStyle = css;
  probeCtx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = probeCtx.getImageData(0, 0, 1, 1).data;
  const out: RGBA = [r / 255, g / 255, b / 255, Math.round((a / 255) * 1000) / 1000];
  colorCache.set(css, out);
  return out;
}

/** Splits "a, b(c, d), e" on the commas that are not inside brackets. */
function splitTop(value: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (ch === "," && depth === 0) {
      parts.push(value.slice(start, i).trim());
      start = i + 1;
    }
  }
  parts.push(value.slice(start).trim());
  return parts.filter(Boolean);
}

function parseShadows(value: string): Shadow[] {
  if (!value || value === "none") return [];
  const out: Shadow[] = [];
  for (const part of splitTop(value)) {
    const colorMatch = part.match(/(rgba?|hsla?|oklab|oklch|color|lab|lch)\([^)]*\)|#[0-9a-f]{3,8}/i);
    const color = colorMatch ? toRGBA(colorMatch[0]) : ([0, 0, 0, 1] as RGBA);
    const rest = colorMatch ? part.replace(colorMatch[0], "") : part;
    const nums = (rest.match(/-?[\d.]+px/g) ?? []).map((n) => parseFloat(n));
    if (color[3] === 0) continue;
    out.push({ inset: /\binset\b/.test(rest), x: nums[0] ?? 0, y: nums[1] ?? 0, blur: nums[2] ?? 0, spread: nums[3] ?? 0, color });
  }
  return out;
}

/** Paints a CSS background into a PNG, for gradients. */
async function rasterBackground(w: number, h: number, background: string): Promise<string | null> {
  try {
    // Gradients are smooth, so a modest resolution is enough and keeps the plugin small.
    const scale = w * h > 60_000 ? 1 : 2;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="width:${w}px;height:${h}px;background:${background.replace(/"/g, "'")}"></div></foreignObject></svg>`;
    const img = new Image();
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(w * scale);
    canvas.height = Math.ceil(h * scale);
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    // Opaque surfaces compress far better as JPEG; anything with transparency stays PNG.
    const corner = ctx.getImageData(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1).data[3];
    const opaque = corner === 255 && ctx.getImageData(1, 1, 1, 1).data[3] === 255 && ctx.getImageData(canvas.width - 2, canvas.height - 2, 1, 1).data[3] === 255;
    return opaque ? canvas.toDataURL("image/jpeg", 0.9) : canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

// ---- elements ------------------------------------------------------------

const SEMANTIC = new Set(["BUTTON", "A", "INPUT", "TEXTAREA", "LABEL", "LI", "TR", "TD", "TH", "TABLE", "SELECT"]);
const SVG_PROPS = ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin", "stroke-dasharray", "stroke-dashoffset", "opacity", "fill-opacity", "stroke-opacity"] as const;

function label(el: Element): string {
  const aria = el.getAttribute("aria-label");
  const role = el.getAttribute("role");
  const tag = el.tagName.toLowerCase();
  const text = (el as HTMLElement).innerText?.trim().replace(/\s+/g, " ").slice(0, 32);
  const base = role || tag;
  return aria ? `${base}: ${aria}` : text && SEMANTIC.has(el.tagName) ? `${base}: ${text}` : base;
}

function radii(cs: CSSStyleDeclaration, w: number, h: number): [number, number, number, number] | undefined {
  const max = Math.min(w, h) / 2;
  const one = (v: string) => {
    const first = v.split(" ")[0];
    const n = parseFloat(first) || 0;
    return round(Math.min(first.endsWith("%") ? (n / 100) * Math.min(w, h) : n, max));
  };
  const r: [number, number, number, number] = [one(cs.borderTopLeftRadius), one(cs.borderTopRightRadius), one(cs.borderBottomRightRadius), one(cs.borderBottomLeftRadius)];
  return r.some((n) => n > 0) ? r : undefined;
}

/** An SVG with every computed colour written onto it, so it stands alone. */
function serializeSvg(svg: SVGSVGElement, w: number, h: number): string {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const from = [svg, ...svg.querySelectorAll("*")];
  const to = [clone, ...clone.querySelectorAll("*")];
  from.forEach((src, i) => {
    const cs = getComputedStyle(src);
    const dst = to[i];
    if (!dst) return;
    for (const prop of SVG_PROPS) {
      const v = cs.getPropertyValue(prop);
      if (!v) continue;
      if (prop === "fill" || prop === "stroke") {
        if (v === "none") dst.setAttribute(prop, "none");
        else if (/^url\(/.test(v)) continue;
        else {
          const [r, g, b, a] = toRGBA(v);
          dst.setAttribute(prop, `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)})`);
          if (a < 1) dst.setAttribute(`${prop}-opacity`, String(a * (parseFloat(cs.getPropertyValue(`${prop}-opacity`)) || 1)));
        }
      } else if (prop === "stroke-dasharray") {
        if (v !== "none") dst.setAttribute(prop, v.replace(/px/g, ""));
      } else if (prop.endsWith("opacity")) {
        if (parseFloat(v) < 1 && !dst.hasAttribute(prop)) dst.setAttribute(prop, v);
      } else dst.setAttribute(prop, v.replace(/px/g, ""));
    }
    // Text keeps its look only if the font is written on it: the classes are about to go.
    if (src instanceof SVGTextElement || src instanceof SVGTSpanElement) {
      dst.setAttribute("font-family", /mono/i.test(cs.fontFamily) ? "DM Mono" : "DM Sans");
      dst.setAttribute("font-size", String(parseFloat(cs.fontSize)));
      dst.setAttribute("font-weight", cs.fontWeight);
      if (cs.textAnchor && cs.textAnchor !== "start") dst.setAttribute("text-anchor", cs.textAnchor);
      if (cs.dominantBaseline && cs.dominantBaseline !== "auto") dst.setAttribute("dominant-baseline", cs.dominantBaseline);
    }
    // A line that draws itself in uses pathLength with a dash. Export it fully drawn.
    if (dst.hasAttribute("pathLength")) {
      dst.removeAttribute("pathLength");
      dst.removeAttribute("stroke-dasharray");
      dst.removeAttribute("stroke-dashoffset");
    }
    // CSS transforms (a donut turned to start at the top) live in the style that is about to go.
    if (i > 0 && cs.transform && cs.transform !== "none" && cs.transform !== "matrix(1, 0, 0, 1, 0, 0)") {
      const [ox, oy] = cs.transformOrigin.split(" ").map((v) => parseFloat(v) || 0);
      let bx = 0;
      let by = 0;
      if (cs.getPropertyValue("transform-box") === "fill-box" && src instanceof SVGGraphicsElement) {
        try {
          const bbox = src.getBBox();
          bx = bbox.x;
          by = bbox.y;
        } catch {
          // Not rendered: leave the origin where it is.
        }
      }
      dst.setAttribute("transform", `translate(${ox + bx} ${oy + by}) ${cs.transform} translate(${-(ox + bx)} ${-(oy + by)})`);
    }
    dst.removeAttribute("class");
    dst.removeAttribute("style");
  });
  clone.setAttribute("width", String(w));
  clone.setAttribute("height", String(h));
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  return clone.outerHTML;
}

function textStyle(cs: CSSStyleDeclaration) {
  const size = parseFloat(cs.fontSize);
  const lh = cs.lineHeight === "normal" ? size * 1.2 : parseFloat(cs.lineHeight);
  return {
    family: /mono/i.test(cs.fontFamily) ? "DM Mono" : "DM Sans",
    weight: parseInt(cs.fontWeight, 10) || 400,
    size: round(size),
    lineHeight: round(lh),
    letterSpacing: cs.letterSpacing === "normal" ? 0 : Math.round(parseFloat(cs.letterSpacing) * 100) / 100,
    italic: cs.fontStyle === "italic",
  };
}

function transformText(text: string, cs: CSSStyleDeclaration) {
  if (cs.textTransform === "uppercase") return text.toUpperCase();
  if (cs.textTransform === "lowercase") return text.toLowerCase();
  if (cs.textTransform === "capitalize") return text.replace(/\b\p{L}/gu, (c) => c.toUpperCase());
  return text;
}

interface Origin {
  x: number;
  y: number;
}

async function pseudoNode(el: Element, which: "::before" | "::after", box: DOMRect, origin: Origin): Promise<FNode | null> {
  const cs = getComputedStyle(el, which);
  if (!cs.content || cs.content === "none" || cs.display === "none" || cs.position !== "absolute") return null;
  const w = parseFloat(cs.width);
  const h = parseFloat(cs.height);
  const left = parseFloat(cs.left);
  const top = parseFloat(cs.top);
  if (![w, h, left, top].every(Number.isFinite) || w < 1 || h < 1 || parseFloat(cs.opacity) === 0) return null;
  const bg = toRGBA(cs.backgroundColor);
  const shadows = parseShadows(cs.boxShadow);
  const borderW = parseFloat(cs.borderTopWidth) || 0;
  if (bg[3] === 0 && shadows.length === 0 && borderW === 0) return null;
  const parent = getComputedStyle(el);
  return {
    t: "F",
    name: which.slice(2),
    x: round(box.left - origin.x + (parseFloat(parent.borderLeftWidth) || 0) + left),
    y: round(box.top - origin.y + (parseFloat(parent.borderTopWidth) || 0) + top),
    w: round(w),
    h: round(h),
    fills: bg[3] > 0 ? [{ kind: "solid", color: bg }] : [],
    radius: radii(cs, w, h),
    shadows: shadows.length ? shadows : undefined,
    stroke: borderW > 0 ? { color: toRGBA(cs.borderTopColor), top: borderW, right: borderW, bottom: borderW, left: borderW } : undefined,
    opacity: parseFloat(cs.opacity) < 1 ? parseFloat(cs.opacity) : undefined,
  };
}

/** Walks one element. Returns the nodes it contributes to its nearest drawn ancestor. */
async function walk(el: Element, origin: Origin, depth: number): Promise<FNode[]> {
  const cs = getComputedStyle(el);
  if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) return [];
  const box = el.getBoundingClientRect();
  if (cs.display !== "contents" && (box.width < 0.5 || box.height < 0.5) && cs.overflow !== "visible") return [];

  if (el instanceof SVGSVGElement) {
    if (box.width < 1 || box.height < 1) return [];
    return [{ t: "S", name: el.getAttribute("aria-label") || (el.classList.contains("lucide") ? [...el.classList].find((c) => c.startsWith("lucide-")) || "icon" : "vector"), x: round(box.left - origin.x), y: round(box.top - origin.y), w: round(box.width), h: round(box.height), svg: serializeSvg(el, round(box.width), round(box.height)), opacity: parseFloat(cs.opacity) < 1 ? parseFloat(cs.opacity) : undefined }];
  }
  if (el instanceof HTMLImageElement || el instanceof HTMLCanvasElement || el instanceof HTMLVideoElement || el instanceof HTMLIFrameElement) return [];

  const w = round(box.width);
  const h = round(box.height);
  const bg = toRGBA(cs.backgroundColor);
  const hasGradient = cs.backgroundImage.includes("gradient(");
  const borders = { top: parseFloat(cs.borderTopWidth) || 0, right: parseFloat(cs.borderRightWidth) || 0, bottom: parseFloat(cs.borderBottomWidth) || 0, left: parseFloat(cs.borderLeftWidth) || 0 };
  const borderColor = toRGBA(borders.top ? cs.borderTopColor : borders.bottom ? cs.borderBottomColor : borders.left ? cs.borderLeftColor : cs.borderRightColor);
  const hasBorder = (borders.top || borders.right || borders.bottom || borders.left) > 0 && borderColor[3] > 0 && cs.borderTopStyle !== "none";
  const shadows = parseShadows(cs.boxShadow);
  const clip = cs.overflowX !== "visible" || cs.overflowY !== "visible";
  const blurMatch = (cs.backdropFilter || "").match(/blur\(([\d.]+)px\)/);
  const visual = bg[3] > 0 || hasGradient || hasBorder || shadows.length > 0 || !!blurMatch;
  const makeFrame = depth === 0 || visual || SEMANTIC.has(el.tagName) || el.hasAttribute("role") || (clip && el.scrollHeight > el.clientHeight + 1);

  const here: Origin = makeFrame ? { x: box.left, y: box.top } : origin;
  const children: FNode[] = [];

  const before = await pseudoNode(el, "::before", box, here);
  if (before) children.push(before);

  for (const child of el.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      const raw = child.textContent ?? "";
      if (!raw.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(child);
      const rects = [...range.getClientRects()].filter((r) => r.width > 0.5 && r.height > 0.5);
      if (rects.length === 0) continue;
      const bounds = range.getBoundingClientRect();
      const lines = new Set(rects.map((r) => Math.round(r.top))).size;
      const align = cs.textAlign === "center" ? "CENTER" : cs.textAlign === "right" || cs.textAlign === "end" ? "RIGHT" : "LEFT";
      children.push({
        t: "T",
        name: raw.trim().slice(0, 40),
        x: round(bounds.left - here.x),
        y: round(bounds.top - here.y),
        w: round(bounds.width),
        h: round(bounds.height),
        text: transformText(raw.replace(/\s+/g, " ").trim(), cs),
        font: textStyle(cs),
        color: toRGBA(cs.color),
        align,
        wrap: lines > 1,
        underline: cs.textDecorationLine.includes("underline") && !cs.textDecorationColor.includes("0)") ? true : undefined,
      });
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      children.push(...(await walk(child as Element, here, depth + 1)));
    }
  }

  // Form fields draw their value themselves: it is not a text node.
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    const value = el.value || el.placeholder;
    if (value && el.type !== "checkbox" && el.type !== "radio" && el.type !== "file" && el.type !== "range" && el.type !== "hidden") {
      const placeholder = !el.value;
      const color = toRGBA(placeholder ? getComputedStyle(el, "::placeholder").color : cs.color);
      const font = textStyle(cs);
      const padL = parseFloat(cs.paddingLeft) || 0;
      const padT = parseFloat(cs.paddingTop) || 0;
      const single = el instanceof HTMLInputElement;
      const center = cs.textAlign === "center";
      children.push({
        t: "T",
        name: placeholder ? "placeholder" : "value",
        x: round(box.left - here.x + (center ? 0 : padL + borders.left)),
        y: round(box.top - here.y + (single ? (box.height - font.lineHeight) / 2 : padT + borders.top)),
        w: round(center ? box.width : Math.max(8, box.width - padL - (parseFloat(cs.paddingRight) || 0) - borders.left - borders.right)),
        h: font.lineHeight,
        text: el.type === "password" ? "•".repeat(value.length) : value,
        font,
        color,
        align: center ? "CENTER" : "LEFT",
        wrap: !single,
      });
    }
  }

  const after = await pseudoNode(el, "::after", box, here);
  if (after) children.push(after);

  if (!makeFrame) return children;

  const fills: Paint[] = [];
  if (hasGradient && bg[3] === 0 && w * h < 1_500_000) {
    const png = await rasterBackground(w, h, `${cs.backgroundImage}, ${cs.backgroundColor}`);
    if (png) fills.push({ kind: "image", png });
  } else if (bg[3] > 0) fills.push({ kind: "solid", color: bg });

  const opacity = parseFloat(cs.opacity);
  return [
    {
      t: "F",
      name: depth === 0 ? "Preview" : label(el),
      x: round(box.left - origin.x),
      y: round(box.top - origin.y),
      w,
      h,
      fills,
      stroke: hasBorder ? { color: borderColor, ...borders, dashed: cs.borderTopStyle === "dashed" || undefined } : undefined,
      radius: radii(cs, w, h),
      shadows: shadows.length ? shadows : undefined,
      blur: blurMatch ? parseFloat(blurMatch[1]) : undefined,
      clip: clip || undefined,
      opacity: opacity < 1 ? opacity : undefined,
      c: children,
    },
  ];
}

// ---- pages ---------------------------------------------------------------

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface ExtractedDemo {
  id: string;
  title: string;
  note: string;
  node: FNode;
  /** Popups this example opens (dialog, menu, list), captured open. */
  overlays: FNode[];
}
export interface ExtractedPage {
  slug: string;
  title: string;
  group: string;
  summary: string;
  width: number;
  demos: ExtractedDemo[];
}

const portalRoots = () => [...document.body.children].filter((el) => el.id !== "root" && !(el instanceof HTMLScriptElement) && !(el instanceof HTMLStyleElement));

/** Opens the first popup an example has, captures it, and closes it again. */
async function captureOverlays(demo: HTMLElement): Promise<FNode[]> {
  // Prefer a control that says it opens something; otherwise try the first
  // button, which is how the confirm dialog and command palette are opened.
  const trigger =
    demo.querySelector<HTMLElement>('button[aria-haspopup]:not([disabled]), [role="combobox"]:not([disabled]):not(input), button[aria-expanded="false"][aria-controls]:not([disabled])') ??
    // Never where a file picker could open: that is an operating-system dialog nobody is there to close.
    (demo.querySelector('input[type="file"]') ? null : demo.querySelector<HTMLElement>("button:not([disabled]):not([role])"));
  if (!trigger) return [];
  const before = new Set(portalRoots());
  const out: FNode[] = [];
  try {
    trigger.scrollIntoView({ block: "center" });
    await sleep(60);
    trigger.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerType: "mouse", button: 0 }));
    trigger.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, button: 0 }));
    trigger.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerType: "mouse", button: 0 }));
    trigger.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, button: 0 }));
    trigger.click();
    await sleep(650);
    for (const root of portalRoots()) {
      if (before.has(root)) continue;
      // The animated surface itself, which every popup marks with one of these utilities.
      const popups = root.querySelectorAll<HTMLElement>('[class*="rovr-pop"], [class*="rovr-dialog"], [class*="rovr-sheet"]');
      const seen: HTMLElement[] = [];
      for (const popup of popups) {
        if (seen.some((s) => s.contains(popup))) continue;
        seen.push(popup);
        // The popup may still be easing in (or frozen, in a background tab):
        // put it in its resting state while it is measured.
        const restore = popup.getAttribute("style");
        popup.style.transition = "none";
        popup.style.opacity = "1";
        popup.style.scale = "1";
        popup.style.translate = "0 0";
        await sleep(50);
        const box = popup.getBoundingClientRect();
        if (box.width >= 4 && box.height >= 4) {
          const nodes = await walk(popup, { x: box.left, y: box.top }, 0);
          if (nodes[0]) out.push({ ...nodes[0], name: `Open: ${label(popup)}` });
        }
        if (restore === null) popup.removeAttribute("style");
        else popup.setAttribute("style", restore);
      }
    }
  } catch (error) {
    // An example that cannot be opened this way is simply captured closed.
    console.warn("[figma] overlay not captured", error);
  }
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  (document.activeElement as HTMLElement | null)?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  await sleep(350);
  for (const root of portalRoots()) {
    if (before.has(root)) continue;
    // A synthetic Escape does not always close a modal: fall back to its own close or cancel button.
    const dialog = root.querySelector('[role="dialog"], [role="alertdialog"]');
    if (dialog) (dialog.querySelector<HTMLElement>('button[aria-label="Close"], button') ?? null)?.click();
  }
  await sleep(250);
  if (document.querySelector('[role="dialog"], [role="alertdialog"]')) {
    document.querySelector<HTMLElement>('[role="dialog"] button, [role="alertdialog"] button')?.click();
    await sleep(250);
  }
  return out;
}

export async function extractPage(meta: { slug: string; title: string; group: string; summary: string }, withOverlays = true): Promise<ExtractedPage> {
  await document.fonts.ready;
  const demos: ExtractedDemo[] = [];
  let width = 0;
  for (const el of document.querySelectorAll<HTMLElement>("[data-figma-demo]")) {
    if (el.offsetParent === null) continue;
    el.scrollIntoView({ block: "center" });
    await sleep(120);
    const box = el.getBoundingClientRect();
    const nodes = await walk(el, { x: box.left, y: box.top }, 0);
    if (!nodes[0]) continue;
    width = Math.max(width, nodes[0].w);
    demos.push({
      id: el.dataset.figmaDemo ?? "",
      title: el.dataset.figmaTitle ?? "",
      note: el.dataset.figmaNote ?? "",
      node: nodes[0],
      overlays: withOverlays ? await captureOverlays(el) : [],
    });
  }
  return { ...meta, width, demos };
}

// ---- tokens --------------------------------------------------------------

export interface ExtractedTokens {
  colors: { name: string; light: RGBA; dark: RGBA }[];
  radii: { name: string; value: number }[];
  text: { name: string; family: string; weight: number; size: number; lineHeight: number; letterSpacing: number }[];
}

const TEXT_UTILITIES = ["display-xl", "display-lg", "display-md", "display-sm", "title-lg", "title-md", "title-sm", "body-lg", "body", "body-sm", "label", "caption", "overline"];

export function extractTokens(): ExtractedTokens {
  const names = new Set<string>();
  for (const sheet of document.styleSheets) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }
    const visit = (list: CSSRuleList) => {
      for (const rule of list) {
        if (rule instanceof CSSStyleRule && /^(:root|\.dark)$/.test(rule.selectorText.trim())) {
          // Read the names from the rule's text: iterating `rule.style` skips some custom properties.
          for (const [prop] of rule.cssText.matchAll(/--[\w-]+(?=\s*:)/g)) if (!/^--(tw|color|font|text|radius-|ease|animate|spacing|shadow|dur|spring|container|breakpoint|default|leading|tracking|blur)/.test(prop)) names.add(prop);
        } else if ("cssRules" in rule) visit((rule as CSSGroupingRule).cssRules);
      }
    };
    visit(rules);
  }

  const host = document.createElement("div");
  const probe = document.createElement("div");
  host.appendChild(probe);
  host.style.cssText = "position:absolute;visibility:hidden;pointer-events:none";
  document.body.appendChild(host);
  const root = document.documentElement;
  const wasDark = root.classList.contains("dark");

  /** A token is a colour only if what it resolves to does not follow the parent's colour. */
  const read = (name: string): RGBA | null => {
    probe.style.color = `var(${name})`;
    host.style.color = "rgb(1, 2, 3)";
    const a = getComputedStyle(probe).color;
    host.style.color = "rgb(3, 2, 1)";
    const b = getComputedStyle(probe).color;
    return a === b ? toRGBA(a) : null;
  };

  const colors: ExtractedTokens["colors"] = [];
  for (const name of [...names].sort()) {
    root.classList.remove("dark");
    const light = read(name);
    root.classList.add("dark");
    const dark = read(name);
    if (light && dark) colors.push({ name: name.slice(2), light, dark });
  }
  root.classList.toggle("dark", wasDark);

  const radiiOut: ExtractedTokens["radii"] = [];
  for (const name of ["xs", "sm", "md", "lg", "xl", "2xl"]) {
    probe.style.width = `var(--radius-${name})`;
    const value = parseFloat(getComputedStyle(probe).width);
    if (Number.isFinite(value) && value > 0) radiiOut.push({ name, value: round(value) });
  }

  const text: ExtractedTokens["text"] = [];
  for (const name of TEXT_UTILITIES) {
    probe.removeAttribute("style");
    probe.className = `text-${name}`;
    const style = textStyle(getComputedStyle(probe));
    text.push({ name, family: style.family, weight: style.weight, size: style.size, lineHeight: style.lineHeight, letterSpacing: style.letterSpacing });
  }
  host.remove();
  return { colors, radii: radiiOut, text };
}

// ---- HTML snapshots ---------------------------------------------------------
// A self-contained HTML copy of a page's examples (styles and fonts inlined, no
// scripts), for Figma's own HTML importer. It keeps the real layout, so the
// importer can turn flex rows and columns into auto-layout.

let cssCache: Promise<string> | null = null;

async function toDataUrl(url: string): Promise<string | null> {
  try {
    const blob = await (await fetch(url)).blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/** Every rule on the page as one stylesheet, with the Latin font files inlined. */
function pageCss(): Promise<string> {
  cssCache ??= (async () => {
    const parts: string[] = [];
    for (const sheet of document.styleSheets) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      for (const rule of rules) {
        if (rule instanceof CSSFontFaceRule) {
          // Only the Latin subset: the others are never used here and would bloat the file.
          const range = rule.style.getPropertyValue("unicode-range");
          if (range && !/U\+0{1,4}-/i.test(range)) continue;
          let text = rule.cssText;
          for (const [whole, url] of text.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
            const data = /^data:/.test(url) ? url : await toDataUrl(new URL(url, sheet.href ?? location.href).href);
            if (data) text = text.replace(whole, `url("${data}")`);
          }
          parts.push(text);
        } else parts.push(rule.cssText);
      }
    }
    // Figma knows the family as "DM Sans", not the web package's "DM Sans Variable".
    return parts.join("\n").replace(/DM Sans Variable/g, "DM Sans");
  })();
  return cssCache;
}

/** A copy of an element with the state the DOM keeps outside its markup written back in. */
function cloneWithState(el: Element): HTMLElement {
  const clone = el.cloneNode(true) as HTMLElement;
  const from = [el, ...el.querySelectorAll("*")];
  const to = [clone, ...clone.querySelectorAll("*")];
  from.forEach((src, i) => {
    const dst = to[i];
    if (src instanceof HTMLInputElement && dst instanceof HTMLInputElement) {
      if (src.type === "checkbox" || src.type === "radio") dst.toggleAttribute("checked", src.checked);
      else dst.setAttribute("value", src.value);
    } else if (src instanceof HTMLTextAreaElement) dst.textContent = src.value;
    // Animated entrances leave inline opacity and transform behind mid-flight: freeze what is on screen now.
    if (src instanceof HTMLElement || src instanceof SVGElement) {
      const inline = (src as HTMLElement).style;
      if (inline && (inline.opacity || inline.transform || inline.scale || inline.translate)) {
        const cs = getComputedStyle(src);
        (dst as HTMLElement).style.opacity = cs.opacity;
      }
    }
  });
  clone.querySelectorAll("script").forEach((s) => s.remove());
  return clone;
}

const escapeAttr = (v: string) => v.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

export async function snapshotPage(meta: { slug: string; title: string }): Promise<{ html: string; names: string[] }> {
  await document.fonts.ready;
  const blocks: string[] = [];
  const names: string[] = [];
  for (const el of document.querySelectorAll<HTMLElement>("[data-figma-demo]")) {
    if (el.offsetParent === null) continue;
    el.scrollIntoView({ block: "center" });
    await sleep(120);
    const name = `${meta.title}/${el.dataset.figmaTitle ?? ""}`;
    const width = Math.ceil(el.getBoundingClientRect().width);
    const clone = cloneWithState(el);
    clone.style.width = `${width}px`;
    clone.classList.add("rovr-export");
    clone.setAttribute("data-export-name", name);
    blocks.push(clone.outerHTML);
    names.push(name);

    // The popup this example opens, captured open and laid out in the normal flow.
    const trigger =
      el.querySelector<HTMLElement>('button[aria-haspopup]:not([disabled]), [role="combobox"]:not([disabled]):not(input), button[aria-expanded="false"][aria-controls]:not([disabled])') ??
      (el.querySelector('input[type="file"]') ? null : el.querySelector<HTMLElement>("button:not([disabled]):not([role])"));
    if (!trigger) continue;
    const before = new Set(portalRoots());
    trigger.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerType: "mouse", button: 0 }));
    trigger.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, button: 0 }));
    trigger.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerType: "mouse", button: 0 }));
    trigger.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, button: 0 }));
    trigger.click();
    await sleep(900);
    let n = 0;
    for (const root of portalRoots()) {
      if (before.has(root)) continue;
      for (const popup of root.querySelectorAll<HTMLElement>('[class*="rovr-pop"], [class*="rovr-dialog"], [class*="rovr-sheet"]')) {
        const box = popup.getBoundingClientRect();
        if (box.width < 4 || box.height < 4) continue;
        const copy = cloneWithState(popup);
        const popupName = `${name}/Open${n++ ? ` ${n}` : ""}`;
        // Out of its fixed, animated position and into the flow, at the size it had on screen.
        copy.setAttribute("style", `position:relative;inset:auto;top:auto;left:auto;right:auto;bottom:auto;transform:none;translate:none;scale:1;opacity:1;transition:none;animation:none;margin:0;width:${Math.ceil(popup.offsetWidth)}px;height:${Math.ceil(popup.offsetHeight)}px;max-height:none`);
        copy.classList.add("rovr-export");
        copy.setAttribute("data-export-name", popupName);
        blocks.push(copy.outerHTML);
        names.push(popupName);
      }
    }
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    (document.activeElement as HTMLElement | null)?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await sleep(350);
    for (const root of portalRoots()) {
      if (before.has(root)) continue;
      const dialog = root.querySelector('[role="dialog"], [role="alertdialog"]');
      if (dialog) (dialog.querySelector<HTMLElement>('button[aria-label="Close"], button') ?? null)?.click();
    }
    await sleep(250);
    if (document.querySelector('[role="dialog"], [role="alertdialog"]')) {
      document.querySelector<HTMLElement>('[role="dialog"] button, [role="alertdialog"] button')?.click();
      await sleep(250);
    }
  }
  const css = await pageCss();
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeAttr(meta.title)}</title>
<style>${css}</style>
<style>
  *, *::before, *::after { animation: none !important; transition: none !important; }
  body { margin: 0; }
  .rovr-export-stage { display: flex; flex-direction: column; align-items: flex-start; gap: 64px; padding: 48px; width: max-content; }
</style>
</head>
<body>
<div class="rovr-export-stage">
${blocks.join("\n")}
</div>
</body>
</html>`;
  return { html, names };
}
