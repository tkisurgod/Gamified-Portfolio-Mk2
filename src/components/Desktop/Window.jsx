import { useRef, useCallback } from "react";

export default function Window({ id, title, x, y, w, h, zIndex, focused, onFocus, onClose, onMove, children }) {
  const drag = useRef(null);

  const handlePointerDown = useCallback((e) => {
    onFocus(id);
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, startY: e.clientY, originX: x, originY: y };
  }, [id, x, y, onFocus]);

  const handlePointerMove = useCallback((e) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    onMove(id, drag.current.originX + dx, Math.max(0, drag.current.originY + dy));
  }, [id, onMove]);

  const handlePointerUp = useCallback((e) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    drag.current = null;
  }, []);

  return (
    <div
      onPointerDown={() => onFocus(id)}
      style={{
        position: "absolute", left: x, top: y, width: w, height: h, zIndex,
        display: "flex", flexDirection: "column",
        background: "#ece9d8",
        border: "1px solid #0831d9",
        borderRadius: "8px 8px 3px 3px",
        boxShadow: focused ? "3px 3px 14px rgba(0,0,0,0.5)" : "2px 2px 8px rgba(0,0,0,0.4)",
        overflow: "hidden",
        fontFamily: '"Segoe UI", Tahoma, Verdana, sans-serif',
      }}
    >
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          height: 30, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 4px 0 8px", cursor: "default", touchAction: "none",
          background: focused
            ? "linear-gradient(180deg, #2d5fdb 0%, #0f3ec4 45%, #0033b3 55%, #1552d9 100%)"
            : "linear-gradient(180deg, #8fa0c7 0%, #7488b8 100%)",
        }}
      >
        <span style={{
          color: "#fff", fontSize: 13, fontWeight: "bold",
          textShadow: "1px 1px 1px rgba(0,0,0,0.4)", whiteSpace: "nowrap",
          overflow: "hidden", textOverflow: "ellipsis",
        }}>{title}</span>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onClose(id)}
          aria-label="Close window"
          style={{
            width: 22, height: 20, border: "1px solid #7a1414", borderRadius: 3,
            background: "linear-gradient(180deg, #e88 0%, #c33 50%, #a11 100%)",
            color: "#fff", fontSize: 12, fontWeight: "bold", lineHeight: 1, cursor: "pointer",
          }}
        >✕</button>
      </div>
      <div style={{ flex: 1, overflow: "auto", background: "#fff" }}>
        {children}
      </div>
    </div>
  );
}
