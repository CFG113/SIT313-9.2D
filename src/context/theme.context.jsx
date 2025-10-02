import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeCtx = createContext(null);

function apply(theme) {
  const root = document.documentElement;
  root.classList.remove("light", "light-theme", "dark", "dark-theme");
  root.classList.add(theme, `${theme}-theme`);
}

export function ThemeProvider({ children }) {
  const getInitial = () => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(getInitial);

  useEffect(() => {
    apply(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const value = {
    theme,
    resolvedTheme: theme,
    setTheme,
    toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
  };

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within <AppThemeProvider>");
  return ctx;
}
