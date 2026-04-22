import { EditorPanel } from "@/components/editor/editor-panel";
import { PreviewPanel } from "@/components/preview/preview-panel";
import { SettingsPanel } from "@/components/settings/settings-panel";

export function WorkspaceShell() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.92),_transparent_32%),linear-gradient(135deg,_#f5efe2_0%,_#f3dfb7_45%,_#f0c48c_100%)] px-4 py-6 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col gap-4 rounded-[32px] border border-white/50 bg-white/25 p-4 shadow-[0_24px_80px_rgba(120,53,15,0.16)] backdrop-blur-xl lg:p-5">
        <header className="flex flex-col gap-2 rounded-[24px] border border-[var(--panel-border)] bg-[var(--panel)] px-5 py-4 backdrop-blur-md">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-amber-700/80">
            MVP Foundation
          </p>
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Carbon / Ray.so style code screenshot generator
              </h1>
              <p className="mt-1 max-w-3xl text-sm text-zinc-600 sm:text-base">
                Базовый editor уже работает. Теперь добавляем ключевые визуальные
                настройки для MVP: тему, фон, line numbers, window frame и frame
                controls.
              </p>
            </div>
            <div className="rounded-full border border-zinc-900/10 bg-white/70 px-4 py-2 text-sm font-medium text-zinc-700">
              Stage 2: Visual Settings
            </div>
          </div>
        </header>

        <section className="flex flex-1 flex-col gap-4">
          <PreviewPanel />
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
            <EditorPanel />
            <SettingsPanel />
          </div>
        </section>
      </div>
    </main>
  );
}
