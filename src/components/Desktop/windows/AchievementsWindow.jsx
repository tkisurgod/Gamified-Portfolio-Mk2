import { useState, useCallback } from "react";

// An Xbox-style trophy wall of humblebrags. Click a trophy to expand its
// "proof". The last one is locked and unlocks with a click — because you,
// dear recruiter, are the one who unlocks it.
const TROPHIES = [
  { id: "ship", icon: "🚀", name: "Ship It", pts: 50, rarity: "Common", desc: "Deployed a containerized FastAPI backend to production. On a Friday. It held." },
  { id: "sec", icon: "🛡️", name: "Security First", pts: 90, rarity: "Rare", desc: "Built JWT auth with an instant token-revocation kill switch. Attackers hate this one trick." },
  { id: "async", icon: "⚡", name: "Async Ascendant", pts: 70, rarity: "Uncommon", desc: "Orchestrated Celery + Redis for background video processing without blocking a single request." },
  { id: "regex", icon: "🧙", name: "Understood My Own Regex", pts: 100, rarity: "Legendary", desc: "Wrote a regular expression and could still explain it a week later. Unprecedented." },
  { id: "coffee", icon: "☕", name: "Powered by Willpower", pts: 20, rarity: "Common", desc: "Shipped features while coffee.exe was Not Responding. Runs on ambition." },
];

const LOCKED = {
  id: "hire", icon: "🏆", name: "Signed the Offer", pts: 999, rarity: "Mythic",
  desc: "Awarded the moment you hit reply. keithtom5154@gmail.com is standing by.",
};

const rarityColor = {
  Common: "#8a8a8a", Uncommon: "#3fae3f", Rare: "#2f7ad6",
  Legendary: "#c9902a", Mythic: "#a23fd6",
};

export default function AchievementsWindow() {
  const [open, setOpen] = useState(null);
  const [unlocked, setUnlocked] = useState(false);

  const toggle = useCallback((id) => setOpen((cur) => (cur === id ? null : id)), []);

  const earned = TROPHIES.reduce((s, t) => s + t.pts, 0) + (unlocked ? LOCKED.pts : 0);
  const list = unlocked ? [...TROPHIES, LOCKED] : TROPHIES;

  return (
    <div style={{ fontFamily: '"Segoe UI", Tahoma, sans-serif', color: "#eee", height: "100%", overflow: "auto", background: "linear-gradient(160deg, #1b2a1b 0%, #10331a 100%)" }}>
      {/* Gamerscore header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid #2e5a2e", background: "rgba(0,0,0,0.25)" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: "bold", letterSpacing: 0.5 }}>keith — Achievements</div>
          <div style={{ fontSize: 11.5, color: "#9fd39f" }}>{list.length} of {TROPHIES.length + 1} unlocked</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: "bold", color: "#7dff7d", fontFamily: "Consolas, monospace" }}>{earned.toLocaleString()}</div>
          <div style={{ fontSize: 10, color: "#9fd39f", letterSpacing: 1 }}>GAMERSCORE</div>
        </div>
      </div>

      <div style={{ padding: "12px 14px" }}>
        {list.map((t) => {
          const isLocked = t.id === LOCKED.id && !unlocked; // never true given list logic, kept for clarity
          const expanded = open === t.id;
          return (
            <div
              key={t.id}
              onClick={() => toggle(t.id)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 12px", marginBottom: 8,
                background: expanded ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${expanded ? rarityColor[t.rarity] : "rgba(255,255,255,0.08)"}`,
                borderRadius: 6, cursor: "pointer", transition: "background 0.15s",
              }}
            >
              <div style={{ fontSize: 30, lineHeight: 1, filter: isLocked ? "grayscale(1) brightness(0.5)" : "none" }}>{t.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 13.5, fontWeight: "bold" }}>{t.name}</span>
                  <span style={{ fontSize: 12, color: "#7dff7d", fontFamily: "Consolas, monospace" }}>{t.pts} G</span>
                </div>
                <div style={{ fontSize: 10.5, color: rarityColor[t.rarity], letterSpacing: 1, marginTop: 1 }}>{t.rarity.toUpperCase()}</div>
                {expanded && (
                  <div style={{ fontSize: 12, color: "#dfeadf", marginTop: 6, lineHeight: 1.5 }}>{t.desc}</div>
                )}
              </div>
            </div>
          );
        })}

        {/* Locked achievement CTA */}
        {!unlocked && (
          <div
            onClick={() => setUnlocked(true)}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px",
              background: "rgba(0,0,0,0.35)", border: "1px dashed #a23fd6", borderRadius: 6,
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 30, filter: "grayscale(1) brightness(0.6)" }}>🔒</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: "bold", color: "#c9a0e0" }}>??? — Locked</div>
              <div style={{ fontSize: 11.5, color: "#b090c8", marginTop: 2 }}>Click to reveal the final achievement.</div>
            </div>
            <div style={{ fontSize: 11, color: "#7dff7d", fontFamily: "Consolas, monospace" }}>+999 G</div>
          </div>
        )}
      </div>
    </div>
  );
}
