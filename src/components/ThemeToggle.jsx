import { useTheme } from "@/context/theme.context";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const onToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={onToggle}
      aria-pressed={resolvedTheme === "dark"}
      style={{ padding: "6px 10px", borderRadius: 6, cursor: "pointer" }}
      title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
    >
      {resolvedTheme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

export default ThemeToggle;
