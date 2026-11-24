// Posts page snapshots to Figma's HTML importer. Usage: node figma/post.mjs slug=uploadId [slug=uploadId ...]
// Each uploadId comes from one html_to_figma call made for that page's section. Results go to figma/imported.json.
import fs from "node:fs";
import path from "node:path";

const here = path.dirname(new URL(import.meta.url).pathname.replace(/%20/g, " "));
const out = path.join(here, "imported.json");
const done = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, "utf8")) : {};
const prompt = "bec711b5-a287-43d1-b1c1-2f7d529b6e7e";

for (const pair of process.argv.slice(2)) {
  const [slug, id] = pair.split("=");
  const html = fs.readFileSync(path.join(here, "html", `${slug}.html`));
  const url = `https://mcp.figma.com/mcp/html_to_figma/${id}/submit?promptId=${prompt}&cssSelector=.rovr-export`;
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "text/html" }, body: html });
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {}
    if (res.ok && json?.success) {
      done[slug] = json.nodeIds;
      console.log(`${slug}: ${json.nodeIds.length} frames`);
    } else console.log(`${slug}: FAILED ${res.status} ${text.slice(0, 300)}`);
  } catch (error) {
    console.log(`${slug}: FAILED ${error}`);
  }
  fs.writeFileSync(out, JSON.stringify(done, null, 1));
}
