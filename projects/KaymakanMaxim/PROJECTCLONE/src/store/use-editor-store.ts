"use client";

import { create } from "zustand";

import { languageFilenameMap } from "@/lib/editor-config";
import { starterSnippet } from "@/lib/starter-snippet";
import type { EditorActions, EditorState } from "@/types/editor";

type EditorStore = EditorState & EditorActions;

export const useEditorStore = create<EditorStore>((set) => ({
  code: starterSnippet,
  language: "typescript",
  theme: "night",
  filename: languageFilenameMap.typescript,
  showLineNumbers: true,
  showWindowFrame: true,
  backgroundMode: "gradient",
  backgroundStyle: "sunset",
  padding: 40,
  radius: 32,
  shadow: 28,
  setCode: (code) => set({ code }),
  setLanguage: (language) =>
    set({
      language,
      filename: languageFilenameMap[language],
    }),
  setTheme: (theme) => set({ theme }),
  setShowLineNumbers: (showLineNumbers) => set({ showLineNumbers }),
  setShowWindowFrame: (showWindowFrame) => set({ showWindowFrame }),
  setBackgroundMode: (backgroundMode) => set({ backgroundMode }),
  setBackgroundStyle: (backgroundStyle) => set({ backgroundStyle }),
  setPadding: (padding) => set({ padding }),
  setRadius: (radius) => set({ radius }),
  setShadow: (shadow) => set({ shadow }),
}));
