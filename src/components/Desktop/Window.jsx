import { useRef, useCallback } from "react";

const MIN_W = 300;
const MIN_H = 180;
const TASKBAR_H = 34;

// Resize handle definitions: [direction, style, cursor]
const HANDLES = [
  ["n",  { top: -3, left: 8, right: 8, height: 6, cursor: "ns-resize" }],
  ["s",  { bottom: -3, left: 8, right: 8, height: 6, cursor: "ns-resize" }],
  ["e",  { top: 8, bottom: 8, right: -3, width: 6, cursor: "ew-resize" }],
  ["w",  { top: 8, bottom: 8, left: -3, width: 6, cursor: "ew-resize" }],
  ["ne", { top: -3, right: -3, width: 12, height: 12, cursor: "nesw-resize" }],
  ["nw", { top: -3, left: -3, width: 12, height: 12, cursor: "nwse-resize" }],
  ["se", { bottom: -3, right: -3, width: 12, height: 12, cursor: "nwse-resize" }],
  ["sw", { bottom: -3, left: -3, width: 12, height: 12, cursor: "nesw-resize" }],
];

function ChromeButton({ label, title, onClick, colors }) {
  return (
    <button
      onPointerDown={(e) => e.stopPropagation()}
      onClick={onClick}
      aria-label={title}
      title={title}
      style={{
        width: 22, height: 20, border: `1px solid ${colors.border}`, borderRadius: 3,
        background: colors.bg, color: "#fff", fontSize: 11, fontWeight: "bold",
        lineHeight: 1, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >{label}</button>
  );
}

export default function Window({
  id, title, x, y, w, h, zIndex, focused, maximized,
  onFocus, onClose, onMinimize, onMaximize, onMove, onResize, children,
}) {
  const drag = useRef(null);
  const resize = useRef(null);

  const handlePointerDown = useCallback((e) => {
    if (maximized) return;
    onFocus(id);
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, startY: e.clientY, originX: x, originY: y };
  }, [id, x, y, maximized, onFocus]);

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

  const startResize = useCallback((e, dir) => {
    e.stopPropagation();
    onFocus(id);
    e.currentTarget.setPointerCapture(e.pointerId);
    resize.current = { dir, startX: e.clientX, startY: e.clientY, x, y, w, h };
  }, [id, x, y, w, h, onFocus]);

  const onResizeMove = useCallback((e) => {
    const r = resize.current;
    if (!r) return;
    const dx = e.clientX - r.startX;
    const dy = e.clientY - r.startY;
    let nx = r.x, ny = r.y, nw = r.w, nh = r.h;
    if (r.dir.includes("e")) nw = Math.max(MIN_W, r.w + dx);
    if (r.dir.includes("s")) nh = Math.max(MIN_H, r.h + dy);
    if (r.dir.includes("w")) { nw = Math.max(MIN_W, r.w - dx); nx = r.x + (r.w - nw); }
    if (r.dir.includes("n")) { nh = Math.max(MIN_H, r.h - dy); ny = Math.max(0, r.y + (r.h - nh)); }
    onResize(id, { x: nx, y: ny, w: nw, h: nh });
  }, [id, onResize]);

  const endResize = useCallback((e) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    resize.current = null;
  }, []);

  const geom = maximized
    ? { left: 0, top: 0, width: "100%", height: `calc(100% - ${TASKBAR_H}px)`, borderRadius: 0 }
    : { left: x, top: y, width: w, height: h, borderRadius: "8px 8px 3px 3px" };

  return (
    <div
      onPointerDown={() => onFocus(id)}
      style={{
        position: "absolute", zIndex, ...geom,
        display: "flex", flexDirection: "column",
        background: "#ece9d8",
        border: "1px solid #0831d9",
        boxShadow: focused ? "3px 3px 14px rgba(0,0,0,0.5)" : "2px 2px 8px rgba(0,0,0,0.4)",
        overflow: "hidden",
        fontFamily: '"Segoe UI", Tahoma, Verdana, sans-serif',
      }}
    >
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={() => onMaximize(id)}
        style={{
          height: 30, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 4px 0 8px", cursor: maximized ? "default" : "move", touchAction: "none",
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
        <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
          <ChromeButton
            label="_" title="Minimize" onClick={() => onMinimize(id)}
            colors={{ border: "#183c9e", bg: "linear-gradient(180deg, #6c8fe0 0%, #3a63c8 50%, #1e46b0 100%)" }}
          />
          <ChromeButton
            label={maximized ? "❐" : "▢"} title={maximized ? "Restore" : "Maximize"} onClick={() => onMaximize(id)}
            colors={{ border: "#183c9e", bg: "linear-gradient(180deg, #6c8fe0 0%, #3a63c8 50%, #1e46b0 100%)" }}
          />
          <ChromeButton
            label="✕" title="Close" onClick={() => onClose(id)}
            colors={{ border: "#7a1414", bg: "linear-gradient(180deg, #e88 0%, #c33 50%, #a11 100%)" }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", background: "#fff" }}>
        {children}
      </div>

      {!maximized && HANDLES.map(([dir, style]) => (
        <div
          key={dir}
          onPointerDown={(e) => startResize(e, dir)}
          onPointerMove={onResizeMove}
          onPointerUp={endResize}
          style={{ position: "absolute", touchAction: "none", zIndex: 10, ...style }}
        />
      ))}
    </div>
  );
}
