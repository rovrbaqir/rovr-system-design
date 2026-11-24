import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

/** Dev only: the showcase posts each page's Figma export here and it is written to figma/data/. */
function figmaExport(): Plugin {
  return {
    name: "rovr-figma-export",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__figma/save", (req, res) => {
        const params = new URL(req.url ?? "", "http://localhost").searchParams;
        const name = params.get("name") ?? "";
        const html = params.get("kind") === "html";
        if (req.method !== "POST" || !/^[\w-]+$/.test(name)) {
          res.statusCode = 400;
          res.end("bad request");
          return;
        }
        const chunks: Buffer[] = [];
        req.on("data", (c: Buffer) => chunks.push(c));
        req.on("end", () => {
          const dir = path.resolve(root, html ? "figma/html" : "figma/data");
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, `${name}.${html ? "html" : "json"}`), Buffer.concat(chunks));
          res.end("ok");
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), figmaExport()],
  resolve: { alias: { "@": path.resolve(root, "src") } },
  // The folder name contains ":" (shown as "/" in Finder), which Vite's file
  // allow-list check mis-parses, so the strict check is off for local dev.
  // figma/ holds generated exports: writing them must not reload the page that is producing them.
  server: { port: 5199, strictPort: true, fs: { strict: false }, watch: { ignored: ["**/figma/**"] } },
});
