import { useState, useEffect, useRef, useCallback } from "react";
import wallpaper from "../../assets/windowsxp.png";
import DesktopIcon from "./DesktopIcon";
import Window from "./Window";
import Taskbar from "./Taskbar";
import { ResumeIcon, RecycleBinIcon, PicturesIcon, MyComputerIcon } from "./icons";
import ResumeWindow from "./windows/ResumeWindow";
import RecycleBinWindow from "./windows/RecycleBinWindow";
import PhotosWindow from "./windows/PhotosWindow";
import CommandPromptWindow from "./windows/CommandPromptWindow";
import TaskManagerWindow from "./windows/TaskManagerWindow";
import AchievementsWindow from "./windows/AchievementsWindow";
import MyComputerWindow from "./windows/MyComputerWindow";

const STORAGE_KEY = "desktop-state-v1";

const ICON_DEFS = [
  { id: "mycomputer", label: "My Computer", Icon: MyComputerIcon, x: 40, y: 40 },
  { id: "resume", label: "My Resume", Icon: ResumeIcon, x: 40, y: 152 },
  { id: "recycle", label: "Recycle Bin", Icon: RecycleBinIcon, x: 40, y: 264 },
  { id: "photos", label: "My Pictures", Icon: PicturesIcon, x: 40, y: 376 },
];

const WINDOW_DEFS = {
  resume: { title: "Tomkeith_Nganyi_CV.docx — Recovered File", Content: ResumeWindow, w: 620, h: 560, x: 160, y: 60 },
  recycle: { title: "Recycle Bin", Content: RecycleBinWindow, w: 480, h: 420, x: 260, y: 110 },
  photos: { title: "My Pictures", Content: PhotosWindow, w: 520, h: 400, x: 340, y: 150 },
  mycomputer: { title: "My Computer", Content: MyComputerWindow, w: 620, h: 440, x: 200, y: 80 },
  cmd: { title: "C:\\WINDOWS\\system32\\cmd.exe", Content: CommandPromptWindow, w: 560, h: 380, x: 220, y: 100 },
  taskmgr: { title: "Windows Task Manager", Content: TaskManagerWindow, w: 560, h: 460, x: 280, y: 90 },
  achievements: { title: "Achievements — keith", Content: AchievementsWindow, w: 460, h: 500, x: 360, y: 70 },
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
        return { ...prev, [kind]: { ...prev[kind], z: zCounter.current, minimized: false } };
      }
      const def = WINDOW_DEFS[kind];
      zCounter.current += 1;
      return {
        ...prev,
        [kind]: {
          open: true,
          x: prev[kind]?.x ?? def.x, y: prev[kind]?.y ?? def.y,
          w: prev[kind]?.w ?? def.w, h: prev[kind]?.h ?? def.h,
          z: zCounter.current, minimized: false, maximized: prev[kind]?.maximized ?? false,
        },
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

  const resizeWindow = useCallback((kind, rect) => {
    setWindows((prev) => ({ ...prev, [kind]: { ...prev[kind], ...rect } }));
  }, []);

  const minimizeWindow = useCallback((kind) => {
    setWindows((prev) => ({ ...prev, [kind]: { ...prev[kind], minimized: true } }));
  }, []);

  const toggleMaximize = useCallback((kind) => {
    setWindows((prev) => ({ ...prev, [kind]: { ...prev[kind], maximized: !prev[kind].maximized } }));
  }, []);

  // Taskbar click: restore if minimized, minimize if it's the active window, else bring to front.
  const taskbarClick = useCallback((kind) => {
    setWindows((prev) => {
      const wst = prev[kind];
      if (!wst) return prev;
      if (wst.minimized) {
        zCounter.current += 1;
        return { ...prev, [kind]: { ...wst, minimized: false, z: zCounter.current } };
      }
      const maxVisibleZ = Math.max(
        ...Object.values(prev).filter((v) => v.open && !v.minimized).map((v) => v.z)
      );
      if (wst.z === maxVisibleZ) {
        return { ...prev, [kind]: { ...wst, minimized: true } };
      }
      zCounter.current += 1;
      return { ...prev, [kind]: { ...wst, z: zCounter.current } };
    });
  }, []);

  const openList = Object.entries(windows)
    .filter(([, w]) => w.open)
    .sort((a, b) => a[1].z - b[1].z);
  const visibleList = openList.filter(([, w]) => !w.minimized);
  const topZ = visibleList.length ? visibleList[visibleList.length - 1][1].z : -1;

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

      {visibleList.map(([kind, w]) => {
        const def = WINDOW_DEFS[kind];
        const Content = def.Content;
        return (
          <Window
            key={kind}
            id={kind}
            title={def.title}
            x={w.x} y={w.y} w={w.w ?? def.w} h={w.h ?? def.h} zIndex={w.z}
            focused={w.z === topZ}
            maximized={!!w.maximized}
            onFocus={focusWindow}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={toggleMaximize}
            onMove={moveWindow}
            onResize={resizeWindow}
          >
            <Content />
          </Window>
        );
      })}

      <Taskbar
        windows={openList.map(([kind, w]) => ({ id: kind, title: WINDOW_DEFS[kind].title, focused: w.z === topZ && !w.minimized }))}
        onFocus={taskbarClick}
        onOpen={openWindow}
      />
    </div>
  );
}
