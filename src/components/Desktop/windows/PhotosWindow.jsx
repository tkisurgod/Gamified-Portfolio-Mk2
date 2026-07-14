// Placeholder thumbnails — swap for real photos of you / achievements.
// Shape: { name }
const files = [
  { name: "IMG_0142.jpg" }, { name: "IMG_0187.jpg" }, { name: "conf_badge.png" },
  { name: "IMG_0209.jpg" }, { name: "award_2025.jpg" }, { name: "IMG_0231.jpg" },
];

function Thumb({ name }) {
  return (
    <div style={{ width: 120 }}>
      <div style={{
        width: 120, height: 90, background: "repeating-linear-gradient(135deg, #d8d4c4 0 6px, #c9c4ae 6px 12px)",
        border: "1px solid #b0ab95", display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}>
        <span style={{ fontSize: 22, color: "#8a1f1f", fontFamily: "Consolas, monospace" }}>✕</span>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.55)",
          color: "#eee", fontSize: 9, fontFamily: "Consolas, monospace", padding: "2px 4px",
        }}>render failed</div>
      </div>
      <div style={{ fontSize: 11, color: "#444", marginTop: 3, textAlign: "center" }}>{name}</div>
    </div>
  );
}

export default function PhotosWindow() {
  return (
    <div style={{ fontFamily: '"Segoe UI", Tahoma, Verdana, sans-serif', padding: "16px 20px" }}>
      <div style={{
        background: "#1a1a1a", color: "#7dff7d", fontFamily: "Consolas, monospace",
        fontSize: 11, padding: "8px 12px", marginBottom: 16, lineHeight: 1.6,
      }}>
        {files.length} files found — thumbnail cache corrupted, originals intact.
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {files.map((f) => <Thumb key={f.name} {...f} />)}
      </div>
      <div style={{ fontSize: 11, color: "#999", marginTop: 16, fontStyle: "italic" }}>
        Real photos are still being pulled off the disk. Check back soon.
      </div>
    </div>
  );
}
