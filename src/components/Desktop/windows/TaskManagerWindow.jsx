import { useState, useEffect, useCallback } from "react";

// A process list that is really a self-portrait. Every process is a bit,
// "End Process" actually does something (usually funny), and the CPU numbers
// jitter so it feels alive.
const INITIAL = [
  { id: "ship", name: "shipping_features.exe", base: 88, kill: "Cannot end task: this process is load-bearing." },
  { id: "over", name: "overthinking.exe", base: 96, kill: "Terminated... and immediately respawned. It always comes back." },
  { id: "imp", name: "imposter_syndrome.dll", base: 40, kill: "Process terminated. Confidence +100. Well done." },
  { id: "coffee", name: "coffee.exe", base: 12, status: "Not Responding", kill: "Refill required before termination is permitted." },
  { id: "learn", name: "learning_new_stack.exe", base: 55, kill: "Cannot end task: keith is still leveling up." },
  { id: "sleep", name: "sleep.exe", base: 4, status: "Suspended", kill: "sleep.exe has been suspended since finals week." },
  { id: "git", name: "git_commit.exe", base: 30, kill: "Uncommitted changes detected. Task refuses to die." },
];

function jitter(base) {
  return Math.max(0, Math.min(99, Math.round(base + (Math.random() * 8 - 4))));
}

export default function TaskManagerWindow() {
  const [procs, setProcs] = useState(() =>
    INITIAL.map((p) => ({ ...p, cpu: jitter(p.base), ended: false }))
  );
  const [toast, setToast] = useState(null);

  // Live-jitter the CPU column so it feels like a running machine.
  useEffect(() => {
    const iv = setInterval(() => {
      setProcs((prev) =>
        prev.map((p) => (p.ended ? p : { ...p, cpu: jitter(p.base) }))
      );
    }, 900);
    return () => clearInterval(iv);
  }, []);

  const endTask = useCallback((id) => {
    const proc = procs.find((p) => p.id === id);
    if (!proc) return;
    setToast({ name: proc.name, msg: proc.kill });
    // imposter_syndrome actually dies (it's the one you want gone).
    if (id === "imp") {
      setProcs((prev) => prev.map((p) => (p.id === id ? { ...p, ended: true, cpu: 0, status: "Terminated" } : p)));
    }
    setTimeout(() => setToast(null), 3200);
  }, [procs]);

  const totalCpu = procs.reduce((s, p) => s + (p.ended ? 0 : p.cpu), 0);
  const load = Math.min(100, Math.round(totalCpu / procs.length));

  return (
    <div style={{ fontFamily: "Tahoma, 'Segoe UI', sans-serif", fontSize: 12, color: "#1a1a1a", height: "100%", display: "flex", flexDirection: "column", background: "#ece9d8" }}>
      {/* Menu bar */}
      <div style={{ display: "flex", gap: 14, padding: "3px 8px", borderBottom: "1px solid #b8b3a0", fontSize: 11.5 }}>
        {["File", "Options", "View", "Shut Down", "Help"].map((m) => (
          <span key={m} style={{ color: "#333" }}>{m}</span>
        ))}
      </div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, padding: "6px 8px 0" }}>
        {["Applications", "Processes", "Performance"].map((t, i) => (
          <div key={t} style={{
            padding: "4px 12px", fontSize: 11.5, borderRadius: "4px 4px 0 0",
            border: "1px solid #a9a48f", borderBottom: i === 1 ? "1px solid #fff" : "1px solid #a9a48f",
            background: i === 1 ? "#fff" : "#e2ddc8", color: "#333", position: "relative", top: 1,
          }}>{t}</div>
        ))}
      </div>

      {/* Process table */}
      <div style={{ flex: 1, overflow: "auto", background: "#fff", border: "1px solid #a9a48f", margin: "0 8px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#f0eee0", position: "sticky", top: 0 }}>
              <th style={thStyle}>Image Name</th>
              <th style={{ ...thStyle, width: 60, textAlign: "right" }}>CPU</th>
              <th style={{ ...thStyle, width: 130 }}>Status</th>
              <th style={{ ...thStyle, width: 90 }}></th>
            </tr>
          </thead>
          <tbody>
            {procs.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #eee", opacity: p.ended ? 0.45 : 1 }}>
                <td style={{ ...tdStyle, fontFamily: "Consolas, monospace" }}>{p.name}</td>
                <td style={{ ...tdStyle, textAlign: "right", color: p.cpu > 80 ? "#c0392b" : "#333", fontVariantNumeric: "tabular-nums" }}>{String(p.cpu).padStart(2, "0")}%</td>
                <td style={{ ...tdStyle, color: p.status === "Not Responding" ? "#c0392b" : p.ended ? "#7a9a3a" : "#555" }}>
                  {p.ended ? "Terminated ✅" : p.status || "Running"}
                </td>
                <td style={tdStyle}>
                  {!p.ended && (
                    <button onClick={() => endTask(p.id)} style={endBtn}>End Process</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Toast for kill messages */}
      {toast && (
        <div style={{
          margin: "6px 8px 0", padding: "7px 10px", background: "#fffbe6",
          border: "1px solid #e0c65a", fontSize: 11.5, color: "#5a4a00",
        }}>
          <strong>{toast.name}:</strong> {toast.msg}
        </div>
      )}

      {/* Status bar */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 10px", fontSize: 11, color: "#333", borderTop: "1px solid #b8b3a0" }}>
        <span>Processes: {procs.filter((p) => !p.ended).length}</span>
        <span>CPU Usage: <strong style={{ color: load > 70 ? "#c0392b" : "#2d7a2d" }}>{load}%</strong> (mostly ambition)</span>
      </div>
    </div>
  );
}

const thStyle = { textAlign: "left", padding: "5px 8px", fontWeight: "normal", fontSize: 11.5, color: "#444", borderBottom: "1px solid #ccc" };
const tdStyle = { padding: "5px 8px" };
const endBtn = {
  padding: "2px 8px", fontSize: 11, cursor: "pointer",
  background: "linear-gradient(180deg, #fdfdfd, #dcdcd0)",
  border: "1px solid #9a9580", borderRadius: 3, color: "#333",
};
