// Placeholder entries — swap for real honourable-mention / unfinished projects.
// Shape: { title, blurb, status: "corrupted" | "pending" | "unrecoverable" }
const items = [
  { title: "[DATA EXPUNGED]", blurb: "File table entry damaged beyond repair.", status: "unrecoverable" },
  { title: "project_v2_final_REAL.zip", blurb: "Checksum mismatch — indexing incomplete.", status: "corrupted" },
  { title: "??????.old", blurb: "Recovery in progress, keep this window open...", status: "pending" },
];

const statusStyle = {
  unrecoverable: { color: "#a11", label: "UNRECOVERABLE" },
  corrupted: { color: "#b8860b", label: "CORRUPTED" },
  pending: { color: "#245edb", label: "RECOVERING" },
};

export default function RecycleBinWindow() {
  return (
    <div style={{ fontFamily: '"Segoe UI", Tahoma, Verdana, sans-serif', color: "#2a2a2a", padding: "16px 20px" }}>
      <div style={{
        background: "#1a1a1a", color: "#7dff7d", fontFamily: "Consolas, monospace",
        fontSize: 11, padding: "8px 12px", marginBottom: 16, lineHeight: 1.6,
      }}>
        3 items — deleted, not gone. Restoration in progress.
      </div>

      {items.map((it) => {
        const s = statusStyle[it.status];
        return (
          <div key={it.title} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 8px",
            borderBottom: "1px solid #e3e0d0",
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
              background: s.color, opacity: it.status === "pending" ? 1 : 0.6,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 13, fontWeight: "bold",
                textDecoration: it.status !== "pending" ? "line-through" : "none",
                color: it.status === "unrecoverable" ? "#888" : "#2a2a2a",
              }}>{it.title}</div>
              <div style={{ fontSize: 12, color: "#777" }}>{it.blurb}</div>
            </div>
            <div style={{
              fontSize: 10, fontFamily: "Consolas, monospace", letterSpacing: 1, color: s.color,
              flexShrink: 0,
            }}>{s.label}</div>
          </div>
        );
      })}

      <div style={{ fontSize: 11, color: "#999", marginTop: 16, fontStyle: "italic" }}>
        The real honourable mentions are still being pulled off the disk. Check back soon.
      </div>
    </div>
  );
}
