# Gamified Portfolio — Mk2

> A developer portfolio that makes you earn access.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=000)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=fff)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Deploy](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-222?logo=githubpages)](https://tkisurgod.github.io/Gamified-Portfolio-Mk2)

**Live demo:** https://tkisurgod.github.io/Gamified-Portfolio-Mk2

---

## About

This isn't a static resume page — it's an interactive terminal-hacking sequence that gates the actual portfolio. Visitors have to "crack" a scrolling password lock before the CV content unlocks, a small, playable statement that this is a developer who thinks about **security-first UX**, not just another React template with a bio and a contact form.

The concept: a retro CRT-styled bruteforce minigame (think Fallout terminal hacking) runs first. Successfully locking in every letter of the target password triggers a simulated exploit log — handshake, injection, decryption, access granted — before handing off to the portfolio itself.

## Features

- 🔓 **Bruteforce minigame gate** — scrolling letter-lock puzzle built with `requestAnimationFrame`, no libraries, no canvas
- 🖥️ **Terminal boot sequence** — animated exploit log with a blinking cursor, played on successful "hack"
- ⚡ **Zero-dependency animation** — all motion is native CSS keyframes + refs, kept deliberately light
- 📄 **Portfolio payload** — your CV content renders only after the gate is cleared (`src/components/Home.jsx`)

## Tech Stack

| Layer      | Tool |
|------------|------|
| UI         | [React 19](https://react.dev) |
| Build tool | [Vite 8](https://vitejs.dev) |
| Linting    | [ESLint 9](https://eslint.org) (flat config, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`) |
| Deployment | [gh-pages](https://www.npmjs.com/package/gh-pages) → GitHub Pages |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 20.19+ or 22.12+
- npm 10+

### Installation

```bash
git clone https://github.com/tkisurgod/Gamified-Portfolio-Mk2.git
cd Gamified-Portfolio-Mk2
npm install
```

### Run locally

```bash
npm run dev
```

Vite will start a dev server (default: http://localhost:5173) with hot module reload.

## Available Scripts

| Command           | Description                                              |
|--------------------|-----------------------------------------------------------|
| `npm run dev`      | Start the Vite dev server with HMR                        |
| `npm run build`    | Type-check and build a production bundle to `dist/`       |
| `npm run preview`  | Serve the production build locally for a final check      |
| `npm run lint`     | Run ESLint across the project                             |
| `npm run deploy`   | Build and publish `dist/` to the `gh-pages` branch         |

## Project Structure

```
Gamified-Portfolio-Mk2/
├── public/                # Static assets (favicon, icon sprite) served as-is
├── src/
│   ├── assets/             # Images used inside components
│   ├── components/
│   │   ├── minigame.jsx    # Bruteforce hacking gate + terminal boot loader
│   │   └── Home.jsx        # Main portfolio content, rendered after the gate
│   ├── App.jsx              # Top-level flow: minigame → portfolio
│   ├── main.jsx              # React entry point
│   └── index.css / App.css   # Global + app styles
├── index.html
├── vite.config.js           # Vite config (base path set for GitHub Pages)
└── eslint.config.js
```

## Deployment

This project deploys to **GitHub Pages** via the `gh-pages` package, publishing the built `dist/` folder to the `gh-pages` branch.

```bash
npm run deploy
```

This runs `predeploy` (`npm run build`) automatically, then pushes the build output to `gh-pages`. Make sure `vite.config.js`'s `base` and `package.json`'s `homepage` match your GitHub Pages URL (`/Gamified-Portfolio-Mk2/` and `https://tkisurgod.github.io/Gamified-Portfolio-Mk2` respectively) if you fork this.

In your repository settings, set **Pages → Source** to the `gh-pages` branch.

## Roadmap

- [ ] Flesh out `Home.jsx` with real CV content (experience, projects, security write-ups)
- [ ] Add a skip/replay toggle for the minigame on repeat visits
- [ ] Accessibility pass on the minigame (keyboard-only is supported; screen-reader fallback is not yet)

## License

Licensed under the [MIT License](LICENSE).
