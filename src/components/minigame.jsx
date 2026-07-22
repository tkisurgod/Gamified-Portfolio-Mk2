import { useState, useEffect, useRef, useCallback } from "react";
 
const TARGET = "PASSWORD";
const N = TARGET.length;
const LH = 54;
const VIS = 3;
const CH = VIS * LH;
const CENTER_ROW = Math.floor(VIS / 2);
const POOL = 10;
const TGT_IDX = 5;
const SPEEDS = [2.2, 1.85, 2.65, 2.0, 2.45, 1.7, 2.3, 1.95];
const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
 
const LOGS = [
  "CONNECTING TO REMOTE HOST 192.168.0.1...",
  "TLS HANDSHAKE ESTABLISHED.",
  "INJECTING BRUTEFORCE MODULE v3.1...",
  "CRACKING PASSWORD HASH... [████████████████] 100%",
  "DECRYPTION: SUCCESS  |  INTEGRITY: VERIFIED",
  "",
  "> BRUTEFORCE SUCCESSFUL.",
  "> ACCESS GRANTED.",
  "",
  "LOADING SECURE PAYLOAD...",
  "",
  "WELCOME.",
];
 
function mkStrip(t) {
  const a = Array.from({ length: POOL }, () => ABC[Math.floor(Math.random() * 26)]);
  a[TGT_IDX] = t;
  return a;
}

function BotIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      {/* antenna */}
      <circle cx="24" cy="5" r="3" fill="#001a00" />
      <rect x="23" y="7" width="2" height="5" fill="#001a00" />
      {/* head */}
      <rect x="8" y="12" width="32" height="26" rx="6" fill="#001a00" />
      {/* eyes */}
      <circle cx="18" cy="23" r="4" fill="#00ff55" />
      <circle cx="30" cy="23" r="4" fill="#00ff55" />
      {/* mouth */}
      <rect x="16" y="31" width="16" height="3" rx="1.5" fill="#00ff55" />
      {/* ears */}
      <rect x="3" y="20" width="4" height="10" rx="2" fill="#001a00" />
      <rect x="41" y="20" width="4" height="10" rx="2" fill="#001a00" />
    </svg>
  );
}
 
function useFont() {
  useEffect(() => {
    const el = document.createElement("link");
    el.rel = "stylesheet";
    el.href = "https://fonts.googleapis.com/css2?family=VT323&display=swap";
    document.head.appendChild(el);
    return () => { try { document.head.removeChild(el); } catch(_) {} };
  }, []);
}
 
function Loader({ onComplete }) {
  useFont();
  const [lines, setLines] = useState([]);
  const [cursor, setCursor] = useState(true);
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i < LOGS.length) setLines(p => [...p, LOGS[i++]]);
      else {
        clearInterval(iv);
        if (onComplete) setTimeout(onComplete, 1500);
      }
    }, 370);
    const ci = setInterval(() => setCursor(c => !c), 500);
    return () => { clearInterval(iv); clearInterval(ci); };
  }, [onComplete]);
  return (
    <div style={{
      minHeight: "100vh", background: "#000",
      display: "flex", flexDirection: "column",
      justifyContent: "center", padding: "8vw",
      fontFamily: "VT323, monospace",
    }}>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
      {lines.map((l, i) => (
        <div key={i} style={{
          fontSize: l.startsWith(">") ? 32 : 18,
          color: l.startsWith(">") ? "#00ff44" : l === "WELCOME." ? "#fff" : "#557755",
          marginBottom: l.startsWith(">") || l === "WELCOME." ? 10 : 5,
          animation: "slideIn 0.2s ease-out",
          textShadow: l.startsWith(">") ? "0 0 20px rgba(0,255,68,0.5)" : "none",
        }}>{l || "\u00A0"}</div>
      ))}
      {lines.length > 0 && (
        <span style={{
          display: "inline-block", width: 10, height: 20,
          background: "#00ff44", opacity: cursor ? 1 : 0, marginTop: 4,
        }}/>
      )}
    </div>
  );
}
 
export default function BruteforceGame({ onComplete }) {
  useFont();
  const [locked, setLocked] = useState([]);
  const [phase, setPhase] = useState("play");
  const [ripple, setRipple] = useState([]);   // columns that just got locked this press
  const [miss, setMiss] = useState(false);
  const [elapsed, setElapsed] = useState(0);
 
  const strips = useRef([]);
  // Stagger starting offsets so red letters don't all line up immediately
  const yOff = useRef(Array.from({ length: N }, (_, i) => (i * (POOL * LH / N)) % (POOL * LH)));
  const lockedR = useRef(new Set());
  const cols = useRef(Array.from({ length: N }, (_, i) => mkStrip(TARGET[i])));
  const t0 = useRef(Date.now());
  const phaseR = useRef("play");
 
  useEffect(() => {
    const iv = setInterval(() => setElapsed(Date.now() - t0.current), 47);
    return () => clearInterval(iv);
  }, []);
 
  useEffect(() => {
    let raf;
    const tick = () => {
      for (let i = 0; i < N; i++) {
        if (!lockedR.current.has(i) && strips.current[i]) {
          yOff.current[i] = (yOff.current[i] + SPEEDS[i]) % (POOL * LH);
          strips.current[i].style.transform = `translateY(-${yOff.current[i]}px)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
 
  const pressLock = useCallback(() => {
    if (phaseR.current !== "play") return;
 
    const hits = [];
    for (let i = 0; i < N; i++) {
      if (lockedR.current.has(i)) continue;
      const eff = yOff.current[i];
      const hitIdx = Math.floor((eff + CENTER_ROW * LH) / LH) % POOL;
      if (hitIdx === TGT_IDX) hits.push(i);
    }
 
    if (hits.length > 0) {
      hits.forEach(i => {
        lockedR.current.add(i);
        const exactY = (((TGT_IDX - CENTER_ROW) * LH) + POOL * LH) % (POOL * LH);
        yOff.current[i] = exactY;
        if (strips.current[i]) {
          strips.current[i].style.transition = "transform 0.1s ease-out";
          strips.current[i].style.transform = `translateY(-${exactY}px)`;
        }
      });
      setRipple(hits);
      setLocked(prev => {
        const next = [...new Set([...prev, ...hits])];
        if (next.length === N) {
          phaseR.current = "done";
          setTimeout(() => setPhase("done"), 700);
        }
        return next;
      });
      setTimeout(() => setRipple([]), 400);
    } else {
      setMiss(true);
      setTimeout(() => setMiss(false), 300);
    }
  }, []);
 
  const autoHack = useCallback(() => {
    if (phaseR.current !== "play") return;
    const exactY = (((TGT_IDX - CENTER_ROW) * LH) + POOL * LH) % (POOL * LH);
    for (let i = 0; i < N; i++) {
      if (lockedR.current.has(i)) continue;
      lockedR.current.add(i);
      yOff.current[i] = exactY;
      if (strips.current[i]) {
        strips.current[i].style.transition = "transform 0.35s cubic-bezier(0.2,0.9,0.3,1)";
        strips.current[i].style.transform = `translateY(-${exactY}px)`;
      }
    }
    setRipple(Array.from({ length: N }, (_, i) => i));
    setLocked(Array.from({ length: N }, (_, i) => i));
    phaseR.current = "done";
    setTimeout(() => setPhase("done"), 900);
  }, []);

  useEffect(() => {
    const h = e => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        pressLock();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [pressLock]);
 
  if (phase === "done") return <Loader onComplete={onComplete} />;
 
  const fmt = ms => {
    const m = String(Math.floor(ms / 60000)).padStart(2, "0");
    const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
    const c = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
    return `${m}:${s}:${c}`;
  };
 
  return (
    <div
      onClick={pressLock}
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse 120% 100% at 50% 30%, #1a4fa0, #0c2870 45%, #06133d 80%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "VT323, monospace", userSelect: "none",
        cursor: "crosshair",
      }}
    >
      <style>{`
        @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}60%{transform:translateX(8px)}}
        @keyframes rippleG{0%{background:rgba(0,255,68,0.22)}100%{background:transparent}}
        @keyframes missFlash{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes botPulse{0%,100%{transform:translateX(-50%) scale(1);box-shadow:0 0 40px rgba(0,255,68,0.55),0 0 80px rgba(0,255,68,0.25)}50%{transform:translateX(-50%) scale(1.05);box-shadow:0 0 60px rgba(0,255,68,0.85),0 0 120px rgba(0,255,68,0.4)}}
        .ripple{animation:rippleG 0.4s ease-out}
        .miss-col{animation:shake 0.32s ease}
        .win-pulse{animation:rippleG 0.4s ease-out}
        .autohack-btn:hover{filter:brightness(1.15)}
        .autohack-btn:active{transform:translateX(-50%) scale(0.97)}
      `}</style>
 
      {/* Instructions */}
      <div style={{
        position: "fixed", top: 24, left: 24,
        background: "rgba(0,5,25,0.92)", border: "2px solid #2a5dcc",
        color: "#ffffff", padding: "20px 24px", fontSize: 20, maxWidth: 340,
        lineHeight: 1.6, pointerEvents: "none",
        boxShadow: "0 0 30px rgba(30,80,220,0.35)",
      }}>
        <div style={{ color: "#ffffff", marginBottom: 12, letterSpacing: 3, fontSize: 22 }}>
          INSTRUCTIONS
        </div>
        To access my portfolio: align the letters in{" "}
        <span style={{ color: "#ff3b3b", fontWeight: "bold" }}>RED</span> to bruteforce inside{" "}
        <span style={{ color: "#8fb4ff" }}>OR</span> click the{" "}
        <span style={{ color: "#00ff55", fontWeight: "bold" }}>AUTO HACK BOT</span>.
      </div>

      {/* Auto Hack Bot button */}
      <button
        className="autohack-btn"
        onClick={e => { e.stopPropagation(); autoHack(); }}
        style={{
          position: "fixed", bottom: 34, left: "50%", transform: "translateX(-50%)",
          display: "flex", alignItems: "center", gap: 16,
          background: "linear-gradient(135deg, #00e63d, #00992a)",
          border: "3px solid #00ff55", borderRadius: 12,
          color: "#001a00", padding: "16px 34px",
          fontFamily: "VT323, monospace", fontSize: 34, letterSpacing: 3,
          cursor: "pointer", zIndex: 50,
          animation: "botPulse 1.5s ease-in-out infinite",
        }}
      >
        <BotIcon size={44} />
        AUTO HACK BOT
      </button>
 
      {/* Main window */}
      <div style={{
        border: "2px solid #2a5dcc",
        boxShadow: "0 0 50px rgba(30,80,220,0.35), 0 0 100px rgba(10,40,140,0.25)",
        background: "#04060f",
        width: 660, overflow: "hidden",
        outline: miss ? "2px solid rgba(255,50,50,0.5)" : "1px solid rgba(80,120,255,0.15)",
        transition: "outline 0.1s",
      }}>
        {/* Title bar */}
        <div style={{
          background: "linear-gradient(90deg, #001355 0%, #002f99 50%, #001355 100%)",
          padding: "6px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid #1a3d99",
        }}>
          <span style={{ color: "#7aa4e8", fontSize: 15, letterSpacing: 3 }}>
            ▓ BRUTEFORCE v3.1 — TERMINAL ACCESS
          </span>
          <div style={{ display: "flex", gap: 3, alignItems: "flex-end" }}>
            {[10, 14, 18, 22, 26].map((h, i) => (
              <div key={i} style={{ width: 7, height: h, background: i < 4 ? "#00dd33" : "#1a2a1a" }}/>
            ))}
          </div>
        </div>
 
        {/* Body */}
        <div style={{ padding: "18px 28px 0" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 2, background: "linear-gradient(90deg, transparent, #00bb33)" }}/>
              <span style={{
                color: "#00ff44", fontSize: 50, letterSpacing: 10,
                textShadow: "0 0 30px rgba(0,255,68,0.45)",
              }}>BRUTEFORCE</span>
              <div style={{ flex: 1, height: 2, background: "linear-gradient(90deg, #00bb33, transparent)" }}/>
            </div>
            <div style={{ color: "#334433", fontSize: 14, letterSpacing: 4, marginTop: -4 }}>
              —BUSTING THROUGH THE BACKDOOR SINCE 1998—
            </div>
          </div>
 
          {/* Timer + counters */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 16,
          }}>
            <div style={{ color: "#334455", fontSize: 17, letterSpacing: 1 }}>
              LOCKED <span style={{ color: "#00cc33" }}>{locked.length}</span>
              <span style={{ color: "#1a2a3a" }}>/{N}</span>
            </div>
            <div style={{ color: "#00dd33", fontSize: 28, letterSpacing: 4 }}>{fmt(elapsed)}</div>
            <div style={{ color: "#334455", fontSize: 17, letterSpacing: 1 }}>
              LEFT <span style={{ color: N - locked.length > 0 ? "#dd6633" : "#00cc33" }}>
                {N - locked.length}
              </span>
            </div>
          </div>
 
          {/* Columns */}
          <div style={{ display: "flex", justifyContent: "center", gap: 2, position: "relative" }}>
            {/* Blue center strip */}
            <div style={{
              position: "absolute", top: CENTER_ROW * LH, left: 0, right: 0, height: LH,
              background: "rgba(15,60,200,0.28)",
              borderTop: "1px solid rgba(60,130,255,0.55)",
              borderBottom: "1px solid rgba(60,130,255,0.55)",
              pointerEvents: "none", zIndex: 5,
            }}/>
 
            {Array.from({ length: N }, (_, ci) => {
              const isLocked = locked.includes(ci);
              const justLocked = ripple.includes(ci);
              const letters = cols.current[ci];
              return (
                <div
                  key={ci}
                  className={justLocked ? "ripple" : ""}
                  style={{
                    width: 58, height: CH, overflow: "hidden", position: "relative",
                    outline: isLocked ? "1px solid rgba(0,220,60,0.3)" : "none",
                  }}
                >
                  {/* Top fade */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 42,
                    background: "linear-gradient(180deg, #04060f, transparent)",
                    pointerEvents: "none", zIndex: 4,
                  }}/>
                  {/* Bottom fade */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: 42,
                    background: "linear-gradient(0deg, #04060f, transparent)",
                    pointerEvents: "none", zIndex: 4,
                  }}/>
 
                  <div
                    ref={el => { strips.current[ci] = el; }}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%" }}
                  >
                    {[...letters, ...letters].map((ch, li) => {
                      const ri = li % POOL;
                      const isTgt = ri === TGT_IDX;
                      let color = "rgba(160,165,185,0.4)";
                      if (!isLocked && isTgt) color = "#ff2222";
                      if (isLocked && isTgt) color = "#00ff44";
                      if (isLocked && !isTgt) color = "rgba(70,90,65,0.2)";
                      return (
                        <div key={li} style={{
                          height: LH,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 42, color,
                          textShadow:
                            isLocked && isTgt ? "0 0 16px rgba(0,255,68,0.7)" :
                            !isLocked && isTgt ? "0 0 14px rgba(255,30,30,0.75)" : "none",
                        }}>{ch}</div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
 
          {/* Bottom bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderTop: "1px solid #0c1122", marginTop: 14, padding: "14px 0",
          }}>
            <div style={{ color: "#334", fontSize: 19 }}>
              Hack the{" "}
              <span style={{ color: "#5588dd", textDecoration: "underline" }}>terminal</span>.
            </div>
 
            {/* Space bar prompt */}
            <div style={{ textAlign: "center" }}>
              <div style={{
                color: miss ? "#ff4422" : "#4477cc",
                fontSize: 20, letterSpacing: 4,
                textShadow: miss ? "0 0 12px rgba(255,60,20,0.6)" : "0 0 10px rgba(50,100,220,0.4)",
                transition: "color 0.1s, text-shadow 0.1s",
              }}>
                PRESS SPACE TO LOCK IN
              </div>
              <div style={{ color: "#1e2e44", fontSize: 13, letterSpacing: 2, marginTop: 2 }}>
                or click anywhere
              </div>
            </div>
 
            <div style={{ textAlign: "right", color: "#334455", fontSize: 14 }}>
              <div style={{ letterSpacing: 2 }}>TEAM LIVES</div>
              <div style={{ color: "#dd5533", fontSize: 28 }}>∞</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}