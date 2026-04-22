import type { EditorLanguage } from "@/types/editor";

export const languageLabelMap: Record<EditorLanguage, string> = {
  typescript: "TypeScript",
  javascript: "JavaScript",
  json: "JSON",
  html: "HTML",
  css: "CSS",
};

export const languageFilenameMap: Record<EditorLanguage, string> = {
  typescript: "app.tsx",
  javascript: "app.jsx",
  json: "config.json",
  html: "index.html",
  css: "styles.css",
};
