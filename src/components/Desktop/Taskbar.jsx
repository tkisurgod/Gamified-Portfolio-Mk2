import { useState, useEffect } from "react";

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(iv);
  }, []);
  return now;
}

export default function Taskbar({ windows, onFocus }) {
  const now = useClock();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{
      position: "fixed", left: 0, right: 0, bottom: 0, height: 34, zIndex: 9999,
      display: "flex", alignItems: "center",
      background: "linear-gradient(180deg, #245edb 0%, #1941a5 5%, #1941a5 95%, #0d2b7a 100%)",
      borderTop: "1px solid #4d7fe8",
      fontFamily: '"Segoe UI", Tahoma, Verdana, sans-serif',
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 6, height: "100%", padding: "0 14px 0 10px",
        background: "linear-gradient(180deg, #3fae3f 0%, #2d8f2d 50%, #1f7a1f 100%)",
        color: "#fff", fontWeight: "bold", fontStyle: "italic", fontSize: 15,
        clipPath: "polygon(0 0, 100% 0, 92% 100%, 0% 100%)",
        marginRight: 16, textShadow: "1px 1px 1px rgba(0,0,0,0.4)",
      }}>
        start
      </div>

      <div style={{ flex: 1, display: "flex", gap: 4, overflow: "hidden" }}>
        {windows.map((w) => (
          <button
            key={w.id}
            onClick={() => onFocus(w.id)}
            style={{
              display: "flex", alignItems: "center", gap: 6, maxWidth: 180,
              padding: "3px 10px", fontSize: 12, color: "#fff", cursor: "pointer",
              background: w.focused ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.25)", borderRadius: 3,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}
          >{w.title}</button>
        ))}
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 8, height: "100%", padding: "0 12px",
        background: "rgba(0,0,0,0.15)", borderLeft: "1px solid rgba(255,255,255,0.2)",
        color: "#eaf1ff", fontSize: 12,
      }}>
        <span style={{ color: "#7dff7d", fontFamily: "Consolas, monospace" }}>● INTRUSION: ACTIVE</span>
        <span>{time}</span>
      </div>
    </div>
  );
}
