const TABS = ["analyze", "history", "tests"];

/**
 * TabNav
 * Horizontal tab navigation bar. Active tab gets a white bottom border.
 *
 * @param {{ active: string, onChange: (tab: string) => void }} props
 */
export function TabNav({ active, onChange }) {
  return (
    <div
      style={{
        borderBottom: "1px solid #1a1a1a",
        padding: "0 28px",
        display: "flex",
        gap: 0,
      }}
    >
      {TABS.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          style={{
            background: "transparent",
            border: "none",
            borderBottom:
              active === t ? "2px solid #e0e0e0" : "2px solid transparent",
            color: active === t ? "#e0e0e0" : "#555",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12,
            padding: "12px 18px 10px",
            cursor: "pointer",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
