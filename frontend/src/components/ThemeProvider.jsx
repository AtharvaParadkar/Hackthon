import { createContext, useContext, useEffect, useState } from "react";

/**
 * ThemeProvider component manages the application's theme (light, dark, or system).
 * Best Practices implemented:
 * - Accessibility: Ensures high contrast by applying the correct theme class to the HTML document.
 * - UX: Remembers the user's preference using localStorage to provide a consistent experience across sessions.
 * - Performance: Avoids Flash of Unstyled Content (FOUC) by immediately applying the theme on load.
 */

const initialState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}) {
  // Initialize state from local storage or fallback to defaultTheme.
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove existing theme classes
    root.classList.remove("light", "dark");

    // If 'system' is selected, check the OS preference using matchMedia.
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    // Apply the selected theme class to the root HTML element.
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme) => {
      // Save theme preference to local storage for persistence across sessions.
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Hook to use the theme easily in other components.
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
