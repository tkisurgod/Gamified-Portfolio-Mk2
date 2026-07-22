import {
  CommandPromptIcon,
  TaskManagerIcon,
  TrophyIcon,
  MyComputerIcon,
  ResumeIcon,
  PicturesIcon,
} from "./icons";

// The Start menu is the real navigation hub: it launches the "apps" (which are
// mostly personality) and holds the genuine links a recruiter actually wants.
const PINNED = [
  {
    kind: "cmd",
    label: "Command Prompt",
    sub: "certified menace edition",
    Icon: CommandPromptIcon,
  },
  {
    kind: "taskmgr",
    label: "Task Manager",
    sub: "see what's really running",
    Icon: TaskManagerIcon,
  },
  {
    kind: "achievements",
    label: "Achievements",
    sub: "1,329 gamerscore",
    Icon: TrophyIcon,
  },
  {
    kind: "resume",
    label: "My Resume",
    sub: "recovered & decrypted",
    Icon: ResumeIcon,
  },
];

const LINKS = [
  { label: "My Computer", kind: "mycomputer", Icon: MyComputerIcon },
  { label: "My Pictures", kind: "photos", Icon: PicturesIcon },
];

const EXTERNAL = [
  { label: "GitHub", href: "https://github.com/TKisurgod", emoji: "🐙" },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/keithtom20",
    emoji: "💼",
  },
  { label: "Email keith", href: "mailto:keithtom5154@gmail.com", emoji: "✉️" },
];

function Row({ Icon, emoji, label, sub, bold, onClick, href }) {
  const style = {
    display: "flex",
    alignItems: "left",
    gap: 8,
    padding: "5px 10px",
    cursor: "pointer",
    textDecoration: "none",
    borderRadius: 2,
  };
  const hover = (e, on) => {
    e.currentTarget.style.background = on ? "#2f5fd6" : "transparent";
    e.currentTarget.querySelectorAll("span").forEach((s) => {
      s.style.color = on ? "#fff" : s.dataset.c;
    });
  };
  const children = (
    <>
      <div
        style={{
          width: 30,
          height: 30,
          display: "flex",
          alignItems: "left",
          justifyContent: "left",
          flexShrink: 0,
        }}
      >
        {Icon ? (
          <div style={{ transform: "scale(0.62)" }}>
            <Icon />
          </div>
        ) : (
          <span style={{ fontSize: 20 }}>{emoji}</span>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          lineHeight: 1.2,
          overflow: "hidden",
        }}
      >
        <span
          data-c="#0a246a"
          style={{
            fontSize: 12.5,
            fontWeight: bold ? "bold" : 600,
            color: "#0a246a",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
        {sub && (
          <span
            data-c="#888"
            style={{ fontSize: 10.5, color: "#888", whiteSpace: "nowrap" }}
          >
            {sub}
          </span>
        )}
      </div>
    </>
  );
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={onClick}
      onMouseEnter={(e) => hover(e, true)}
      onMouseLeave={(e) => hover(e, false)}
      style={style}
    >
      {children}
    </a>
  ) : (
    <div
      onClick={onClick}
      onMouseEnter={(e) => hover(e, true)}
      onMouseLeave={(e) => hover(e, false)}
      style={style}
    >
      {children}
    </div>
  );
}

export default function StartMenu({ onOpen, onClose }) {
  const launch = (kind) => {
    onOpen(kind);
    onClose();
  };

  return (
    <>
      {/* Click-away backdrop */}
      <div
        onPointerDown={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 9998 }}
      />

      <div
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          left: 4,
          bottom: 34,
          width: 380,
          zIndex: 9999,
          borderRadius: "8px 8px 0 0",
          overflow: "hidden",
          border: "1px solid #0831d9",
          borderBottom: "none",
          boxShadow: "3px -3px 16px rgba(0,0,0,0.5)",
          fontFamily: '"Segoe UI", Tahoma, Verdana, sans-serif',
          animation: "startMenuIn 0.12s ease-out",
        }}
      >
        <style>{`@keyframes startMenuIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            background:
              "linear-gradient(180deg, #1c60d8 0%, #1550c8 40%, #0f43b8 100%)",
            borderBottom: "2px solid #ff9d33",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 4,
              background: "#c33",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              border: "2px solid #fff",
            }}
          >
            ♟️
          </div>
          <span
            style={{
              color: "#fff",
              fontSize: 15,
              fontWeight: "bold",
              textShadow: "1px 1px 2px rgba(0,0,0,0.4)",
            }}
          >
            keith — Administrator
          </span>
        </div>

        {/* Body: two columns */}
        <div style={{ display: "flex" }}>
          <div
            style={{ flex: "1 1 55%", background: "#fff", padding: "6px 4px" }}
          >
            {PINNED.map((p) => (
              <Row
                key={p.kind}
                Icon={p.Icon}
                label={p.label}
                sub={p.sub}
                bold
                onClick={() => launch(p.kind)}
              />
            ))}
            <div
              style={{ borderTop: "1px solid #ccd4e8", margin: "5px 8px" }}
            />
            {EXTERNAL.map((e) => (
              <Row
                key={e.label}
                emoji={e.emoji}
                label={e.label}
                href={e.href}
                onClick={onClose}
              />
            ))}
          </div>

          <div
            style={{
              flex: "1 1 45%",
              background: "linear-gradient(180deg, #d3e0f5 0%, #c2d4ef 100%)",
              padding: "6px 4px",
              borderLeft: "1px solid #b0c4e8",
            }}
          >
            {LINKS.map((l) => (
              <Row
                key={l.kind}
                Icon={l.Icon}
                label={l.label}
                onClick={() => launch(l.kind)}
              />
            ))}
            <div
              style={{ borderTop: "1px solid #a9bfe0", margin: "5px 8px" }}
            />
            <Row
              emoji="🗑️"
              label="Recycle Bin"
              onClick={() => launch("recycle")}
            />
            <Row emoji="❓" label="Help and Support" onClick={onClose} />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 16,
            padding: "7px 16px",
            background: "linear-gradient(180deg, #2f6fd8 0%, #1550c8 100%)",
            borderTop: "2px solid #ff9d33",
          }}
        >
          <button onClick={onClose} style={footBtn}>
            <span style={{ fontSize: 16 }}>🔒</span> Log Off
          </button>
          <button onClick={onClose} style={footBtn}>
            <span style={{ fontSize: 16 }}>⏻</span> Turn Off
          </button>
        </div>
      </div>
    </>
  );
}

const footBtn = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  background: "transparent",
  border: "none",
  color: "#fff",
  fontSize: 12,
  cursor: "pointer",
  fontFamily: "inherit",
  textShadow: "1px 1px 1px rgba(0,0,0,0.3)",
};
