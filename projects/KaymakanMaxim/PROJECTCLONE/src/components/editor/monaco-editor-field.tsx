"use client";

import dynamic from "next/dynamic";

const MonacoEditorClient = dynamic(
  () => import("@/components/editor/monaco-editor-client"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-[22px] border border-white/10 bg-[#0b1220] text-sm text-slate-400">
        Loading editor...
      </div>
    ),
  },
);

export function MonacoEditorField() {
  return <MonacoEditorClient />;
}
