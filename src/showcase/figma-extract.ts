/**
 * Turns the spec sheet on screen (`#/spec/<slug>`) into a self-contained HTML
 * page that Figma's HTML importer can read, and reads the design tokens.
 * Dev only. `figma/README.md` explains how it is used.
 */

type RGBA = [number, number, number, number];

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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const portalRoots = () => [...document.body.children].filter((el) => el.id !== "root" && !(el instanceof HTMLScriptElement) && !(el instanceof HTMLStyleElement));

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

// ---- HTML ---------------------------------------------------------------------

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

// ---- spec sheets -------------------------------------------------------------
// One self-contained HTML page per component: the spec sheet at `#/spec/<slug>`
// with the popups its examples open laid out under them.

export interface SheetMeta {
  slug: string;
  title: string;
  group: string;
  summary: string;
  /** Each grid of a matrix section: its size on the sheet and the prop values its rows and columns stand for. */
  sets: { n: string; w: number; h: number; rp: string; rows: string[]; gp: string; groups: string[]; states: string[] }[];
}

const TRIGGER = 'button[aria-haspopup]:not([disabled]), [role="combobox"]:not([disabled]):not(input), button[aria-expanded="false"][aria-controls]:not([disabled])';

/** Opens the popup an example has, copies it into the normal flow, and closes it again. */
async function openCopies(el: HTMLElement): Promise<string[]> {
  const trigger = el.querySelector<HTMLElement>(TRIGGER) ?? (el.querySelector('input[type="file"]') ? null : el.querySelector<HTMLElement>("button:not([disabled]):not([role])"));
  if (!trigger) return [];
  const out: string[] = [];
  const before = new Set(portalRoots());
  trigger.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerType: "mouse", button: 0 }));
  trigger.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, button: 0 }));
  trigger.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerType: "mouse", button: 0 }));
  trigger.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, button: 0 }));
  trigger.click();
  await sleep(900);
  for (const root of portalRoots()) {
    if (before.has(root)) continue;
    const seen: HTMLElement[] = [];
    for (const popup of root.querySelectorAll<HTMLElement>('[class*="rovr-pop"], [class*="rovr-dialog"], [class*="rovr-sheet"]')) {
      if (seen.some((s) => s.contains(popup))) continue;
      seen.push(popup);
      if (popup.offsetWidth < 4 || popup.offsetHeight < 4) continue;
      const copy = cloneWithState(popup);
      copy.setAttribute(
        "style",
        `position:relative;inset:auto;top:auto;left:auto;right:auto;bottom:auto;transform:none;translate:none;scale:1;opacity:1;transition:none;animation:none;margin:0;width:${Math.ceil(popup.offsetWidth)}px;height:${Math.ceil(popup.offsetHeight)}px;max-height:none`,
      );
      out.push(copy.outerHTML);
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
  return out;
}

export async function snapshotSheet(info: { slug: string; title: string; group: string; summary: string }): Promise<{ html: string; meta: SheetMeta }> {
  await document.fonts.ready;
  const sheet = document.querySelector<HTMLElement>("[data-spec-sheet]");
  if (!sheet) throw new Error("no spec sheet on this page");

  const demos = [...sheet.querySelectorAll<HTMLElement>("[data-figma-demo]")];
  const opened: string[][] = [];
  for (const demo of demos) {
    if (demo.offsetParent === null) {
      opened.push([]);
      continue;
    }
    demo.scrollIntoView({ block: "center" });
    await sleep(120);
    opened.push(await openCopies(demo));
  }
  window.scrollTo(0, 0);
  await sleep(200);

  const meta: SheetMeta = { ...info, sets: [] };
  for (const set of sheet.querySelectorAll<HTMLElement>("[data-spec-set]")) {
    const box = set.getBoundingClientRect();
    meta.sets.push({ n: set.dataset.specSet ?? "", w: round(box.width), h: round(box.height), ...JSON.parse(set.dataset.specAxes ?? "{}") });
  }

  // Figma's importer drops CSS outlines, which is how the focus ring is drawn. Each
  // forced-focus control gets its ring as a real element instead.
  const rings: HTMLElement[] = [];
  for (const el of sheet.querySelectorAll<HTMLElement>(".is-focus")) {
    const cs = getComputedStyle(el);
    const width = parseFloat(cs.outlineWidth) || 0;
    if (cs.outlineStyle === "none" || width <= 0 || toRGBA(cs.outlineColor)[3] < 0.05) continue;
    const reach = width + (parseFloat(cs.outlineOffset) || 0);
    const leaf = /^(INPUT|TEXTAREA|SELECT|IMG)$/.test(el.tagName);
    const host = leaf ? el.parentElement : el;
    if (!host) continue;
    const hostBox = host.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    const ring = document.createElement("span");
    ring.dataset.specRing = "";
    const corner = (v: string) => `${(parseFloat(v) || 0) + reach}px`;
    ring.setAttribute(
      "style",
      `position:absolute;pointer-events:none;box-sizing:border-box;left:${round(box.left - hostBox.left - host.clientLeft - reach)}px;top:${round(box.top - hostBox.top - host.clientTop - reach)}px;width:${round(box.width + reach * 2)}px;height:${round(box.height + reach * 2)}px;border:${width}px solid ${cs.outlineColor};border-radius:${corner(cs.borderTopLeftRadius)} ${corner(cs.borderTopRightRadius)} ${corner(cs.borderBottomRightRadius)} ${corner(cs.borderBottomLeftRadius)}`,
    );
    if (getComputedStyle(host).position === "static") host.style.position = "relative";
    host.appendChild(ring);
    rings.push(ring);
  }

  const clone = cloneWithState(sheet);
  rings.forEach((ring) => ring.remove());
  clone.classList.add("rovr-export");
  clone.querySelectorAll<HTMLElement>(".is-focus").forEach((el) => (el.style.outline = "none"));
  [...clone.querySelectorAll<HTMLElement>("[data-figma-demo]")].forEach((demo, i) => {
    for (const html of opened[i] ?? []) {
      const wrap = document.createElement("div");
      wrap.setAttribute("style", "grid-column:2;display:flex;flex-direction:column;align-items:flex-start;gap:12px");
      wrap.innerHTML = `<span class="text-caption text-subtle-foreground">Open</span>${html}`;
      demo.after(wrap);
    }
  });
  // The sheet carries its own description into Figma as one line of tiny text, which the
  // script that tidies the import reads and then removes (figma/process.js).
  clone.style.position = "relative";
  const tag = document.createElement("div");
  tag.setAttribute("style", "position:absolute;left:56px;bottom:10px;font-size:4px;line-height:5px;white-space:nowrap;color:rgba(0,0,0,0.04)");
  tag.textContent = `ROVRMETA${JSON.stringify(meta)}`;
  clone.appendChild(tag);
  // The Preview / Code switch means nothing in a static copy.
  clone.querySelectorAll("[data-demo-switch]").forEach((el) => el.remove());

  const css = await pageCss();
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeAttr(info.title)}</title>
<style>${css}</style>
<style>
  *, *::before, *::after { animation: none !important; transition: none !important; }
  body { margin: 0; width: max-content; }
</style>
</head>
<body>
${clone.outerHTML}
</body>
</html>`;
  return { html, meta };
}
