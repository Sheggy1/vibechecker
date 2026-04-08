import { VibeCard } from "./VibeCard.jsx";

/**
 * HistoryTab
 * Displays the last 5 vibe checks stored in session state.
 * State is owned by App.jsx and passed down as `entries`.
 *
 * @param {{ entries: Array<{ text: string, result: object, ts: string }> }} props
 */
export function HistoryTab({ entries }) {
  if (entries.length === 0) {
    return (
      <div style={{ padding: "40px 0", textAlign: "center" }}>
        <p
          style={{
            color: "#444",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12,
          }}
        >
          no vibes checked yet · go analyze something
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            color: "#555",
          }}
        >
          {entries.length} / 5 session checks
        </span>
      </div>
      {entries.map((entry, i) => (
        <VibeCard key={i} {...entry} />
      ))}
    </div>
  );
}
