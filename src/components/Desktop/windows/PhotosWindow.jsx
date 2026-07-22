import { useState } from "react";

// Real media pulled from src/assets/photos.
// HEIC files are intentionally excluded — browsers can't decode them natively.
const imageMods = import.meta.glob(
  "../../../assets/photos/*.{jpg,jpeg,png,webp,gif}",
  { eager: true, query: "?url", import: "default" }
);
const videoMods = import.meta.glob(
  "../../../assets/photos/*.{mp4,webm}",
  { eager: true, query: "?url", import: "default" }
);

const nameOf = (path) => path.split("/").pop();

const media = [
  ...Object.entries(imageMods).map(([path, url]) => ({ type: "image", url, name: nameOf(path) })),
  ...Object.entries(videoMods).map(([path, url]) => ({ type: "video", url, name: nameOf(path) })),
];

function Thumb({ item, onOpen }) {
  return (
    <div style={{ width: 120, cursor: "pointer" }} onClick={() => onOpen(item)}>
      <div style={{
        width: 120, height: 90, background: "#000",
        border: "1px solid #b0ab95", display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}>
        {item.type === "image" ? (
          <img src={item.url} alt={item.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <>
            <video src={item.url} muted preload="metadata"
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(0,0,0,0.25)",
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", background: "rgba(0,0,0,0.6)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13,
              }}>▶</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Lightbox({ item, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: "absolute", inset: 0, background: "rgba(0,0,0,0.82)", zIndex: 20,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "90%", maxHeight: "90%" }}>
        {item.type === "image" ? (
          <img src={item.url} alt={item.name}
            style={{ maxWidth: "100%", maxHeight: "80vh", display: "block", boxShadow: "0 0 30px rgba(0,0,0,0.6)" }} />
        ) : (
          <video src={item.url} controls autoPlay
            style={{ maxWidth: "100%", maxHeight: "80vh", display: "block", boxShadow: "0 0 30px rgba(0,0,0,0.6)" }} />
        )}
      </div>
      <div onClick={onClose} style={{
        position: "absolute", top: 12, right: 16, color: "#fff", fontSize: 24,
        cursor: "pointer", fontFamily: "Consolas, monospace",
      }}>✕</div>
    </div>
  );
}

export default function PhotosWindow() {
  const [open, setOpen] = useState(null);
  const imgCount = media.filter((m) => m.type === "image").length;
  const vidCount = media.filter((m) => m.type === "video").length;

  return (
    <div style={{ fontFamily: '"Segoe UI", Tahoma, Verdana, sans-serif', padding: "16px 20px", position: "relative" }}>
      <div style={{
        background: "#1a1a1a", color: "#7dff7d", fontFamily: "Consolas, monospace",
        fontSize: 11, padding: "8px 12px", marginBottom: 16, lineHeight: 1.6,
      }}>
        {media.length} items recovered — {imgCount} photos, {vidCount} clips.
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {media.map((m) => <Thumb key={m.name} item={m} onOpen={setOpen} />)}
      </div>
      <div style={{ fontSize: 11, color: "#999", marginTop: 16, fontStyle: "italic" }}>
        Click any thumbnail to view it full size.
      </div>

      {open && <Lightbox item={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
