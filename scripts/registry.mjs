// Generates registry.json from the component sources, so the registry never drifts from the code.
import fs from "node:fs";
import path from "node:path";

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const versions = { ...pkg.dependencies };
const items = [];

const describe = (file) => {
  const src = fs.readFileSync(file, "utf8");
  const deps = new Set();
  const registryDeps = new Set();
  for (const [, spec] of src.matchAll(/from\s+"([^"]+)"/g)) {
    if (spec.startsWith("@/components/ui/") || spec.startsWith("@/components/patterns/")) registryDeps.add("@rovr/" + spec.split("/").pop());
    else if (spec.startsWith("./")) registryDeps.add("@rovr/" + spec.slice(2));
    else if (spec === "@/lib/utils") registryDeps.add("@rovr/utils");
    else if (spec === "@/lib/motion") registryDeps.add("@rovr/motion-tokens");
    else if (!spec.startsWith("@/") && spec !== "react") {
      const name = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];
      if (versions[name]) deps.add(name);
    }
  }
  return { deps: [...deps].sort(), registryDeps: [...registryDeps].sort() };
};

for (const [dir, type] of [["src/components/ui", "registry:ui"], ["src/components/patterns", "registry:block"]]) {
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".tsx")).sort()) {
    const file = path.join(dir, f);
    const name = f.replace(".tsx", "");
    const { deps, registryDeps } = describe(file);
    items.push({
      name,
      type,
      title: name.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" "),
      dependencies: deps,
      registryDependencies: ["@rovr/theme", ...registryDeps],
      files: [{ path: file, type: type === "registry:block" ? "registry:component" : "registry:ui" }],
    });
  }
}

items.unshift(
  {
    name: "theme",
    type: "registry:style",
    title: "RoVR theme",
    description: "Design tokens: colour, type, radius, density and motion. Install once per app.",
    dependencies: ["@fontsource-variable/dm-sans", "@fontsource/dm-mono", "tailwindcss"],
    files: [{ path: "src/styles/rovr.css", type: "registry:file", target: "src/styles/rovr.css" }],
  },
  {
    name: "utils",
    type: "registry:lib",
    title: "Utils",
    dependencies: ["clsx", "tailwind-merge"],
    files: [{ path: "src/lib/utils.ts", type: "registry:lib" }],
  },
  {
    name: "motion-tokens",
    type: "registry:lib",
    title: "Motion tokens",
    dependencies: ["motion"],
    files: [{ path: "src/lib/motion.ts", type: "registry:lib" }],
  },
);

fs.writeFileSync(
  "registry.json",
  JSON.stringify({ $schema: "https://ui.shadcn.com/schema/registry.json", name: "rovr", homepage: "https://rovrstack.ai", items }, null, 2) + "\n",
);
console.log(`registry.json: ${items.length} items`);
