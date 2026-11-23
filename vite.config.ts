import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(root, "src") } },
  // The folder name contains ":" (shown as "/" in Finder), which Vite's file
  // allow-list check mis-parses, so the strict check is off for local dev.
  server: { port: 5199, strictPort: true, fs: { strict: false } },
});
