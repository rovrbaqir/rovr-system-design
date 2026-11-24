// RoVR library builder. Runs inside Figma (plugin sandbox, or pasted into the
// Figma connector's "run code" tool). It rebuilds every example from the docs
// site as editable layers, one Figma page per component, and creates the
// colour variables, radius variables and text styles from the tokens.
//
// `DATA` is prepended by figma/build.mjs. Written in plain ES2017 on purpose:
// the plugin sandbox does not need a bundler this way.

var failures = 0;
var loadedFonts = {};
var colorVars = {};
var textStyles = {};

function post(type, text, extra) {
  var msg = { type: type, text: text };
  if (extra) for (var k in extra) msg[k] = extra[k];
  if (figma.ui) figma.ui.postMessage(msg);
}
function tick() {
  return new Promise(function (resolve) {
    setTimeout(resolve, 0);
  });
}
function rgb(c) {
  return { r: c[0], g: c[1], b: c[2] };
}
function key(c) {
  return [Math.round(c[0] * 255), Math.round(c[1] * 255), Math.round(c[2] * 255), Math.round(c[3] * 100)].join(",");
}

// ---- fonts -----------------------------------------------------------------

var WEIGHT_STYLES = {
  100: ["Thin", "ExtraLight", "Light", "Regular"],
  200: ["ExtraLight", "Extra Light", "Light", "Regular"],
  300: ["Light", "Regular"],
  400: ["Regular"],
  500: ["Medium", "Regular"],
  600: ["SemiBold", "Semi Bold", "Semibold", "Bold", "Medium"],
  700: ["Bold", "SemiBold", "Semi Bold"],
  800: ["ExtraBold", "Extra Bold", "Bold"],
  900: ["Black", "ExtraBold", "Bold"],
};

async function tryFont(family, style) {
  var id = family + "/" + style;
  if (loadedFonts[id] === true) return { family: family, style: style };
  if (loadedFonts[id] === false) return null;
  try {
    await figma.loadFontAsync({ family: family, style: style });
    loadedFonts[id] = true;
    return { family: family, style: style };
  } catch (e) {
    loadedFonts[id] = false;
    return null;
  }
}

/** The closest font Figma has for a CSS family, weight and slant. Falls back to Inter. */
async function fontFor(family, weight, italic) {
  var w = Math.min(900, Math.max(100, Math.round(weight / 100) * 100));
  var styles = WEIGHT_STYLES[w] || ["Regular"];
  var families = [family, "Inter"];
  for (var f = 0; f < families.length; f++) {
    if (italic) {
      for (var i = 0; i < styles.length; i++) {
        var slanted = await tryFont(families[f], styles[i] === "Regular" ? "Italic" : styles[i] + " Italic");
        if (slanted) return slanted;
      }
    }
    for (var j = 0; j < styles.length; j++) {
      var found = await tryFont(families[f], styles[j]);
      if (found) return found;
    }
  }
  return (await tryFont("Inter", "Regular")) || { family: "Inter", style: "Regular" };
}

// ---- tokens ----------------------------------------------------------------

var PREFERRED = ["foreground", "background", "surface", "primary", "primary-foreground", "muted-foreground", "subtle-foreground", "border", "border-strong", "secondary", "accent", "accent-foreground", "surface-sunken", "surface-raised", "brand", "ink"];

async function buildTokens(tokens) {
  var note = [];
  try {
    var existing = await figma.variables.getLocalVariableCollectionsAsync();
    var collection = null;
    var hasRadius = false;
    for (var e = 0; e < existing.length; e++) {
      if (existing[e].name === "RoVR colour") collection = existing[e];
      if (existing[e].name === "RoVR radius") hasRadius = true;
    }
    var byName = {};
    if (collection) {
      // Made by an earlier run: reuse them, so layers bound to them keep working.
      for (var x = 0; x < collection.variableIds.length; x++) {
        var known = await figma.variables.getVariableByIdAsync(collection.variableIds[x]);
        if (known) byName[known.name] = known;
      }
    } else {
      collection = figma.variables.createVariableCollection("RoVR colour");
      collection.renameMode(collection.modes[0].modeId, "Light");
      try {
        collection.addMode("Dark");
      } catch (err) {
        note.push("This Figma plan allows one variable mode, so only the light colours were created.");
      }
    }
    var light = collection.modes[0].modeId;
    var dark = collection.modes.length > 1 ? collection.modes[1].modeId : null;
    var ordered = tokens.colors.slice().sort(function (a, b) {
      var ia = PREFERRED.indexOf(a.name);
      var ib = PREFERRED.indexOf(b.name);
      return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib) || a.name.localeCompare(b.name);
    });
    for (var i = 0; i < ordered.length; i++) {
      var t = ordered[i];
      var v = byName[t.name];
      if (!v) {
        v = figma.variables.createVariable(t.name, collection, "COLOR");
        v.setValueForMode(light, { r: t.light[0], g: t.light[1], b: t.light[2], a: t.light[3] });
        if (dark) v.setValueForMode(dark, { r: t.dark[0], g: t.dark[1], b: t.dark[2], a: t.dark[3] });
      }
      var k = key(t.light);
      if (!colorVars[k]) colorVars[k] = v;
    }
    if (!hasRadius) {
      var radius = figma.variables.createVariableCollection("RoVR radius");
      for (var r = 0; r < tokens.radii.length; r++) {
        var rv = figma.variables.createVariable("radius-" + tokens.radii[r].name, radius, "FLOAT");
        rv.setValueForMode(radius.modes[0].modeId, tokens.radii[r].value);
      }
    }
  } catch (err2) {
    note.push("Variables were not created: " + err2);
  }

  try {
    var old = await figma.getLocalTextStylesAsync();
    var have = {};
    for (var o = 0; o < old.length; o++) have[old[o].name] = old[o];
    for (var s = 0; s < tokens.text.length; s++) {
      var ts = tokens.text[s];
      var style = have["RoVR/" + ts.name];
      if (!style) {
        var font = await fontFor(ts.family, ts.weight, false);
        style = figma.createTextStyle();
        style.name = "RoVR/" + ts.name;
        style.fontName = font;
        style.fontSize = ts.size;
        style.lineHeight = { unit: "PIXELS", value: ts.lineHeight };
        style.letterSpacing = { unit: "PIXELS", value: ts.letterSpacing };
      }
      textStyles[[ts.family, ts.weight, ts.size, ts.lineHeight, ts.letterSpacing].join("|")] = style;
    }
  } catch (err3) {
    note.push("Text styles were not created: " + err3);
  }
  return note;
}

function solid(c) {
  var paint = { type: "SOLID", color: rgb(c), opacity: c[3] };
  var variable = colorVars[key(c)];
  if (variable) {
    try {
      return figma.variables.setBoundVariableForPaint(paint, "color", variable);
    } catch (e) {
      return paint;
    }
  }
  return paint;
}

// ---- nodes -----------------------------------------------------------------

function paints(list) {
  var out = [];
  for (var i = 0; i < (list || []).length; i++) {
    var p = list[i];
    if (p.kind === "solid") out.push(solid(p.color));
    else if (p.kind === "image" && p.png) {
      try {
        var bytes = figma.base64Decode(p.png.slice(p.png.indexOf(",") + 1));
        out.push({ type: "IMAGE", scaleMode: "FILL", imageHash: figma.createImage(bytes).hash });
      } catch (e) {
        failures++;
      }
    }
  }
  return out;
}

/** Runs one step; a property Figma refuses is counted and skipped, never fatal. */
function safely(step) {
  try {
    step();
  } catch (e) {
    failures++;
  }
}

function applyFrame(frame, n) {
  frame.name = n.name || "frame";
  frame.resize(Math.max(n.w, 0.01), Math.max(n.h, 0.01));
  safely(function () {
    frame.fills = paints(n.fills);
  });
  frame.clipsContent = !!n.clip;
  if (n.radius) {
    safely(function () {
      frame.topLeftRadius = n.radius[0];
      frame.topRightRadius = n.radius[1];
      frame.bottomRightRadius = n.radius[2];
      frame.bottomLeftRadius = n.radius[3];
    });
  }
  if (typeof n.opacity === "number") frame.opacity = n.opacity;

  var effects = [];
  var ring = null;
  var shadows = n.shadows || [];
  for (var i = 0; i < shadows.length; i++) {
    var s = shadows[i];
    // A shadow with no offset and no blur is a ring: CSS's way of drawing a border.
    if (s.blur === 0 && s.x === 0 && s.y === 0 && s.spread > 0) {
      if (!ring && !n.stroke) ring = s;
      continue;
    }
    effects.push({ type: s.inset ? "INNER_SHADOW" : "DROP_SHADOW", color: { r: s.color[0], g: s.color[1], b: s.color[2], a: s.color[3] }, offset: { x: s.x, y: s.y }, radius: Math.max(0, s.blur), spread: s.spread, visible: true, blendMode: "NORMAL" });
  }
  if (n.blur) effects.push({ type: "BACKGROUND_BLUR", radius: n.blur, visible: true });
  if (effects.length) {
    try {
      frame.effects = effects;
    } catch (e) {
      // Spread is not allowed on every node: keep the shadows without it.
      try {
        frame.effects = effects.map(function (fx) {
          if (fx.type === "BACKGROUND_BLUR") return fx;
          return { type: fx.type, color: fx.color, offset: fx.offset, radius: fx.radius, visible: true, blendMode: "NORMAL" };
        });
      } catch (e2) {
        failures++;
      }
    }
  }

  safely(function () {
    applyStroke(frame, n, ring);
  });
}

function applyStroke(frame, n, ring) {
  if (n.stroke) {
    frame.strokes = [solid(n.stroke.color)];
    frame.strokeAlign = "INSIDE";
    var st = n.stroke;
    if (st.top === st.right && st.top === st.bottom && st.top === st.left) frame.strokeWeight = st.top;
    else {
      frame.strokeWeight = Math.max(st.top, st.right, st.bottom, st.left);
      frame.strokeTopWeight = st.top;
      frame.strokeRightWeight = st.right;
      frame.strokeBottomWeight = st.bottom;
      frame.strokeLeftWeight = st.left;
    }
    if (st.dashed) frame.dashPattern = [4, 4];
  } else if (ring) {
    frame.strokes = [solid(ring.color)];
    frame.strokeAlign = ring.inset ? "INSIDE" : "OUTSIDE";
    frame.strokeWeight = ring.spread;
  } else frame.strokes = [];
}

/**
 * `asComponent` makes the frame a Figma component, so each example and each
 * open popup shows up in the Assets panel and can be dragged into a design.
 */
async function buildNode(n, parent, asComponent) {
  try {
    if (n.t === "F") {
      var frame = asComponent ? figma.createComponent() : figma.createFrame();
      parent.appendChild(frame);
      applyFrame(frame, n);
      frame.x = n.x;
      frame.y = n.y;
      var kids = n.c || [];
      for (var i = 0; i < kids.length; i++) await buildNode(kids[i], frame);
      return frame;
    }
    if (n.t === "T") {
      var font = await fontFor(n.font.family, n.font.weight, n.font.italic);
      var text = figma.createText();
      parent.appendChild(text);
      text.fontName = font;
      text.fontSize = Math.max(1, n.font.size);
      text.lineHeight = { unit: "PIXELS", value: Math.max(1, n.font.lineHeight) };
      text.letterSpacing = { unit: "PIXELS", value: n.font.letterSpacing || 0 };
      text.characters = n.text;
      text.fills = [solid(n.color)];
      text.textAlignHorizontal = n.align || "LEFT";
      if (n.underline) text.textDecoration = "UNDERLINE";
      text.name = n.name || n.text;
      var lh = Math.max(1, n.font.lineHeight);
      var lines = Math.max(1, Math.round(n.h / lh));
      if (n.wrap) {
        text.textAutoResize = "HEIGHT";
        text.resize(Math.max(1, Math.ceil(n.w) + 1), Math.max(1, n.h));
        text.x = n.x;
      } else {
        text.textAutoResize = "WIDTH_AND_HEIGHT";
        // Figma may measure a hair wider or narrower than the browser: keep the alignment anchor.
        text.x = n.align === "CENTER" ? n.x + (n.w - text.width) / 2 : n.align === "RIGHT" ? n.x + n.w - text.width : n.x;
      }
      // The browser reports the glyph box, Figma positions the line box.
      text.y = n.y + (n.h - lines * lh) / 2;
      var style = textStyles[[n.font.family, n.font.weight, n.font.size, n.font.lineHeight, n.font.letterSpacing].join("|")];
      if (style && !n.font.italic) {
        try {
          await text.setTextStyleIdAsync(style.id);
        } catch (e) {}
      }
      return text;
    }
    if (n.t === "S") {
      var vector;
      try {
        vector = figma.createNodeFromSvg(n.svg);
      } catch (svgError) {
        // Figma's SVG import is stricter than a browser. Text is the usual cause: retry without it.
        vector = figma.createNodeFromSvg(n.svg.replace(/<text[\s\S]*?<\/text>/g, ""));
      }
      parent.appendChild(vector);
      vector.name = n.name || "vector";
      vector.x = n.x;
      vector.y = n.y;
      if (n.w >= 0.01 && n.h >= 0.01 && (Math.abs(vector.width - n.w) > 0.5 || Math.abs(vector.height - n.h) > 0.5)) vector.resize(n.w, n.h);
      if (typeof n.opacity === "number") vector.opacity = n.opacity;
      return vector;
    }
  } catch (e) {
    failures++;
  }
  return null;
}

async function label(parent, value, size, weight, color, x, y, width) {
  var text = figma.createText();
  parent.appendChild(text);
  text.fontName = await fontFor("DM Sans", weight, false);
  text.fontSize = size;
  text.lineHeight = { unit: "PIXELS", value: Math.round(size * 1.4) };
  text.characters = value;
  text.fills = [solid(color)];
  text.x = x;
  text.y = y;
  if (width) {
    text.textAutoResize = "HEIGHT";
    text.resize(width, text.height);
  }
  return text;
}

var INK = [21 / 255, 33 / 255, 99 / 255, 1];
var MUTED = [91 / 255, 99 / 255, 133 / 255, 1];

var PAGE_NAMES = ["Foundations", "Components", "Examples"];
var SECTION_PAD = 64;
var BUILT = "rovr-built";

/** One of the three pages, by name. Free Figma plans allow three pages, so components live in sections. */
function pageNamed(name) {
  var pages = figma.root.children;
  for (var i = 0; i < pages.length; i++) if (pages[i].name === name) return pages[i];
  // A new file starts with an empty "Page 1": use it, since free plans only allow three pages.
  for (var j = 0; j < pages.length; j++) {
    if (PAGE_NAMES.indexOf(pages[j].name) < 0 && pages[j].children.length === 0) {
      pages[j].name = name;
      return pages[j];
    }
  }
  try {
    var page = figma.createPage();
    page.name = name;
    return page;
  } catch (e) {
    // No pages left on this plan: share the first one.
    return figma.root.children[0];
  }
}

function sectionNamed(page, name) {
  for (var i = 0; i < page.children.length; i++) {
    var child = page.children[i];
    if (child.type === "SECTION" && child.name === name) return child;
  }
  var section = figma.createSection();
  page.appendChild(section);
  section.name = name;
  return section;
}

/** Lays one component out inside its section: heading, summary, then each example with its label. */
async function fillSection(section, data, frames) {
  var width = 640;
  for (var w = 0; w < frames.length; w++) width = Math.max(width, frames[w].node ? frames[w].node.width : 0);
  var y = SECTION_PAD;
  var title = await label(section, data.title, 40, 500, INK, SECTION_PAD, y, width);
  y += title.height + 12;
  var summary = await label(section, data.summary, 16, 400, MUTED, SECTION_PAD, y, width);
  y += summary.height + 56;
  var right = SECTION_PAD + width;
  for (var i = 0; i < frames.length; i++) {
    var item = frames[i];
    if (item.heading) {
      var heading = await label(section, item.heading, 18, 600, INK, SECTION_PAD, y, width);
      y += heading.height + 4;
      if (item.note) {
        var note = await label(section, item.note, 13, 400, MUTED, SECTION_PAD, y, width);
        y += note.height + 4;
      }
      y += 12;
    }
    var rowHeight = 0;
    var x = SECTION_PAD;
    var row = [item.node].concat(item.extra || []);
    for (var r = 0; r < row.length; r++) {
      var node = row[r];
      if (!node) continue;
      section.appendChild(node);
      node.x = x;
      node.y = y;
      x += node.width + 64;
      rowHeight = Math.max(rowHeight, node.height);
      right = Math.max(right, x - 64);
    }
    y += rowHeight + 72;
  }
  section.resizeWithoutConstraints(right + SECTION_PAD, y - 72 + SECTION_PAD);
}

/** Builds a component's examples from the exported layer data. */
async function buildFromData(section, data) {
  var frames = [];
  for (var i = 0; i < data.demos.length; i++) {
    var demo = data.demos[i];
    var root = await buildNode({ t: "F", name: data.title + "/" + demo.title, x: 0, y: 0, w: demo.node.w, h: demo.node.h, fills: demo.node.fills, stroke: demo.node.stroke, radius: demo.node.radius, shadows: demo.node.shadows, clip: demo.node.clip, c: demo.node.c }, section, true);
    var extra = [];
    for (var o = 0; o < demo.overlays.length; o++) {
      var over = demo.overlays[o];
      var built = await buildNode({ t: "F", name: data.title + "/" + demo.title + "/" + over.name.replace("Open: ", "Open ") + (demo.overlays.length > 1 ? " " + (o + 1) : ""), x: 0, y: 0, w: over.w, h: over.h, fills: over.fills, stroke: over.stroke, radius: over.radius, shadows: over.shadows, blur: over.blur, clip: over.clip, c: over.c }, section, true);
      if (built) extra.push(built);
    }
    frames.push({ heading: demo.title, note: demo.note, node: root, extra: extra });
    await tick();
  }
  await fillSection(section, data, frames);
}

/**
 * Some components were already brought in through Figma's HTML importer, which
 * keeps auto-layout. Those frames sit loose on the page: move them into their
 * section, name them, and make them components. Returns false if none are left.
 */
async function adoptImported(section, data, ids, names) {
  var frames = [];
  for (var i = 0; i < ids.length; i++) {
    var node = null;
    try {
      node = await figma.getNodeByIdAsync(ids[i]);
    } catch (e) {}
    if (!node || node.removed) continue;
    var name = names[i] || data.title + "/" + (i + 1);
    try {
      if (node.type === "FRAME") node = figma.createComponentFromNode(node);
    } catch (e2) {}
    node.name = name;
    var parts = name.split("/");
    var isPopup = parts.length > 2;
    if (isPopup && frames.length) frames[frames.length - 1].extra.push(node);
    else frames.push({ heading: parts[1] || name, note: "", node: node, extra: [] });
  }
  if (frames.length === 0) return false;
  await fillSection(section, data, frames);
  return true;
}

/** Places a page's sections in rows so nothing overlaps. */
function arrange(page) {
  var sections = [];
  for (var i = 0; i < page.children.length; i++) if (page.children[i].type === "SECTION") sections.push(page.children[i]);
  var x = 0;
  var y = 0;
  var rowHeight = 0;
  var limit = 9000;
  for (var s = 0; s < sections.length; s++) {
    var section = sections[s];
    if (x > 0 && x + section.width > limit) {
      x = 0;
      y += rowHeight + 240;
      rowHeight = 0;
    }
    section.x = x;
    section.y = y;
    x += section.width + 240;
    rowHeight = Math.max(rowHeight, section.height);
  }
}

async function buildLibrary(replace) {
  failures = 0;
  await fontFor("DM Sans", 400, false);
  post("progress", "Creating variables and text styles");
  var notes = await buildTokens(DATA.tokens);
  var imported = DATA.imported || {};
  var names = DATA.names || {};

  var links = {};
  var done = 0;
  var adopted = 0;
  var skipped = 0;
  for (var g = 0; g < PAGE_NAMES.length; g++) {
    var inGroup = DATA.pages.filter(function (pg) {
      return pg.group === PAGE_NAMES[g];
    });
    if (inGroup.length === 0) continue;
    var page = pageNamed(PAGE_NAMES[g]);
    await figma.setCurrentPageAsync(page);
    for (var i = 0; i < inGroup.length; i++) {
      var data = inGroup[i];
      post("progress", "Building " + data.title + " (" + (done + 1) + " of " + DATA.pages.length + ")");
      var section = sectionNamed(page, data.title);
      links[data.slug] = section.id;
      var mine = section.getPluginData(BUILT) === "yes";
      if (section.children.length > 0 && !(mine && replace)) {
        // Already filled, by an earlier run or by hand: leave it alone.
        skipped++;
      } else {
        if (mine) {
          var old = section.children.slice();
          for (var c = 0; c < old.length; c++) old[c].remove();
        }
        var took = false;
        if (imported[data.slug]) took = await adoptImported(section, data, imported[data.slug], names[data.slug] || []);
        if (took) adopted++;
        else {
          await buildFromData(section, data);
          section.setPluginData(BUILT, "yes");
        }
      }
      done++;
      await tick();
    }
    arrange(page);
  }

  var out = { file: figma.fileKey ? "https://www.figma.com/design/" + figma.fileKey : "", pages: links };
  var summary = "Done: " + (done - skipped - adopted) + " components built, " + adopted + " already-imported ones tidied, " + skipped + " left as they were." + (failures ? " " + failures + " layers could not be created and were skipped." : "") + (notes.length ? " " + notes.join(" ") : "");
  post("done", summary, { links: JSON.stringify(out, null, 2) });
  return { summary: summary, links: out };
}

// Plugin entry. When this file is pasted into the Figma connector instead,
// there is no UI: call `buildLibrary(true)` directly.
if (typeof __html__ !== "undefined") {
  figma.showUI(__html__, { width: 380, height: 440 });
  post("intro", "Builds " + DATA.pages.length + " components from the RoVR docs site in this file: three pages, one section per component. Sections that already have content are left alone.");
  figma.ui.onmessage = function (msg) {
    if (msg.type !== "build") return;
    buildLibrary(!!msg.replace).catch(function (error) {
      post("error", "Stopped: " + error);
    });
  };
}
