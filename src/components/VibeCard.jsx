import { VIBES, ENERGY_COLORS } from "../constants/vibes.js";
import { ConfidenceBar } from "./ConfidenceBar.jsx";

/**
 * VibeCard
 * Compact card used in the History tab. Shows truncated text,
 * sentiment badge, vibe summary, confidence bar, and energy tag.
 *
 * @param {{ result: object, text: string, ts: string }} props
 */
export function VibeCard({ result, text, ts }) {
  const vibe = VIBES[result.sentiment] || VIBES.NEUTRAL;

  return (
    <div
      style={{
        background: vibe.bg,
        border: `1px solid ${vibe.border}`,
        borderRadius: 12,
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "#aaa",
            fontFamily: "'IBM Plex Mono', monospace",
            lineHeight: 1.4,
            flex: 1,
          }}
        >
          "{text.length > 72 ? text.slice(0, 72) + "…" : text}"
        </p>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10,
            color: vibe.badge,
            background: vibe.bg,
            border: `1px solid ${vibe.border}`,
            borderRadius: 6,
            padding: "3px 8px",
            whiteSpace: "nowrap",
          }}
        >
          {vibe.emoji} {vibe.label}
        </span>
      </div>

      <p style={{ margin: 0, fontSize: 13, color: vibe.text, fontWeight: 500 }}>
        {result.vibe_summary}
      </p>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <ConfidenceBar value={result.confidence} />
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10,
            color: ENERGY_COLORS[result.energy_level],
            padding: "2px 8px",
            border: `1px solid ${ENERGY_COLORS[result.energy_level]}`,
            borderRadius: 4,
            whiteSpace: "nowrap",
          }}
        >
          {result.energy_level} ENERGY
        </span>
      </div>

      <span
        style={{
          fontSize: 10,
          color: "#555",
          fontFamily: "'IBM Plex Mono', monospace",
        }}
      >
        {ts}
      </span>
    </div>
  );
}
