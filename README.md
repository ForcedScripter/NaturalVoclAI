# NaturalVoclAI (MINISTROS)

Front-end for the **MINISTROS** AI voice agent demo — marketing site, interactive hero scenarios, live voice demo, insights, and community feedback.

**Live demo:** [natural-vocl-ai.vercel.app](https://natural-vocl-ai.vercel.app)  
**Repository:** [github.com/ForcedScripter/NaturalVoclAI](https://github.com/ForcedScripter/NaturalVoclAI)

---

## Where to run the project (important)

This repository contains **two copies** of the Next.js app:

| Path | Purpose |
|------|---------|
| **`NaturalVoclAI/`** | **Use this folder** — active app with the latest pages and fixes. Run all commands here. |
| Repository root (`src/`, `public/`, etc.) | Older duplicate used by root-level Docker config. **Do not** run `npm run dev` from the repo root unless you intentionally maintain that copy. |

If you clone the repo and run from the wrong folder, you may see an old UI or get `'next' is not recognized` (because `node_modules` is not installed at the root).

### Correct working directory

```text
NaturalVoclAI/          ← cd here
├── package.json
├── next.config.ts
├── public/
├── src/
│   ├── app/            ← pages (home, features, insights, …)
│   └── components/
└── node_modules/       ← created after npm install
```

---

## Prerequisites

- **Node.js** 20.x or newer ([nodejs.org](https://nodejs.org))
- **npm** (comes with Node)
- Optional: a separate **voice/RAG backend** on port `8805` for the live demo and auth APIs (not included in this repo)

---

## Quick start

### 1. Clone the repository

```bash
git clone https://github.com/ForcedScripter/NaturalVoclAI.git
cd NaturalVoclAI
```

### 2. Enter the app folder

```bash
cd NaturalVoclAI
```

On Windows (PowerShell):

```powershell
cd NaturalVoclAI
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a file named **`.env.local`** inside `NaturalVoclAI/`:

```env
# Voice / RAG backend (required for live demo, upload, chat, login)
BACKEND_URL=http://localhost:8805

# WebSocket for real-time audio (optional; defaults to ws://localhost:8805/ws)
NEXT_PUBLIC_WS_URL=ws://localhost:8805/ws

# Community feedback form (Web3Forms) — get a key at https://web3forms.com
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_web3forms_access_key

# Auth (server-side; change in production)
JWT_SECRET=your-secret-key-change-in-production
```

| Variable | Required | Description |
|----------|----------|-------------|
| `BACKEND_URL` | For demo & auth | Base URL of the Python/backend service (default dev: `http://localhost:8805`) |
| `NEXT_PUBLIC_WS_URL` | Optional | WebSocket URL for live audio streaming |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | For community form | Public Web3Forms key for `/community` feedback |
| `JWT_SECRET` | For login sessions | Secret used to sign session cookies |

The site will load without a backend, but **“Test the Agent”**, document upload, and voice chat will not work until `BACKEND_URL` is reachable.

### 5. Start the development server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 6. Production build (optional)

```bash
npm run build
npm run start
```

Runs the optimized app on port 3000 by default.

---

## npm scripts

Run these from **`NaturalVoclAI/`**:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload (Turbopack) |
| `npm run build` | Create production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

---

## Project structure (inside `NaturalVoclAI/`)

```text
src/
├── app/
│   ├── page.tsx              # Home (hero, scrollytelling, live demo)
│   ├── features/page.tsx     # Product features
│   ├── product/page.tsx      # Product overview
│   ├── insights/page.tsx     # Market insights
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── community/page.tsx    # Feedback form (Web3Forms)
│   ├── login/page.tsx
│   ├── dashboard/page.tsx      # Redirects to community
│   └── api/                  # Proxies to BACKEND_URL (+ auth)
├── components/
│   ├── HeroSection.tsx
│   ├── CanvasScrollyTelling.tsx
│   ├── LiveAudioStreamer.tsx
│   ├── DocumentUploader.tsx
│   ├── SmoothScroll.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
└── app/globals.css           # Theme tokens (cream / gold)
public/
├── hero-loop.mp4
├── demos/                    # Scenario preview videos
└── sequence-1/               # Scrollytelling image frames
```

---

## Main routes

| Route | Description |
|-------|-------------|
| `/` | Homepage — city hero, scenario hotspots, canvas scrollytelling, voice demo |
| `/features` | Platform capabilities |
| `/product` | Product / AURA agent overview |
| `/insights` | Industry insights articles |
| `/about` | About MINISTROS |
| `/contact` | Contact information |
| `/community` | User feedback form |
| `/login` | Login (requires backend) |

---

## Tech stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion** — animations and scroll-driven UI
- **Lenis** — smooth scrolling on the homepage
- **Three.js / React Three Fiber** — 3D where used
- **Lucide React** — icons

---

## Backend dependency

The front end expects a separate API service at `BACKEND_URL` (default `http://localhost:8805`) exposing endpoints such as:

- `/upload`, `/chat`, `/voice-chat`, `/set-voice`, `/set-collection`, `/end-session`
- `/login`, `/signup`
- WebSocket: `/ws` (for live audio)

That backend is **not** part of this repository. Start it before testing the demo section on the homepage.

---

## Deployment

### Vercel

1. Set the project **root directory** to `NaturalVoclAI` (or deploy from that folder).
2. Add the environment variables from `.env.local` in the Vercel dashboard.
3. Build command: `npm run build`  
   Output: Next.js default.

### Docker (repository root)

The `Dockerfile` at the **repository root** builds from the root `package.json`, not from `NaturalVoclAI/`. For Docker deployments, either:

- Point the build context at `NaturalVoclAI/`, or  
- Sync `NaturalVoclAI/src` and `NaturalVoclAI/public` into the root before building.

---

## Troubleshooting

### `'next' is not recognized`

You are likely in the wrong folder. Run:

```bash
cd NaturalVoclAI
npm install
npm run dev
```

### Changes not showing in the browser

- Confirm you saved files under **`NaturalVoclAI/src/`**, not only under the repo root `src/`.
- Hard refresh the browser (`Ctrl+Shift+R` / `Cmd+Shift+R`).
- Restart `npm run dev` after pulling new changes.

### Community form error

Set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` in `NaturalVoclAI/.env.local`.

### Voice demo does not connect

1. Ensure the backend is running on port `8805`.
2. Set `BACKEND_URL` and optionally `NEXT_PUBLIC_WS_URL` in `.env.local`.
3. Restart the Next.js dev server after changing env vars.

---

## Contributing

1. Work in **`NaturalVoclAI/`**.
2. Create a branch, commit, and push:

```bash
cd NaturalVoclAI
git checkout -b feature/your-branch-name
git add .
git commit -m "Describe your change"
git push -u origin feature/your-branch-name
```

Open a pull request on GitHub against `main`.

---

## License

Private project — see repository owner for usage terms.
