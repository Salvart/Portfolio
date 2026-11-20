# Salvador Ruiz — Technical Artist & Software Programmer

[![Live Demo](https://img.shields.io/badge/Live_Portfolio-🚀_GitHub_Pages-38bdf8?style=for-the-badge)](https://salvart.github.io/Portfolio/)
[![ArtStation](https://img.shields.io/badge/ArtStation-🎨_View_Profile-13aff0?style=for-the-badge)](https://www.artstation.com/salv_art)

> *« Apasionado por los videojuegos, el arte 3D y el código limpio »*

---

## Concepto

Una landing de una sola pantalla construida desde cero alrededor de una **placa base 3D**. El scroll mueve la cámara en un recorrido **zoom out → desplazamiento → zoom in** hasta enfocar uno de los cuatro chips. La información aparece como texto plano a la izquierda y derecha del chip (arriba y abajo en la introducción), dentro de ventanas limpias y semitransparentes (~50 %) que la mantienen siempre legible, con medidas para que nunca desborde.

### Los cuatro chips

| Chip | Sección | Contenido |
| --- | --- | --- |
| CPU | Introducción | Nombre, rol, ubicación y disponibilidad |
| Graphics | Perfil y stack | Biografía y tecnologías |
| Memory | Formación | Tres titulaciones |
| I/O | Proyectos | Siete destacados y enlaces |

La PCB es más grande y sigue una distribución lógica de placa de consola: zócalo de CPU, bloque gráfico con disipador, banco de memoria, sector de alimentación con condensadores y bobinas, conector de expansión y puertos laterales. Las pistas salen de pines reales de cada chip y unen unos con otros siguiendo un orden lógico (CPU → gráficos → memoria → E/S → puertos, más el bus de expansión). Todos los tramos son horizontales, verticales o diagonales a 45°, los carriles están ordenados para no cruzarse y la serigrafía con caracteres chinos se sitúa solo en zonas libres de pistas.

La iluminación es más realista: luces de fondo muy bajas, sombras proyectadas y un foco ligado al cursor que recorre la placa y es la fuente principal. El ratón **no mueve la cámara**, solo mueve esa luz y el destello de la lente. Sobre toda la web hay un efecto VHS (líneas de exploración, grano grueso, cromática suave, una banda magnética lenta con desgarros y ráfagas de glitch atenuadas en forma de rejilla de píxeles grandes con columnas de color alternas), y la cámara tiene viñeta oscura en los bordes, destello anamórfico, ojo de pez y aberración cromática reducida aplicados en un pase de postprocesado que también genera un glitch suave con bloques cuadriculados, separación de canales y tintado de color. La barra superior es oscura y con desenfoque. La escena y todos los efectos (VHS, glitch, lente y viñeta) quedan aislados en una capa inferior, de modo que las ventanas de información se ven limpias y sin cromática, grano ni destellos. El chip activo brilla suavemente. Se respeta `prefers-reduced-motion` y hay fallback si WebGL no está disponible.

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
│   │   ├── MotherboardScene.jsx    # Render, luces, sombras, foco del cursor y limpieza
│   │   ├── cameraJourney.js        # Poses y transiciones de cámara
│   │   └── lensVhsShader.js        # Ojo de pez, cromática, glitch y desgarro de cinta
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
