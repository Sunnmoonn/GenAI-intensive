import type { BackgroundStyle, EditorTheme } from "@/types/editor";

export const editorThemeLabelMap: Record<EditorTheme, string> = {
  night: "Night",
  light: "Light",
  carbon: "Carbon",
};

export const monacoThemeMap: Record<EditorTheme, string> = {
  night: "carbon-night",
  light: "carbon-light",
  carbon: "carbon-deep",
};

export const previewThemeMap: Record<
  EditorTheme,
  {
    window: string;
    code: string;
    lineNumbers: string;
    filename: string;
    border: string;
  }
> = {
  night: {
    window: "#0f172a",
    code: "#e5e7eb",
    lineNumbers: "#64748b",
    filename: "#94a3b8",
    border: "rgba(255,255,255,0.08)",
  },
  light: {
    window: "#f8fafc",
    code: "#0f172a",
    lineNumbers: "#94a3b8",
    filename: "#475569",
    border: "rgba(15,23,42,0.08)",
  },
  carbon: {
    window: "#111827",
    code: "#d1d5db",
    lineNumbers: "#6b7280",
    filename: "#9ca3af",
    border: "rgba(255,255,255,0.08)",
  },
};

export const backgroundStyleMap: Record<BackgroundStyle, string> = {
  sunset:
    "linear-gradient(135deg, #f97316 0%, #fb7185 48%, #38bdf8 100%)",
  aurora:
    "linear-gradient(135deg, #22c55e 0%, #14b8a6 35%, #3b82f6 100%)",
  ocean:
    "linear-gradient(135deg, #0f172a 0%, #1d4ed8 45%, #38bdf8 100%)",
  cream: "#f3e8d1",
  slate: "#1f2937",
};

export const backgroundLabelMap: Record<BackgroundStyle, string> = {
  sunset: "Sunset",
  aurora: "Aurora",
  ocean: "Ocean",
  cream: "Cream",
  slate: "Slate",
};
