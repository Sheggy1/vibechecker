/**
 * ConfidenceBar
 * Renders a thin animated progress bar with a percentage readout.
 * Color shifts from red → amber → green based on confidence value.
 *
 * @param {{ value: number }} props - value: integer 0–100
 */
export function ConfidenceBar({ value }) {
  const color =
    value > 75 ? "#1D9E75" : value > 45 ? "#BA7517" : "#D85A30";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          flex: 1,
          height: 4,
          background: "#2a2a2a",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${value}%`,
            background: color,
            borderRadius: 2,
            transition: "width 0.6s ease",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12,
          color: "#888",
          minWidth: 32,
        }}
      >
        {value}%
      </span>
    </div>
  );
}
