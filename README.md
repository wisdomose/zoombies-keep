# Zoombies Keep

**Zoombies Keep** is a 3D tower-defense-inspired web game built with React, Three.js, and Rapier physics. Protect the town center graveyard from an endless horde of vampires.

![Zoombies Keep gameplay screenshot](public/zoombies-keep.jpg)

## 🎮 Gameplay

- **Objective:** Defend the base from incoming vampires. If too many reach the center, base integrity drops. If it reaches `0`, the game ends.
- **Core loop:** Launch and guide your ghost swarm, pass through the glowing **green multiplier zones**, and grow your forces to hold the line.

### Controls

- **Shoot / Deploy:** `Space` or `Left Mouse Click`
- **Steer / Move swarm:** `Mouse Movement` or `Click + Drag`

## 🛠️ Tech Stack

- **Framework:** React + [TanStack Start](https://tanstack.com/start)
- **3D Rendering:** [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) + [@react-three/drei](https://github.com/pmndrs/drei)
- **Physics:** [@react-three/rapier](https://github.com/pmndrs/react-three-rapier)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) (high score persistence via LocalStorage)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- `pnpm`

### Install

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

App runs locally at `http://localhost:3006`.

## 📜 Available Scripts

- `pnpm dev` — Start Vite dev server on port `3006`
- `pnpm build` — Build production bundle
- `pnpm preview` — Preview production build on port `3006`
- `pnpm test` — Run Vitest test suite

## 🗂️ Project Structure

- `src/components/game/` — 3D gameplay entities and scene setup (`GameScene.tsx`, `Enemy.tsx`, `Ally.tsx`, `Base.tsx`, `Environment.tsx`)
- `src/components/ui/` — 2D overlays and UI (`MainMenu.tsx`, `HUD.tsx`, `GameOverOverlay.tsx`)
- `src/store/` — Global game state via Zustand (`gameStore.ts`)
- `src/routes/` — App routes (`index.tsx`)

---

_Defend the town from the eternal sleep._

## Credits

- Assets from **Keenly**
- Sound from **Zapsplat**
