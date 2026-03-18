import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function Footer() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) ?? "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const isDark = theme === "dark";

  return (
    <div className="footer">
      <button
        className={`theme-toggle ${isDark ? "dark" : "light"}`}
        onClick={toggle}
        aria-label="Toggle light/dark theme"
      >
        <img
          className="track-icon"
          src={!isDark ? "icons/moon.png" : "icons/sun.png"}
          alt={!isDark ? "dark mode" : "light mode"}
        />
        <div className="knob" />
      </button>
    </div>
  );
}