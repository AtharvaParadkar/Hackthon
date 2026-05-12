import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

/**
 * ThemeToggle component provides a user interface to switch between light and dark modes.
 *
 * UX and Accessibility Best Practices:
 * 1. Accessible Button: Uses aria-label to ensure screen readers can announce the button's purpose since it only contains icons visually.
 * 2. Visual Feedback: Smooth transitions for icons rotating and scaling when the theme changes.
 * 3. Clear Affordance: The active icon clearly indicates the current theme, reducing cognitive load.
 * 4. Keyboard Navigation: Standard <button> is naturally focusable and triggerable via Space/Enter keys.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    // Switch between light and dark mode, ignoring system preference for manual override.
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 transition-colors"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
