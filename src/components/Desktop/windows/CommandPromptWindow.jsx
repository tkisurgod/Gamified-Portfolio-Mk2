import { useState, useRef, useEffect, useCallback } from "react";

// A fake terminal: knows a handful of commands, all of which exist purely to
// make the operator look good. Minimum functionality, maximum swagger.
const PROMPT = "C:\\Users\\keith>";

const BANNER = [
  "Microsoft Windows XP [Version 5.1.2600]",
  "(C) Copyright 1985-2001 Microsoft Corp.  Personality patch by keith.",
  "",
  'Type "help" for a list of commands. Type "sudo hire keith" if convinced.',
  "",
];

const SKILL_BARS = [
  ["Python      ", 12],
  ["FastAPI     ", 11],
  ["Docker      ", 10],
  ["PostgreSQL  ", 9],
  ["Security    ", 11],
  ["Humility    ", 3],
];

// Each command returns an array of output lines (or a special signal).
const COMMANDS = {
  help: () => [
    "Available commands:",
    "  whoami       - identify the operator",
    "  skills       - render competency bars",
    "  projects     - list shipped work",
    "  hire         - see hiring status",
    "  motd         - message of the day",
    "  coffee       - brew coffee (may fail)",
    "  cls          - clear the screen",
    "",
    "Hidden commands exist. You look like someone who'd find them.",
  ],
  whoami: () => [
    "tomkeith nganyi",
    "  role:    backend & security engineer (certified menace)",
    "  status:  shipping features, deploying on Fridays",
    "  threat:  to your open headcount",
  ],
  skills: () => [
    "Scanning competency matrix...",
    "",
    ...SKILL_BARS.map(
      ([name, n]) =>
        `  ${name} [${"█".repeat(n)}${"░".repeat(12 - n)}] ${Math.round((n / 12) * 100)}%`
    ),
    "",
    "  note: 'Humility' left intentionally low for realism.",
  ],
  projects: () => [
    "Indexing repositories...",
    "  [1] casl-enterprise-backend  - FastAPI, Redis, Celery, Docker",
    "  [2] gym-bras                 - Flutter cross-platform app",
    "  [3] security-scripts         - automated recon & log analysis",
    "",
    "  git clone the confidence.",
  ],
  hire: () => [
    "Checking hiring pipeline...",
    "  candidate:      keith",
    "  recommendation: STRONG HIRE",
    "  blocking issue: you haven't emailed him yet",
    "  fix:            keithtom5154@gmail.com",
  ],
  motd: () => [
    '"It works on my machine" - keith, moments before it also worked on yours.',
  ],
  coffee: () => [
    "Brewing coffee...",
    "ERROR 418: I'm a teapot. Falling back to sheer willpower.",
    "Productivity unaffected.",
  ],
  matrix: () => [
    "Wake up, recruiter...",
    "01001000 01001001 01010010 01000101 00100000 01001011",
    "The Matrix has you. So does keith's resume.",
  ],
};

function runCommand(raw) {
  const input = raw.trim();
  if (!input) return { lines: [] };
  const lower = input.toLowerCase();

  if (lower === "cls" || lower === "clear") return { clear: true };
  if (lower === "sudo hire keith" || lower === "hire keith") {
    return {
      lines: [
        "[sudo] password for reality: ********",
        "Permission granted. Excellent choice.",
        "Onboarding keith... 100% complete. ✅",
      ],
    };
  }
  if (lower === "ls" || lower === "dir") {
    return {
      lines: [
        " Directory of C:\\Users\\keith",
        "",
        "  resume.docx        talent.exe        ambition.dll",
        "  side_projects\\     caffeine.log      no_free_time\\",
      ],
    };
  }
  if (lower.startsWith("cd")) return { lines: ["Access denied: keith is always moving up, never back."] };
  if (lower.startsWith("rm") || lower.startsWith("del")) {
    return { lines: ["Nice try. This drive is protected by pure motivation."] };
  }

  const fn = COMMANDS[lower];
  if (fn) return { lines: fn() };
  return { lines: [`'${input}' is not recognized, but keith probably is. Type "help".`] };
}

export default function CommandPromptWindow() {
  const [history, setHistory] = useState(() =>
    BANNER.map((text) => ({ type: "out", text }))
  );
  const [value, setValue] = useState("");
  const [past, setPast] = useState([]); // command history for up/down
  const [histIdx, setHistIdx] = useState(-1);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const submit = useCallback(() => {
    const entry = value;
    const result = runCommand(entry);
    if (result.clear) {
      setHistory([]);
    } else {
      setHistory((prev) => [
        ...prev,
        { type: "cmd", text: entry },
        ...result.lines.map((text) => ({ type: "out", text })),
      ]);
    }
    if (entry.trim()) setPast((p) => [...p, entry]);
    setHistIdx(-1);
    setValue("");
  }, [value]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") { submit(); return; }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!past.length) return;
        const idx = histIdx < 0 ? past.length - 1 : Math.max(0, histIdx - 1);
        setHistIdx(idx);
        setValue(past[idx]);
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (histIdx < 0) return;
        const idx = histIdx + 1;
        if (idx >= past.length) { setHistIdx(-1); setValue(""); }
        else { setHistIdx(idx); setValue(past[idx]); }
      }
    },
    [submit, histIdx, past]
  );

  return (
    <div
      ref={scrollRef}
      onClick={() => inputRef.current?.focus()}
      style={{
        background: "#000", color: "#e8e8e8", height: "100%", overflow: "auto",
        fontFamily: "Consolas, 'Lucida Console', monospace", fontSize: 13, lineHeight: 1.45,
        padding: "8px 10px", cursor: "text",
      }}
    >
      {history.map((h, i) => (
        <div key={i} style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {h.type === "cmd" ? (
            <span><span style={{ color: "#7dff7d" }}>{PROMPT}</span> {h.text}</span>
          ) : (
            h.text || " "
          )}
        </div>
      ))}
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ color: "#7dff7d", whiteSpace: "pre" }}>{PROMPT} </span>
        <input
          ref={inputRef}
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            color: "#e8e8e8", fontFamily: "inherit", fontSize: "inherit", padding: 0,
          }}
        />
      </div>
    </div>
  );
}
