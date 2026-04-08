import { useState, useCallback, useRef } from "react";
import { analyzeVibe } from "../api/analyzeVibe.js";
import { ConfidenceBar } from "./ConfidenceBar.jsx";
import { VIBES, ENERGY_COLORS } from "../constants/vibes.js";

/**
 * AnalyzeTab
 * The main entry point for the app. Contains:
 *  - Textarea for pasting customer text
 *  - "Check the Vibe" button (also triggered by ⌘↵)
 *  - Loading animation
 *  - Error state display
 *  - Full result card with sentiment, energy, confidence, and summary
 *
 * @param {{ onResult: (entry: object) => void }} props
 */
export function AnalyzeTab({ onResult }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(null);
  const [error, setError] = useState(null);
  const textRef = useRef(null);

  const handleAnalyze = useCallback(async () => {
    const text = input.trim();
    if (!text) return;

    setLoading(true);
    setError(null);
    setCurrent(null);

    try {
      const result = await analyzeVibe(text);
      const entry = {
        text,
        result,
        ts: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setCurrent(entry);
      onResult(entry);
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [input, onResult]);

  const handleKey = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAnalyze();
  };

  const vibe = current ? VIBES[current.result.sentiment] || VIBES.NEUTRAL : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Input area */}
      <div>
        <label
          style={{
            display: "block",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            color: "#555",
            marginBottom: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Paste a customer comment
        </label>
        <textarea
          ref={textRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="e.g. This product changed my life, absolutely love it!"
          rows={4}
          style={{
            width: "100%",
            background: "#111",
            border: "1px solid #222",
            borderRadius: 10,
            color: "#e0e0e0",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 13,
            padding: "14px 16px",
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
            lineHeight: 1.6,
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              color: "#444",
            }}
          >
            {input.length} chars · ⌘↵ to analyze
          </span>
          <button
            onClick={handleAnalyze}
            disabled={loading || !input.trim()}
            style={{
              background: loading || !input.trim() ? "#1a1a1a" : "#e0e0e0",
              color: loading || !input.trim() ? "#555" : "#0d0d0d",
              border: "none",
              borderRadius: 8,
              padding: "10px 24px",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              cursor: loading || !input.trim() ? "default" : "pointer",
              letterSpacing: "-0.2px",
              transition: "all 0.15s",
            }}
          >
            {loading ? "analyzing…" : "Check the Vibe →"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            background: "#2e0a0a",
            border: "1px solid #D85A30",
            borderRadius: 10,
            padding: "12px 16px",
          }}
        >
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12,
              color: "#F0997B",
            }}
          >
            ✗ {error}
          </span>
        </div>
      )}

      {/* Loading dots */}
      {loading && (
        <div
          style={{
            display: "flex",
            gap: 6,
            alignItems: "center",
            padding: "20px 0",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#333",
                animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12,
              color: "#444",
              marginLeft: 6,
            }}
          >
            reading the vibe…
          </span>
          <style>{`@keyframes pulse { 0%,80%,100%{background:#222} 40%{background:#aaa} }`}</style>
        </div>
      )}

      {/* Result card */}
      {current && !loading && (
        <div
          style={{
            background: vibe.bg,
            border: `1px solid ${vibe.border}`,
            borderRadius: 14,
            padding: "22px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10,
                  color: "#555",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 6,
                }}
              >
                vibe detected
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 28, color: vibe.text }}>
                  {vibe.emoji}
                </span>
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: vibe.text,
                    letterSpacing: "-1px",
                  }}
                >
                  {vibe.label}
                </span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10,
                  color: "#555",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 6,
                }}
              >
                energy
              </p>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 13,
                  color: ENERGY_COLORS[current.result.energy_level],
                  border: `1px solid ${ENERGY_COLORS[current.result.energy_level]}`,
                  borderRadius: 6,
                  padding: "4px 12px",
                }}
              >
                {current.result.energy_level}
              </span>
            </div>
          </div>

          <div
            style={{
              borderTop: `1px solid ${vibe.border}22`,
              paddingTop: 14,
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                color: "#555",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}
            >
              vibe summary
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 600,
                color: vibe.text,
                lineHeight: 1.4,
              }}
            >
              "{current.result.vibe_summary}"
            </p>
          </div>

          <div>
            <p
              style={{
                margin: "0 0 8px",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                color: "#555",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              confidence score
            </p>
            <ConfidenceBar value={current.result.confidence} />
          </div>
        </div>
      )}
    </div>
  );
}
