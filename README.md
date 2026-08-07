# Salvart — Game Developer & 3D Artist Portfolio

[![Deploy Portfolio](https://img.shields.io/badge/Live_Demo-🚀_View_Portfolio-brightgreen?style=for-the-badge)](https://www.artstation.com/salv_art)

> _Bridging programming logic and 3D art to create immersive experiences and interactions._

## About This Project

This repository contains the source code of my **professional portfolio**. It has been developed with **Vue 3** and **Vite** to offer a fast, fluid and reactive web experience where I showcase my projects in video game development, interactive systems and 3D modeling.

## Website Tech Stack

- **Framework:** [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)

- **Language:** [TypeScript](https://www.typescriptlang.org/)

- **Build Tool:** [Vite](https://vitejs.dev/) (`vite.config.ts`)

- **Styles & UI:** Plain CSS with custom properties (Game Boy / retro pixel themes)

- **Package manager:** [pnpm](https://pnpm.io/) (pinned in `packageManager` and managed with Corepack)

- **Tooling:** [ESLint](https://eslint.org/) (TypeScript + Vue + `eslint-plugin-vuejs-accessibility`), [Prettier](https://prettier.io/), [vitest](https://vitest.dev/) + [Vue Test Utils](https://test-utils.vuejs.org/), [vue-tsc](https://github.com/vuejs/language-tools) for type checking

- **Continuous Integration:** GitHub Actions (`.github/workflows/lint.yml`) — runs lint, formatting check and tests on every push/PR

- **Accessibility:** WCAG-minded markup (semantic `<button>`/`<nav>`, descriptive `alt`, keyboard-accessible menu and project modal with focus management), enforced automatically by `eslint-plugin-vuejs-accessibility`

- **Deployment:** GitHub Pages

## Game Development & Programming

- **Engines:** Unity / Unreal Engine / Godot _(add/remove yours)_

- **Languages:** C#, C++, JavaScript / TypeScript, Python

- **Systems:** Gameplay architecture, game AI, physics, user interface (UI/UX).

## 3D Art & Design

- **Software:** Blender, 3DsMAx, ZBrush, Substance Painter

- **Specialties:** Low/High Poly modeling, PBR texturing, Rigging, Propes & Environment Art.

## Featured Projects

<img src="https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1000700/ss_5e074cee25ad9064a62490568dc9a9c28279f290.1920x1080.jpg?t=1742568226" width="300"><br>**Insomnis Steam/PS4/PS5/Switch** <br> https://store.steampowered.com/app/1000700/Insomnis/?l=spanish <br><br><img src="https://cdnb.artstation.com/p/assets/images/images/101/318/487/large/salvador-ruiz-martinez-captura-de-pantalla-2026-07-20-145301.jpg?1785822247" width="300"><br>**Metrovacesa Kala Digital Twin** <br>https://www.artstation.com/artwork/Rq36kA<br>

**Role:** Programmer, 3D Artist<br>**Tech:** Unity, Unreal, C#, C++, 3DsMax, Blender, Substance<br><br>

## Local Development

The project uses **pnpm** as package manager (version pinned in the `packageManager` field of `package.json`; Corepack installs it automatically). To clone and run the portfolio locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Salvart/Portfolio.git
   cd Portfolio
   ```

2. **Install the dependencies:**

   ```bash
   pnpm install
   ```

3. **Start the development server:**

   ```bash
   pnpm dev
   ```

4. **Build for production:**

   ```bash
   pnpm build
   ```

5. **Serve the production build locally:**

   ```bash
   pnpm preview
   ```

## Quality Checks

Run the full validation suite before pushing:

```bash
pnpm lint        # ESLint (TS + Vue + accessibility rules)
pnpm type-check  # vue-tsc type checking (app + node configs)
pnpm test        # Vitest unit tests
pnpm build       # Production build
pnpm exec prettier --check .   # Formatting check
```

## Contact & Links

Follow my work or get in touch with me:

ArtStation: https://www.artstation.com/salv_art

LinkedIn: https://www.linkedin.com/in/salvador-ruiz-mart%C3%ADnez-a1b09488/

Email: salvadorruizmartinez@gmail.com
