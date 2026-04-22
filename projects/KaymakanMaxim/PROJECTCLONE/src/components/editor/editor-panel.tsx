"use client";

import { languageLabelMap } from "@/lib/editor-config";
import { editorThemeLabelMap } from "@/lib/theme-config";
import { MonacoEditorField } from "@/components/editor/monaco-editor-field";
import { useEditorStore } from "@/store/use-editor-store";

export function EditorPanel() {
  const language = useEditorStore((state) => state.language);
  const theme = useEditorStore((state) => state.theme);

  return (
    <section className="flex min-h-[420px] flex-col overflow-hidden rounded-[28px] border border-[var(--panel-border)] bg-[var(--panel)] shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold">Editor</h2>
          <p className="text-sm text-zinc-500">
            Monaco уже подключен. Любые изменения сразу попадают в preview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white">
            {languageLabelMap[language]}
          </div>
          <div className="rounded-full border border-zinc-900/10 bg-white/80 px-3 py-1 text-xs font-medium text-zinc-700">
            {editorThemeLabelMap[theme]}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-[#111827] p-4">
        <div className="h-full min-h-[320px] overflow-hidden rounded-[22px] border border-white/10 bg-[#0b1220] shadow-inner">
          <MonacoEditorField />
        </div>
      </div>
    </section>
  );
}
