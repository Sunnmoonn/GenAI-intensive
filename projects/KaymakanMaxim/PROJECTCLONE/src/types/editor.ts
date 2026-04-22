export type EditorLanguage =
  | "typescript"
  | "javascript"
  | "json"
  | "html"
  | "css";

export type EditorTheme = "night" | "light" | "carbon";

export type BackgroundMode = "gradient" | "solid";

export type BackgroundStyle = "sunset" | "aurora" | "ocean" | "cream" | "slate";

export type EditorState = {
  code: string;
  language: EditorLanguage;
  theme: EditorTheme;
  filename: string;
  showLineNumbers: boolean;
  showWindowFrame: boolean;
  backgroundMode: BackgroundMode;
  backgroundStyle: BackgroundStyle;
  padding: number;
  radius: number;
  shadow: number;
};

export type EditorActions = {
  setCode: (code: string) => void;
  setLanguage: (language: EditorLanguage) => void;
  setTheme: (theme: EditorTheme) => void;
  setShowLineNumbers: (showLineNumbers: boolean) => void;
  setShowWindowFrame: (showWindowFrame: boolean) => void;
  setBackgroundMode: (backgroundMode: BackgroundMode) => void;
  setBackgroundStyle: (backgroundStyle: BackgroundStyle) => void;
  setPadding: (padding: number) => void;
  setRadius: (radius: number) => void;
  setShadow: (shadow: number) => void;
};
