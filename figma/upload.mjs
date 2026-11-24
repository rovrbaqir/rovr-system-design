// Posts spec sheets to Figma's HTML importer. Usage: node figma/upload.mjs slug=uploadId [slug=uploadId ...]
// Each uploadId comes from one html_to_figma call (see figma/README.md). Results go to figma/sheets.json.
import fs from "node:fs";
import path from "node:path";

const here = path.dirname(new URL(import.meta.url).pathname.replace(/%20/g, " "));
const out = path.join(here, "sheets.json");
const done = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, "utf8")) : {};
const prompt = process.env.PROMPT_ID ?? "5b0c9d1e-3a47-4c1e-9f52-7d6a8e21c3f4";

await Promise.all(
  process.argv.slice(2).map(async (pair) => {
    const [slug, id] = pair.split("=");
    const html = fs.readFileSync(path.join(here, "html", `sheet-${slug}.html`));
    const url = `https://mcp.figma.com/mcp/html_to_figma/${id}/submit?promptId=${prompt}&cssSelector=.rovr-export`;
    try {
      let res = await fetch(url, { method: "POST", headers: { "Content-Type": "text/html" }, body: html });
      let text = await res.text();
      // The importer allows a few uploads at a time: wait as told and send the same thing again.
      for (let tries = 0; res.status === 429 && tries < 8; tries++) {
        await new Promise((r) => setTimeout(r, 3000 + tries * 2000));
        res = await fetch(url, { method: "POST", headers: { "Content-Type": "text/html" }, body: html });
        text = await res.text();
      }
      let json = null;
      try {
        json = JSON.parse(text);
      } catch {}
      if (res.ok && json?.success) {
        done[slug] = json.nodeIds[0];
        console.log(`${slug}: ${json.nodeIds.join(",")}`);
      } else console.log(`${slug}: FAILED ${res.status} ${text.slice(0, 300)}`);
    } catch (error) {
      console.log(`${slug}: FAILED ${error}`);
    }
  }),
);
fs.writeFileSync(out, JSON.stringify(done, null, 1));
