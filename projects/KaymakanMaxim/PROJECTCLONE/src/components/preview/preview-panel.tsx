"use client";

import { useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { Copy, Download } from "lucide-react";
import { toBlob, toPng } from "html-to-image";

import { backgroundStyleMap, previewThemeMap } from "@/lib/theme-config";
import { useEditorStore } from "@/store/use-editor-store";

type PreviewArtworkProps = {
  backgroundStyle: string;
  code: string;
  filename: string;
  lineNumbers: number[];
  padding: number;
  previewTheme: {
    window: string;
    code: string;
    lineNumbers: string;
    filename: string;
    border: string;
  };
  radius: number;
  shadow: number;
  showLineNumbers: boolean;
  showWindowFrame: boolean;
  width: number;
};

function PreviewArtwork({
  backgroundStyle,
  code,
  filename,
  lineNumbers,
  padding,
  previewTheme,
  radius,
  shadow,
  showLineNumbers,
  showWindowFrame,
  width,
}: PreviewArtworkProps) {
  const innerRadius = Math.max(radius - 8, 16);
  const shellStyle: CSSProperties = {
    width,
    boxSizing: "border-box",
    borderRadius: radius,
    background: backgroundStyle,
    padding,
    boxShadow: `0 ${shadow}px ${shadow * 2.8}px rgba(15, 23, 42, 0.22)`,
    overflow: "hidden",
  };

  const windowStyle: CSSProperties = {
    background: previewTheme.window,
    borderRadius: innerRadius,
    boxShadow: `0 ${Math.max(shadow - 8, 12)}px ${Math.max(
      shadow * 1.8,
      32,
    )}px rgba(15, 23, 42, 0.35)`,
    overflow: "hidden",
  };

  const topBarStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 20px",
    borderBottom: `1px solid ${previewTheme.border}`,
  };

  const codeAreaStyle: CSSProperties = {
    padding: "20px",
    fontFamily:
      '"SFMono-Regular", "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    fontSize: 13,
    lineHeight: "24px",
  };

  const codeGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: showLineNumbers
      ? "auto minmax(0, 1fr)"
      : "minmax(0, 1fr)",
    columnGap: 16,
    alignItems: "start",
  };

  const codeBlockStyle: CSSProperties = {
    color: previewTheme.code,
    margin: 0,
    whiteSpace: "pre",
    overflowX: "visible",
  };

  return (
    <div style={shellStyle}>
      <div style={windowStyle}>
        {showWindowFrame ? (
          <div style={topBarStyle}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: "#ff5f57",
                display: "inline-block",
              }}
            />
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: "#febc2e",
                display: "inline-block",
              }}
            />
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: "#28c840",
                display: "inline-block",
              }}
            />
            <span
              style={{
                marginLeft: 12,
                fontSize: 12,
                fontWeight: 500,
                color: previewTheme.filename,
              }}
            >
              {filename}
            </span>
          </div>
        ) : null}

        <div style={codeAreaStyle}>
          <div style={codeGridStyle}>
            {showLineNumbers ? (
              <div
                style={{
                  color: previewTheme.lineNumbers,
                  textAlign: "right",
                  userSelect: "none",
                }}
              >
                {lineNumbers.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
            ) : null}

            <pre style={codeBlockStyle}>
              <code>{code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PreviewPanel() {
  const code = useEditorStore((state) => state.code);
  const filename = useEditorStore((state) => state.filename);
  const theme = useEditorStore((state) => state.theme);
  const showLineNumbers = useEditorStore((state) => state.showLineNumbers);
  const showWindowFrame = useEditorStore((state) => state.showWindowFrame);
  const backgroundStyle = useEditorStore((state) => state.backgroundStyle);
  const padding = useEditorStore((state) => state.padding);
  const radius = useEditorStore((state) => state.radius);
  const shadow = useEditorStore((state) => state.shadow);

  const visibleTargetRef = useRef<HTMLDivElement | null>(null);
  const exportTargetRef = useRef<HTMLDivElement | null>(null);

  const [isExporting, setIsExporting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const lineNumbers = useMemo(
    () => code.split("\n").map((_, index) => index + 1),
    [code],
  );

  const previewTheme = previewThemeMap[theme];
  const exportWidth = 860;
  const visibleWidth = 860;
  const exportInset = Math.max(shadow + 28, 40);

  const createExportOptions = () => {
    if (!exportTargetRef.current) {
      return null;
    }

    return {
      cacheBust: true,
      pixelRatio: 2,
      canvasWidth: exportWidth + exportInset * 2,
      skipAutoScale: true,
      fontEmbedCSS: "",
    };
  };

  const handleExportPng = async () => {
    const options = createExportOptions();

    if (!options || !exportTargetRef.current) {
      setStatusMessage("Export target not ready");
      return;
    }

    try {
      setIsExporting(true);
      setStatusMessage(null);

      const dataUrl = await toPng(exportTargetRef.current, options);
      const link = document.createElement("a");
      const safeName = filename.replace(/\.[^/.]+$/, "") || "carbon-shot";

      link.download = `${safeName}.png`;
      link.href = dataUrl;
      link.click();

      setStatusMessage("PNG exported");
    } catch {
      setStatusMessage("PNG export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyImage = async () => {
    const options = createExportOptions();

    if (!options || !exportTargetRef.current) {
      setStatusMessage("Export target not ready");
      return;
    }

    if (
      typeof navigator === "undefined" ||
      !navigator.clipboard ||
      typeof ClipboardItem === "undefined"
    ) {
      setStatusMessage("Clipboard image copy is not supported");
      return;
    }

    try {
      setIsCopying(true);
      setStatusMessage(null);

      const blob = await toBlob(exportTargetRef.current, options);

      if (!blob) {
        throw new Error("Blob generation failed");
      }

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": Promise.resolve(blob),
        }),
      ]);

      setStatusMessage("Image copied");
    } catch {
      setStatusMessage("Copy image is blocked in Safari. Use Export PNG.");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <>
      <section className="flex min-h-[620px] flex-col overflow-hidden rounded-[28px] border border-[var(--panel-border)] bg-[var(--panel)] shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-md">
        <div className="flex flex-col gap-3 border-b border-black/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Preview</h2>
            <p className="text-sm text-zinc-500">
              Отдельный export-friendly контейнер для будущего PNG.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyImage}
              disabled={isCopying || isExporting}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-900/10 bg-white/85 px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Copy className="h-3.5 w-3.5" />
              {isCopying ? "Copying..." : "Copy image"}
            </button>
            <button
              type="button"
              onClick={handleExportPng}
              disabled={isExporting || isCopying}
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download className="h-3.5 w-3.5" />
              {isExporting ? "Exporting..." : "Export PNG"}
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-4 p-6 sm:p-8 lg:p-10">
          {statusMessage ? (
            <div className="text-center text-xs font-medium text-zinc-500">
              {statusMessage}
            </div>
          ) : null}

          <div
            ref={visibleTargetRef}
            className="mx-auto flex w-full justify-center overflow-visible"
          >
            <PreviewArtwork
              backgroundStyle={backgroundStyleMap[backgroundStyle]}
              code={code}
              filename={filename}
              lineNumbers={lineNumbers}
              padding={padding}
              previewTheme={previewTheme}
              radius={radius}
              shadow={shadow}
              showLineNumbers={showLineNumbers}
              showWindowFrame={showWindowFrame}
              width={visibleWidth}
            />
          </div>
        </div>
      </section>

      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: -10000,
          top: 0,
          width: exportWidth + exportInset * 2,
          padding: exportInset,
          boxSizing: "border-box",
          background: "transparent",
          overflow: "visible",
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        <div ref={exportTargetRef}>
          <PreviewArtwork
            backgroundStyle={backgroundStyleMap[backgroundStyle]}
            code={code}
            filename={filename}
            lineNumbers={lineNumbers}
            padding={padding}
            previewTheme={previewTheme}
            radius={radius}
            shadow={shadow}
            showLineNumbers={showLineNumbers}
            showWindowFrame={showWindowFrame}
            width={exportWidth}
          />
        </div>
      </div>
    </>
  );
}
