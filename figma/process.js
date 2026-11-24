// Runs inside Figma (through Claude's Figma connector, see figma/README.md) after spec
// sheets have been imported with the HTML importer. For every imported sheet on the
// first page it:
//   1. reads the sheet's description from the ROVRMETA line and removes that line;
//   2. turns each grid of a "Props and states" section into a component set, one
//      variant per cell, named like `variant=primary, size=md, state=hover`;
//   3. applies the RoVR text styles (the importer has already bound colours to the variables);
//   4. moves the sheet to a page of its own, named after the component.
// It only touches frames that carry a ROVRMETA line.
const DOCS = "https://rovr-system-design.vercel.app/#/";
const LIMIT = typeof MAX === "number" ? MAX : 99;
const home = figma.root.children[0];
const report = [];
const near = (a, b, t) => Math.abs(a - b) <= t;

const styles = (await figma.getLocalTextStylesAsync()).filter((s) => s.name.startsWith("RoVR/"));

const sheets = home.children.filter((n) => n.type === "FRAME" && n.findOne((t) => t.type === "TEXT" && t.characters.startsWith("ROVRMETA")));
for (const root of sheets.slice(0, LIMIT)) {
  const tag = root.findOne((t) => t.type === "TEXT" && t.characters.startsWith("ROVRMETA"));
  const meta = JSON.parse(tag.characters.slice(8));
  let holder = tag;
  while (holder.parent !== root && holder.parent.children.length === 1) holder = holder.parent;
  holder.remove();
  const out = { slug: meta.slug, sets: [], styled: 0, notes: [] };

  const texts = root.findAllWithCriteria({ types: ["TEXT"] });
  const seen = {};
  for (const t of texts) {
    for (const f of t.characters.length ? t.getRangeAllFontNames(0, t.characters.length) : []) {
      const k = f.family + "|" + f.style;
      if (!seen[k]) {
        seen[k] = true;
        await figma.loadFontAsync(f);
      }
    }
  }

  // 3. text styles (the importer binds colours to the variables itself)
  for (const n of texts) {
    if (n.type === "TEXT" && n.fontName !== figma.mixed && n.fontSize !== figma.mixed && n.lineHeight !== figma.mixed && n.lineHeight.unit === "PIXELS" && n.fontName.family === "DM Sans") {
      const ls = n.letterSpacing !== figma.mixed && n.letterSpacing.unit === "PIXELS" ? n.letterSpacing.value : 0;
      const s = styles.find((st) => st.fontName.style === n.fontName.style && st.fontSize === n.fontSize && near(st.lineHeight.value, n.lineHeight.value, 0.6) && near(st.letterSpacing.value, ls, 0.06));
      if (s) {
        await n.setTextStyleIdAsync(s.id);
        out.styled++;
      }
    }
  }

  // A 1px inset ring drawn with box-shadow arrives as an inner shadow with spread, which
  // Figma only draws on clipped frames. An inside stroke is the same thing, and editable.
  for (const n of root.findAll((x) => "effects" in x && x.effects.length > 0 && "strokes" in x && x.strokes.length === 0)) {
    const ring = n.effects.find((e) => e.type === "INNER_SHADOW" && e.visible !== false && e.radius === 0 && e.offset.x === 0 && e.offset.y === 0 && e.spread > 0);
    if (!ring) continue;
    n.effects = n.effects.filter((e) => e !== ring);
    n.strokes = [{ type: "SOLID", color: { r: ring.color.r, g: ring.color.g, b: ring.color.b }, opacity: ring.color.a }];
    n.strokeWeight = ring.spread;
    n.strokeAlign = "INSIDE";
    out.rings = (out.rings || 0) + 1;
  }

  // 2. component sets
  const used = {};
  const frames = root.findAllWithCriteria({ types: ["FRAME"] });
  for (const set of meta.sets) {
    const cols = Math.max(1, set.groups.length) * set.states.length;
    const grid = frames.find((f) => !used[f.id] && !f.removed && near(f.width, set.w, 3) && near(f.height, set.h, 3) && f.children.length === set.rows.length && f.children.every((r) => "children" in r && r.children.length === cols));
    if (!grid) {
      out.notes.push("grid not found: " + set.n);
      continue;
    }
    used[grid.id] = true;
    const gx = grid.absoluteBoundingBox.x;
    const gy = grid.absoluteBoundingBox.y;
    const comps = [];
    const at = [];
    set.rows.forEach((row, r) => {
      const cells = grid.children[r].children;
      const groups = set.groups.length ? set.groups : [""];
      groups.forEach((group, g) => {
        set.states.forEach((state, s) => {
          const cell = cells[g * set.states.length + s];
          const control = "children" in cell && cell.children.length === 1 && cell.children[0].type === "FRAME" ? cell.children[0] : cell;
          const box = control.absoluteBoundingBox;
          const comp = figma.createComponentFromNode(control);
          comp.name = [set.rp + "=" + row, set.gp ? set.gp + "=" + group : "", "state=" + state].filter(Boolean).join(", ");
          comps.push(comp);
          at.push([box.x - gx, box.y - gy]);
        });
      });
    });
    const parent = grid.parent;
    const index = parent.children.indexOf(grid);
    const cs = figma.combineAsVariants(comps, parent, index);
    cs.name = set.n;
    cs.layoutMode = "NONE";
    cs.resize(grid.width, grid.height);
    comps.forEach((c, i) => {
      c.x = at[i][0];
      c.y = at[i][1];
    });
    cs.fills = [];
    cs.strokes = [{ type: "SOLID", color: { r: 0.592, g: 0.278, b: 1 } }];
    cs.strokeWeight = 1;
    cs.dashPattern = [6, 4];
    cs.cornerRadius = 10;
    cs.clipsContent = false;
    cs.description = meta.summary;
    cs.documentationLinks = [{ uri: DOCS + meta.slug }];
    grid.remove();
    out.sets.push({ name: set.n, id: cs.id, variants: comps.length });
  }

  // 4. a page of its own
  let page = figma.root.children.find((p) => p.name === meta.title);
  if (!page) {
    page = figma.createPage();
    page.name = meta.title;
  } else for (const stale of [...page.children]) stale.remove();
  page.appendChild(root);
  root.x = 0;
  root.y = 0;
  root.name = meta.title;
  out.page = page.id;
  out.root = root.id;
  out.group = meta.group;
  report.push(out);
}
return { done: report, left: sheets.length - report.length };
