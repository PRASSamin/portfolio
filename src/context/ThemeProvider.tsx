"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
// theme: preview color gradient css
export const themes = {
  synthwave: "bg-gradient-to-b from-[#8E2DE2] to-[#4A00E0]",
  aquatic: "bg-gradient-to-b from-[#00C9FF] to-[#92FE9D]",
  cyberpunk: "bg-gradient-to-b from-[#EC008C] to-[#00BFFF]",
  emerald: "bg-gradient-to-b from-[#009245] to-[#FCEE21]",
  solar: "bg-gradient-to-b from-[#FFD700] to-[#FFA500]",
  sakura: "bg-gradient-to-b from-[#FFB6C1] to-[#FF69B4]",
  volcano: "bg-gradient-to-b from-[#FF4E50] to-[#F9D423]",
  lavender: "bg-gradient-to-b from-[#E6E6FA] to-[#DDA0DD]",
  minty: "bg-gradient-to-b from-[#A8FF78] to-[#78FFD6]",
  inferno: "bg-gradient-to-b from-[#FF512F] to-[#DD2476]",
  aurora: "bg-gradient-to-b from-[#00FFCC] to-[#3366FF]",
  luminous: "bg-gradient-to-b from-[#FF6AC1] to-[#FFE866]",
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
}

type ThemeName = keyof typeof themes;

interface ThemeProviderState {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const initialState: ThemeProviderState = {
  theme: "aurora",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "aurora",
  storageKey = "_ui_theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeName>(
    () =>
      ((typeof window !== "undefined" && localStorage.getItem(storageKey)) ||
        defaultTheme) as ThemeName
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
