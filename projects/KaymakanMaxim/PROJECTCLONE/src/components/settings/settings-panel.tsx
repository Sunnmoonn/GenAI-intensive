"use client";

import { languageLabelMap } from "@/lib/editor-config";
import { backgroundLabelMap, editorThemeLabelMap } from "@/lib/theme-config";
import { useEditorStore } from "@/store/use-editor-store";
import type {
  BackgroundMode,
  BackgroundStyle,
  EditorLanguage,
  EditorTheme,
} from "@/types/editor";

const gradientBackgrounds: BackgroundStyle[] = ["sunset", "aurora", "ocean"];
const solidBackgrounds: BackgroundStyle[] = ["cream", "slate"];

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
      <p className="mt-1 text-xs text-zinc-500">{description}</p>
    </div>
  );
}

export function SettingsPanel() {
  const language = useEditorStore((state) => state.language);
  const theme = useEditorStore((state) => state.theme);
  const showLineNumbers = useEditorStore((state) => state.showLineNumbers);
  const showWindowFrame = useEditorStore((state) => state.showWindowFrame);
  const backgroundMode = useEditorStore((state) => state.backgroundMode);
  const backgroundStyle = useEditorStore((state) => state.backgroundStyle);
  const padding = useEditorStore((state) => state.padding);
  const radius = useEditorStore((state) => state.radius);
  const shadow = useEditorStore((state) => state.shadow);

  const setLanguage = useEditorStore((state) => state.setLanguage);
  const setTheme = useEditorStore((state) => state.setTheme);
  const setShowLineNumbers = useEditorStore((state) => state.setShowLineNumbers);
  const setShowWindowFrame = useEditorStore((state) => state.setShowWindowFrame);
  const setBackgroundMode = useEditorStore((state) => state.setBackgroundMode);
  const setBackgroundStyle = useEditorStore((state) => state.setBackgroundStyle);
  const setPadding = useEditorStore((state) => state.setPadding);
  const setRadius = useEditorStore((state) => state.setRadius);
  const setShadow = useEditorStore((state) => state.setShadow);

  const backgroundOptions =
    backgroundMode === "gradient" ? gradientBackgrounds : solidBackgrounds;

  return (
    <section className="flex flex-col gap-5 rounded-[28px] border border-[var(--panel-border)] bg-[var(--panel)] p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Settings</h2>
          <p className="text-sm text-zinc-500">
            Базовые визуальные контролы для MVP-скриншота.
          </p>
        </div>
        <div className="rounded-full border border-zinc-900/10 bg-white/80 px-3 py-1 text-xs font-medium text-zinc-600">
          Stage 2
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
        <div className="space-y-3">
          <SectionTitle
            title="Code Setup"
            description="Язык и тема редактора для текущего сниппета."
          />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-zinc-500">Language</span>
              <select
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value as EditorLanguage)
                }
              >
                {Object.entries(languageLabelMap).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-medium text-zinc-500">Theme</span>
              <select
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                value={theme}
                onChange={(event) => setTheme(event.target.value as EditorTheme)}
              >
                {Object.entries(editorThemeLabelMap).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <SectionTitle
            title="Layout Toggles"
            description="Переключатели line numbers и window frame."
          />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <label className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3">
              <span className="text-sm font-medium text-zinc-800">Line numbers</span>
              <input
                type="checkbox"
                className="h-4 w-4 accent-zinc-900"
                checked={showLineNumbers}
                onChange={(event) => setShowLineNumbers(event.target.checked)}
              />
            </label>

            <label className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3">
              <span className="text-sm font-medium text-zinc-800">Window frame</span>
              <input
                type="checkbox"
                className="h-4 w-4 accent-zinc-900"
                checked={showWindowFrame}
                onChange={(event) => setShowWindowFrame(event.target.checked)}
              />
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <SectionTitle
            title="Background"
            description="Solid и gradient режимы с готовыми пресетами."
          />
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {(["gradient", "solid"] as BackgroundMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setBackgroundMode(mode);
                    setBackgroundStyle(mode === "gradient" ? "sunset" : "cream");
                  }}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    backgroundMode === mode
                      ? "bg-zinc-900 text-white"
                      : "bg-white text-zinc-700 ring-1 ring-zinc-200"
                  }`}
                >
                  {mode === "gradient" ? "Gradient" : "Solid"}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {backgroundOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setBackgroundStyle(item)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    backgroundStyle === item
                      ? "bg-zinc-900 text-white"
                      : "bg-white text-zinc-700 ring-1 ring-zinc-200"
                  }`}
                >
                  {backgroundLabelMap[item]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <SectionTitle
            title="Frame Controls"
            description="Padding, radius и shadow для экспортируемой карточки."
          />

          <label className="block space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-zinc-700">Padding</span>
              <span className="text-zinc-500">{padding}px</span>
            </div>
            <input
              type="range"
              min="24"
              max="72"
              step="4"
              value={padding}
              onChange={(event) => setPadding(Number(event.target.value))}
              className="w-full accent-zinc-900"
            />
          </label>

          <label className="block space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-zinc-700">Radius</span>
              <span className="text-zinc-500">{radius}px</span>
            </div>
            <input
              type="range"
              min="16"
              max="40"
              step="2"
              value={radius}
              onChange={(event) => setRadius(Number(event.target.value))}
              className="w-full accent-zinc-900"
            />
          </label>

          <label className="block space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-zinc-700">Shadow</span>
              <span className="text-zinc-500">{shadow}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="48"
              step="2"
              value={shadow}
              onChange={(event) => setShadow(Number(event.target.value))}
              className="w-full accent-zinc-900"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
