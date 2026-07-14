import { useRef, useCallback } from "react";

export default function DesktopIcon({ id, x, y, label, icon, selected, onSelect, onOpen, onMove }) {
  const drag = useRef(null);

  const handlePointerDown = useCallback((e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, startY: e.clientY, originX: x, originY: y, moved: false };
  }, [x, y]);

  const handlePointerMove = useCallback((e) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) drag.current.moved = true;
    if (drag.current.moved) {
      onMove(id, drag.current.originX + dx, drag.current.originY + dy);
    }
  }, [id, onMove]);

  const handlePointerUp = useCallback((e) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    const wasDrag = drag.current?.moved;
    drag.current = null;
    if (!wasDrag) {
      if (selected) onOpen(id);
      else onSelect(id);
    }
  }, [id, selected, onOpen, onSelect]);

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpen(id); }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={() => onOpen(id)}
      style={{
        position: "absolute", left: x, top: y, width: 84,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        padding: "6px 4px", cursor: "default", userSelect: "none", touchAction: "none",
        background: selected ? "rgba(51,102,204,0.35)" : "transparent",
        outline: selected ? "1px dotted rgba(255,255,255,0.6)" : "none",
        borderRadius: 2,
      }}
    >
      <div style={{
        width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center",
        filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.6))",
      }}>
        {icon}
      </div>
      <span style={{
        color: "#fff", fontSize: 12, fontFamily: '"Segoe UI", Tahoma, Verdana, sans-serif',
        textAlign: "center", lineHeight: 1.25,
        textShadow: "1px 1px 2px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.9)",
      }}>{label}</span>
    </div>
  );
}
