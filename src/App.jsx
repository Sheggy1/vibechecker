import { useState } from "react";
import { Header } from "./components/Header.jsx";
import { TabNav } from "./components/TabNav.jsx";
import { AnalyzeTab } from "./components/AnalyzeTab.jsx";
import { HistoryTab } from "./components/HistoryTab.jsx";
import { TestsTab } from "./components/TestsTab.jsx";

/**
 * App
 * Root component. Owns shared state:
 *  - `tab`     — active tab key
 *  - `history` — last 5 vibe check entries (session-scoped, no persistence)
 *
 * History is passed down to HistoryTab for display and updated via
 * the onResult callback from AnalyzeTab.
 */
export default function App() {
  const [tab, setTab] = useState("analyze");
  const [history, setHistory] = useState([]);

  const handleResult = (entry) => {
    setHistory((prev) => [entry, ...prev].slice(0, 5));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d0d0d",
        color: "#e0e0e0",
        fontFamily: "'Syne', sans-serif",
        paddingBottom: 60,
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <Header />
      <TabNav active={tab} onChange={setTab} />

      <div style={{ padding: "28px 28px 0", maxWidth: 700 }}>
        {tab === "analyze" && <AnalyzeTab onResult={handleResult} />}
        {tab === "history" && <HistoryTab entries={history} />}
        {tab === "tests" && <TestsTab />}
      </div>
    </div>
  );
}
