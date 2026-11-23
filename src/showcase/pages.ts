import type { DocPage, PageGroup } from "./types";

const modules = import.meta.glob<{ page?: DocPage; pages?: DocPage[] }>("./pages/*.tsx", { eager: true });

export const groups: PageGroup[] = ["Get started", "Foundations", "Components", "Examples"];

/** Every page, in sidebar order. */
export const pages: DocPage[] = Object.values(modules)
  .flatMap((m) => m.pages ?? (m.page ? [m.page] : []))
  .sort(
    (a, b) =>
      groups.indexOf(a.group) - groups.indexOf(b.group) ||
      (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER) ||
      a.title.localeCompare(b.title),
  );

export const pagesIn = (group: PageGroup) => pages.filter((p) => p.group === group);
export const findPage = (slug: string) => pages.find((p) => p.slug === slug);
/** Only base components are shared through the registry. Examples are built per project. */
export const isInstallable = (page: DocPage) => page.group === "Components";
