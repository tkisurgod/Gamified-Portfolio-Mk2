import resumeFile from "../../../assets/desktop-assets/Tomkeith_Nganyi_CV.docx";

const skills = {
  "Programming & Web": "Python, JavaScript, Dart, SQL, C, C++, HTML5, CSS3",
  "Frameworks & Libraries": "FastAPI, Flutter, React Native, SQLAlchemy",
  "Tools & Platforms": "Docker, Docker Compose, Redis, Celery, Git, GitHub, Linux CLI, AWS S3 (basic), Postman/Swagger",
  "Concepts": "RESTful APIs, Backend Architecture, Containerization, Asynchronous Programming, Database Management, Threat Mitigation, Information Security",
};

const projects = [
  {
    name: "CASL Enterprise API — Backend Service",
    link: "github.com/SOLERTIAsolutions/casl-enterprise-backend",
    points: [
      "Designed and developed an enterprise-grade backend for managing heavy drone media and secure user sessions using Python and FastAPI.",
      "Implemented secure JWT authentication with an instant token-revocation kill switch, plus Redis-powered rate limiting to protect infrastructure.",
      "Orchestrated a decoupled architecture using Celery for asynchronous video processing and PostgreSQL for relational data, fully containerized with Docker.",
    ],
  },
  {
    name: "Gym-Bras Mobile Application (Ongoing)",
    link: "github.com/TKgatnun/gym-bras",
    points: [
      "Building a cross-platform fitness and gym management app using Flutter and Dart.",
      "Designing a responsive, intuitive UI/UX with efficient state management, built to integrate with backend RESTful APIs for authentication and data tracking.",
    ],
  },
  {
    name: "Security Automation Scripts",
    link: "github.com/TKgatnun/security-scripts",
    points: [
      "Wrote Python scripts to automate network scanning, log analysis, and threat detection, bridging software development and security principles.",
      "Used Linux environments and CLI tools to simulate and analyze network vulnerabilities, optimizing script performance under resource constraints.",
    ],
  },
];

const certifications = [
  "Security+ (In Progress) — CompTIA",
  "Introduction to SQL — Simplilearn",
  "Building AI Agents — MongoDB",
  "Building RAG Applications — MongoDB",
];

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        fontFamily: "Consolas, monospace", fontSize: 11, letterSpacing: 2,
        color: "#8a1f1f", borderBottom: "1px solid #c9c2a8", paddingBottom: 4, marginBottom: 8,
      }}>{title}</div>
      {children}
    </div>
  );
}

export default function ResumeWindow() {
  return (
    <div style={{ fontFamily: '"Segoe UI", Tahoma, Verdana, sans-serif', color: "#2a2a2a" }}>
      <div style={{
        background: "#1a1a1a", color: "#7dff7d", fontFamily: "Consolas, monospace",
        fontSize: 11, padding: "8px 16px", lineHeight: 1.6,
      }}>
        <div>FILE: Tomkeith_Nganyi_CV.docx &nbsp; SIZE: 10.6KB &nbsp; STATUS: <span style={{ color: "#fff" }}>DECRYPTED</span></div>
        <div>RECOVERED FROM: /home/keith/Documents/ &nbsp; INTEGRITY: VERIFIED</div>
      </div>

      <div style={{ padding: "20px 26px 26px" }}>
        <h1 style={{ fontSize: 22, margin: "0 0 2px", letterSpacing: 1 }}>TOMKEITH NGANYI</h1>
        <div style={{ fontSize: 12, color: "#555", marginBottom: 18 }}>
          Athi River, Kenya &nbsp;|&nbsp; +254 722 334 210 &nbsp;|&nbsp; keithtom5154@gmail.com &nbsp;|&nbsp;{" "}
          <a href="https://github.com/TKgatnun" target="_blank" rel="noreferrer">github.com/TKgatnun</a> &nbsp;|&nbsp;{" "}
          <a href="https://linkedin.com/in/keithtom20" target="_blank" rel="noreferrer">linkedin.com/in/keithtom20</a>
        </div>

        <Section title="PROFESSIONAL SUMMARY">
          <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            Third-year Applied Computer Science student at Daystar University transitioning from a cybersecurity
            foundation into software and backend engineering. Experienced building scalable, secure, containerized
            backend systems with Python, FastAPI, and PostgreSQL, applying a security-first mindset to RESTful API
            development, JWT authentication, caching, and background task processing. Seeking an industrial
            attachment to apply full-stack and backend development skills in a fast-paced engineering team.
          </p>
        </Section>

        <Section title="TECHNICAL SKILLS">
          {Object.entries(skills).map(([k, v]) => (
            <div key={k} style={{ fontSize: 13, marginBottom: 4 }}>
              <strong>{k}:</strong> {v}
            </div>
          ))}
        </Section>

        <Section title="PROJECTS">
          {projects.map((p) => (
            <div key={p.name} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13.5, fontWeight: "bold" }}>
                {p.name} — <span style={{ fontWeight: "normal", color: "#3355aa", fontFamily: "Consolas, monospace", fontSize: 12 }}>{p.link}</span>
              </div>
              <ul style={{ margin: "4px 0 0", paddingLeft: 20 }}>
                {p.points.map((pt, i) => (
                  <li key={i} style={{ fontSize: 12.5, lineHeight: 1.55, marginBottom: 2 }}>{pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>

        <Section title="EDUCATION">
          <div style={{ fontSize: 13, fontWeight: "bold" }}>Bachelor of Science in Applied Computer Science</div>
          <div style={{ fontSize: 12.5, marginBottom: 4 }}>Daystar University, Nairobi, Kenya — 2023 to 2027</div>
          <div style={{ fontSize: 12, color: "#555" }}>
            Relevant Coursework: System Analysis and Design, Data Structures and Algorithms, Operating Systems
            (Linux/Unix), Network Security and Infrastructure, Database Management, Digital Logic and Structured
            Programming.
          </div>
        </Section>

        <Section title="CERTIFICATIONS">
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {certifications.map((c) => (
              <li key={c} style={{ fontSize: 12.5, lineHeight: 1.6 }}>{c}</li>
            ))}
          </ul>
        </Section>

        <a
          href={resumeFile}
          download="Tomkeith_Nganyi_CV.docx"
          style={{
            display: "inline-block", marginTop: 6, padding: "8px 16px",
            background: "#245edb", color: "#fff", fontSize: 12.5, textDecoration: "none",
            borderRadius: 3, border: "1px solid #143a90",
          }}
        >⬇ Download original file</a>
      </div>
    </div>
  );
}
