/**
 * Header
 * Top bar with app name, version badge, and engine attribution.
 */
export function Header() {
  return (
    <div
      style={{
        borderBottom: "1px solid #1a1a1a",
        padding: "20px 28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span
          style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px" }}
        >
          VibeCheck
        </span>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10,
            color: "#444",
            background: "#1a1a1a",
            padding: "2px 8px",
            borderRadius: 4,
          }}
        >
          v1.0
        </span>
      </div>
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          color: "#444",
        }}
      >
        sentiment engine · powered by claude
      </span>
    </div>
  );
}
