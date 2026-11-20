# Salvador Ruiz — Technical Artist & Software Programmer

[![Live Demo](https://img.shields.io/badge/Live_Portfolio-🚀_GitHub_Pages-38bdf8?style=for-the-badge)](https://salvart.github.io/Portfolio/)
[![ArtStation](https://img.shields.io/badge/ArtStation-🎨_View_Profile-13aff0?style=for-the-badge)](https://www.artstation.com/salv_art)

> *« Apasionado por los videojuegos, el arte 3D y el código limpio »*

---

## Concepto

Una landing de una sola pantalla construida desde cero alrededor de una **placa base 3D**. No hay tarjetas, paneles ni ventanas: el scroll mueve la cámara en un recorrido **zoom out → desplazamiento → zoom in** hasta enfocar uno de los cuatro chips. La información aparece únicamente como texto plano a la izquierda y derecha del chip (arriba y abajo en la introducción), sin contenedores visibles y con medidas para que nunca desborde.

### Los cuatro chips

| Chip | Sección | Contenido |
| --- | --- | --- |
| CPU | Introducción | Nombre, rol, ubicación y disponibilidad |
| Graphics | Perfil y stack | Biografía y tecnologías |
| Memory | Formación | Tres titulaciones |
| I/O | Proyectos | Siete destacados y enlaces |

La placa usa trazas doradas, serigrafía con caracteres chinos como decoración y un leve brillo en el chip activo. El ratón desplaza la cámara unos centímetros con amortiguación. Se respeta `prefers-reduced-motion` y hay fallback si WebGL no está disponible.

---

## Stack de la web

- **React 19** con Context API para ES/EN.
- **Three.js** para la placa, los chips y la cámara.
- **Vite 6** con base `/Portfolio/` para GitHub Pages.
- **CSS** con Montserrat autoalojada (Medium 500 para texto y Black 900 para títulos), sin assets externos.
- **GitHub Actions** (`.github/workflows/deploy.yml`) publica `dist/` en cada push a `main`.

---

## Estructura

```text
Portfolio/
├── .github/workflows/deploy.yml   # Deploy en GitHub Pages
├── src/
│   ├── components/
│   │   ├── MinimalNav.jsx         # Navegación de texto: secciones e idioma
│   │   └── SceneText.jsx          # Capa de texto sin contenedores visibles
│   ├── content/portfolio.js       # Única fuente de contenido (ES/EN)
│   ├── hooks/
│   │   ├── useReducedMotion.js
│   │   └── useSectionController.js # Rueda, teclado y swipe
│   ├── scene/
│   │   ├── Motherboard.js          # PCB, trazas, chips y serigrafía
│   │   ├── MotherboardScene.jsx    # Render, luces, parallax y limpieza
│   │   └── cameraJourney.js        # Poses y transiciones de cámara
│   ├── utils/i18n.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
├── pnpm-lock.yaml
└── vite.config.ts
```

---

## Desarrollo local

```bash
pnpm install
pnpm dev
```

Compilar y previsualizar la versión de producción:

```bash
pnpm build
pnpm preview
```

La compilación de producción se sirve bajo `/Portfolio/`, igual que en GitHub Pages.

---

## Navegación

- **Rueda del ratón**, **swipe vertical** o **flechas / PageUp / PageDown** para cambiar de chip.
- **Home / End** para ir al primero o al último.
- **01 — 04** en la esquina superior derecha para saltos directos.
- **ES / EN** para cambiar de idioma.
