import { useState, useEffect, useCallback } from "react";
import BruteforceGame from "./components/minigame";
import Desktop from "./components/Desktop/Desktop";
import wallpaper from "./assets/windowsxp.png";

const FADE_MS = 500;

export default function App() {
  const [wallpaperReady, setWallpaperReady] = useState(false);
  const [gameDone, setGameDone] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  // Preload the (large) wallpaper in parallel with the hack animation so the
  // desktop underneath is fully rendered before we ever reveal it.
  useEffect(() => {
    const img = new Image();
    img.onload = () => setWallpaperReady(true);
    img.src = wallpaper;
    if (img.complete) setWallpaperReady(true);
  }, []);

  const handleGameComplete = useCallback(() => {
    setGameDone(true);
  }, []);

  const revealed = gameDone && wallpaperReady;

  useEffect(() => {
    if (!revealed) return;
    const t = setTimeout(() => setShowOverlay(false), FADE_MS);
    return () => clearTimeout(t);
  }, [revealed]);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Desktop />
      {showOverlay && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1000, overflow: "auto",
            opacity: revealed ? 0 : 1,
            transition: `opacity ${FADE_MS}ms ease`,
            pointerEvents: revealed ? "none" : "auto",
          }}
        >
          <BruteforceGame onComplete={handleGameComplete} />
        </div>
      )}
    </div>
  );
}
