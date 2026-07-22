import { useState, useCallback } from "react";

// A file explorer whose only real drive, "My Strength (C:)", is completely
// full — because there's simply too much of it. Clicking a drive shows its
// properties; Disk Cleanup refuses to free anything.
const DRIVES = [
  {
    id: "c", label: "My Strength (C:)", letter: "C:",
    total: 500, free: 2, // GB — basically full
    fs: "NTFS (Never Too Full of Skills)",
    note: "Warning: this drive is 99.6% full. Do not free up space — it's all essential.",
  },
  {
    id: "d", label: "Free Time (D:)", letter: "D:",
    total: 500, free: 498,
    fs: "FAT (mostly empty)",
    note: "Almost entirely free. keith has been spending it all on side projects.",
  },
  {
    id: "e", label: "Weaknesses (E:)", letter: "E:",
    total: 500, free: 500,
    fs: "RAW (undetected)",
    note: "0 bytes used. Drive appears to be empty. Scan found nothing.",
  },
];

function pct(d) {
  return Math.round(((d.total - d.free) / d.total) * 100);
}

function DriveBar({ d, big }) {
  const used = pct(d);
  const color = used > 90 ? "#c0392b" : used > 50 ? "#e0a53f" : "#3fae3f";
  return (
    <div style={{ width: big ? "100%" : 140, height: big ? 16 : 10, background: "#e8e8e8", border: "1px solid #b0b0b0", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ width: `${used}%`, height: "100%", background: color, transition: "width 0.3s" }} />
    </div>
  );
}

export default function MyComputerWindow() {
  const [selected, setSelected] = useState("c");
  const [msg, setMsg] = useState(null);
  const drive = DRIVES.find((d) => d.id === selected);

  const cleanup = useCallback(() => {
    if (selected === "c") {
      setMsg("Disk Cleanup scanned 500 GB and found 0 bytes to remove. All strength is load-bearing.");
    } else if (selected === "e") {
      setMsg("Nothing to clean — this drive was already empty. Suspiciously so.");
    } else {
      setMsg("This drive has plenty of room. keith is choosing not to use it.");
    }
    setTimeout(() => setMsg(null), 3500);
  }, [selected]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "Tahoma, 'Segoe UI', sans-serif", fontSize: 12, color: "#1a1a1a", background: "#fff" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", borderBottom: "1px solid #c9c2a8", background: "#ece9d8" }}>
        <span style={{ fontSize: 11.5, color: "#333" }}>File  Edit  View  Favorites  Tools  Help</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", borderBottom: "1px solid #c9c2a8", background: "#f6f4ea", fontSize: 11.5 }}>
        <span>Address:</span>
        <span style={{ flex: 1, background: "#fff", border: "1px solid #b0a994", padding: "2px 6px" }}>My Computer</span>
        <button onClick={cleanup} style={cleanupBtn}>🧹 Disk Cleanup</button>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Drive list */}
        <div style={{ flex: 1, overflow: "auto", padding: "12px 14px" }}>
          <div style={{ fontSize: 11, color: "#777", marginBottom: 8, letterSpacing: 1 }}>HARD DISK DRIVES</div>
          {DRIVES.map((d) => (
            <div
              key={d.id}
              onClick={() => setSelected(d.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "8px 10px", marginBottom: 6,
                borderRadius: 4, cursor: "pointer",
                background: selected === d.id ? "rgba(51,102,204,0.18)" : "transparent",
                outline: selected === d.id ? "1px solid rgba(51,102,204,0.5)" : "1px solid transparent",
              }}
            >
              <div style={{ fontSize: 26 }}>{pct(d) > 90 ? "🈵" : "💾"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: "bold" }}>{d.label}</div>
                <DriveBar d={d} />
                <div style={{ fontSize: 11, color: pct(d) > 90 ? "#c0392b" : "#666", marginTop: 3 }}>
                  {d.free} GB free of {d.total} GB
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Properties pane */}
        <div style={{ width: 210, flexShrink: 0, borderLeft: "1px solid #c9c2a8", background: "linear-gradient(180deg, #7ba7e8 0%, #4f7fd6 100%)", color: "#fff", padding: "14px 12px", overflow: "auto" }}>
          <div style={{ fontSize: 13, fontWeight: "bold", marginBottom: 8, textShadow: "1px 1px 1px rgba(0,0,0,0.3)" }}>{drive.label}</div>
          <DriveBar d={drive} big />
          <div style={{ fontSize: 11.5, marginTop: 10, lineHeight: 1.7 }}>
            <div><strong>Used:</strong> {drive.total - drive.free} GB ({pct(drive)}%)</div>
            <div><strong>Free:</strong> {drive.free} GB</div>
            <div><strong>Capacity:</strong> {drive.total} GB</div>
            <div style={{ marginTop: 4 }}><strong>File system:</strong> {drive.fs}</div>
          </div>
          <div style={{ fontSize: 11, marginTop: 12, padding: "8px 10px", background: "rgba(0,0,0,0.22)", borderRadius: 4, lineHeight: 1.5 }}>
            {drive.note}
          </div>
        </div>
      </div>

      {/* Status / cleanup message */}
      <div style={{ padding: "5px 12px", borderTop: "1px solid #c9c2a8", background: "#ece9d8", fontSize: 11, color: msg ? "#8a1f1f" : "#555", minHeight: 22 }}>
        {msg || `${DRIVES.length} objects — hosting one dangerously talented individual`}
      </div>
    </div>
  );
}

const cleanupBtn = {
  padding: "2px 10px", fontSize: 11, cursor: "pointer",
  background: "linear-gradient(180deg, #fdfdfd, #dcdcd0)",
  border: "1px solid #9a9580", borderRadius: 3, color: "#333",
};
