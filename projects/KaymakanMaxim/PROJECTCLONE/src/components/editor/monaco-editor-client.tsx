"use client";

import Editor from "@monaco-editor/react";

import { monacoThemeMap } from "@/lib/theme-config";
import { useEditorStore } from "@/store/use-editor-store";

export default function MonacoEditorClient() {
  const code = useEditorStore((state) => state.code);
  const language = useEditorStore((state) => state.language);
  const theme = useEditorStore((state) => state.theme);
  const showLineNumbers = useEditorStore((state) => state.showLineNumbers);
  const setCode = useEditorStore((state) => state.setCode);

  return (
    <Editor
      height="100%"
      defaultLanguage="typescript"
      language={language}
      value={code}
      beforeMount={(monaco) => {
        monaco.editor.defineTheme("carbon-night", {
          base: "vs-dark",
          inherit: true,
          rules: [],
          colors: {
            "editor.background": "#0b1220",
            "editorLineNumber.foreground": "#54617d",
            "editorLineNumber.activeForeground": "#94a3b8",
          },
        });
        monaco.editor.defineTheme("carbon-light", {
          base: "vs",
          inherit: true,
          rules: [],
          colors: {
            "editor.background": "#f8fafc",
            "editorLineNumber.foreground": "#94a3b8",
            "editorLineNumber.activeForeground": "#475569",
          },
        });
        monaco.editor.defineTheme("carbon-deep", {
          base: "hc-black",
          inherit: true,
          rules: [],
          colors: {
            "editor.background": "#111827",
            "editorLineNumber.foreground": "#6b7280",
            "editorLineNumber.activeForeground": "#d1d5db",
          },
        });
      }}
      theme={monacoThemeMap[theme]}
      loading={
        <div className="flex h-full min-h-[320px] items-center justify-center rounded-[22px] border border-white/10 bg-[#0b1220] text-sm text-slate-400">
          Loading editor...
        </div>
      }
      onChange={(value) => setCode(value ?? "")}
      options={{
        automaticLayout: true,
        contextmenu: false,
        fontFamily:
          '"SFMono-Regular", "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", monospace',
        fontLigatures: true,
        fontSize: 15,
        lineHeight: 24,
        lineNumbers: showLineNumbers ? "on" : "off",
        minimap: { enabled: false },
        overviewRulerBorder: false,
        padding: { top: 20, bottom: 20 },
        renderLineHighlight: "none",
        roundedSelection: true,
        scrollBeyondLastLine: false,
        scrollbar: {
          horizontalScrollbarSize: 8,
          verticalScrollbarSize: 8,
        },
        smoothScrolling: true,
        tabSize: 2,
      }}
    />
  );
}
