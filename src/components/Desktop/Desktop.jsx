import { useState, useEffect, useRef, useCallback } from "react";
import wallpaper from "../../assets/windowsxp.png";
import DesktopIcon from "./DesktopIcon";
import Window from "./Window";
import Taskbar from "./Taskbar";
import { ResumeIcon, RecycleBinIcon, PicturesIcon } from "./icons";
import ResumeWindow from "./windows/ResumeWindow";
import RecycleBinWindow from "./windows/RecycleBinWindow";
import PhotosWindow from "./windows/PhotosWindow";

const STORAGE_KEY = "desktop-state-v1";

const ICON_DEFS = [
  { id: "resume", label: "My Resume", Icon: ResumeIcon, x: 40, y: 40 },
  { id: "recycle", label: "Recycle Bin", Icon: RecycleBinIcon, x: 40, y: 152 },
  { id: "photos", label: "My Pictures", Icon: PicturesIcon, x: 40, y: 264 },
];

const WINDOW_DEFS = {
  resume: { title: "Tomkeith_Nganyi_CV.docx — Recovered File", Content: ResumeWindow, w: 620, h: 560, x: 160, y: 60 },
  recycle: { title: "Recycle Bin", Content: RecycleBinWindow, w: 480, h: 420, x: 260, y: 110 },
  photos: { title: "My Pictures", Content: PhotosWindow, w: 520, h: 400, x: 340, y: 150 },
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore corrupt storage */ }
  return null;
}

export default function Desktop() {
  const [iconPos, setIconPos] = useState(() => {
    const base = {};
    ICON_DEFS.forEach((d) => { base[d.id] = { x: d.x, y: d.y }; });
    const saved = loadState();
    return saved?.iconPos ? { ...base, ...saved.iconPos } : base;
  });
  const [windows, setWindows] = useState(() => loadState()?.windows || {});
  const [selected, setSelected] = useState(null);
  const zCounter = useRef(loadState()?.maxZ || 10);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ iconPos, windows, maxZ: zCounter.current }));
  }, [iconPos, windows]);

  const moveIcon = useCallback((id, x, y) => {
    setIconPos((prev) => ({ ...prev, [id]: { x, y } }));
  }, []);

  const openWindow = useCallback((kind) => {
    setWindows((prev) => {
      if (prev[kind]?.open) {
        zCounter.current += 1;
        return { ...prev, [kind]: { ...prev[kind], z: zCounter.current } };
      }
      const def = WINDOW_DEFS[kind];
      zCounter.current += 1;
      return {
        ...prev,
        [kind]: { open: true, x: prev[kind]?.x ?? def.x, y: prev[kind]?.y ?? def.y, z: zCounter.current },
      };
    });
    setSelected(null);
  }, []);

  const closeWindow = useCallback((kind) => {
    setWindows((prev) => ({ ...prev, [kind]: { ...prev[kind], open: false } }));
  }, []);

  const focusWindow = useCallback((kind) => {
    zCounter.current += 1;
    const z = zCounter.current;
    setWindows((prev) => ({ ...prev, [kind]: { ...prev[kind], z } }));
  }, []);

  const moveWindow = useCallback((kind, x, y) => {
    setWindows((prev) => ({ ...prev, [kind]: { ...prev[kind], x, y } }));
  }, []);

  const openList = Object.entries(windows)
    .filter(([, w]) => w.open)
    .sort((a, b) => a[1].z - b[1].z);
  const topZ = openList.length ? openList[openList.length - 1][1].z : -1;

  return (
    <div
      onPointerDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
      style={{
        position: "fixed", inset: 0, overflow: "hidden",
        backgroundImage: `url(${wallpaper})`, backgroundSize: "cover", backgroundPosition: "center",
      }}
    >
      <style>{`
        @keyframes iconFadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
        .desktop-scanlines {
          position: absolute; inset: 0; pointer-events: none; z-index: 5;
          background: repeating-linear-gradient(
            0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 3px
          );
          mix-blend-mode: overlay;
        }
      `}</style>

      <div className="desktop-scanlines" />

      {ICON_DEFS.map((d, i) => (
        <div key={d.id} style={{ animation: `iconFadeIn 0.35s ease-out ${i * 0.12}s both` }}>
          <DesktopIcon
            id={d.id}
            label={d.label}
            icon={<d.Icon />}
            x={iconPos[d.id].x}
            y={iconPos[d.id].y}
            selected={selected === d.id}
            onSelect={setSelected}
            onOpen={openWindow}
            onMove={moveIcon}
          />
        </div>
      ))}

      {openList.map(([kind, w]) => {
        const def = WINDOW_DEFS[kind];
        const Content = def.Content;
        return (
          <Window
            key={kind}
            id={kind}
            title={def.title}
            x={w.x} y={w.y} w={def.w} h={def.h} zIndex={w.z}
            focused={w.z === topZ}
            onFocus={focusWindow}
            onClose={closeWindow}
            onMove={moveWindow}
          >
            <Content />
          </Window>
        );
      })}

      <Taskbar
        windows={openList.map(([kind, w]) => ({ id: kind, title: WINDOW_DEFS[kind].title, focused: w.z === topZ }))}
        onFocus={focusWindow}
      />
    </div>
  );
}
