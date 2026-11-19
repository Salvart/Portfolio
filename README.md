# Salvador Ruiz — Technical Artist & Software Programmer

[![Live Demo](https://img.shields.io/badge/Live_Portfolio-🚀_GitHub_Pages-38bdf8?style=for-the-badge)](https://salvart.github.io/Portfolio/)
[![ArtStation](https://img.shields.io/badge/ArtStation-🎨_View_Profile-13aff0?style=for-the-badge)](https://www.artstation.com/salv_art)

> *« Apasionado por los videojuegos, el arte 3D y el código limpio »*  
> *« Combining 3D art, game engines, and clean software architecture to build memorable interactive experiences. »*

---

## 🌟 Concepto & Experiencia Interactiva

Portafolio profesional con diseño **retro-minimalista inspirado en [edh.dev](https://edh.dev/)**: papel crema, tinta gris oscura, tipografía pixel, cajas planas con sombras duras y separadores discontinuos. El contenido se organiza en secciones de pantalla completa con *scroll-snap*.

- **Hero del ordenador retro (Three.js):**  
  Primera sección con un ordenador 3D typewriter/CRT creado con primitivas de `three`. La pantalla muestra una secuencia de arranque en fuente `VT323` (`BOOTING… → MEMORIA 64K OK → CARGANDO PORTAFOLIO… → HOLA, SOY SALVADOR`). Se puede arrastrar para girarlo y pulsar para arrancarlo; incluye fallback 2D en CSS cuando WebGL no está disponible y respeta `prefers-reduced-motion`.

- **Fondo estático:**  
  Se han retirado las escenas 3D con fundidos entre secciones. El fondo es ahora un color crema liso (`#f6d4b1`), sin imágenes ni overlays tecnológicos.

- **Navegación Contextual Persistente:**  
  Menú flotante rectangular de estilo retro en la **esquina superior derecha** que nunca desaparece al hacer scroll. Incluye resaltado en tiempo real de la sección activa (`IntersectionObserver`), scroll suave interactivo, selector bilingüe instantáneo (**ES / EN**) y menú desplegable adaptable a pantallas móviles.

- **Vault de Proyectos Interactivo:**  
  Catálogo con más de 20 producciones comerciales, proyectos de videojuegos (como *INSOMNIS* para PS4, PS5, Steam y Nintendo Switch, el Gemelo Digital de Valdecarros en UE5, etc.), filtros por categorías, modales de detalle y disparador de confeti en enlaces a tiendas oficiales y ArtStation.

---

## 🛠️ Stack Tecnológico de la Web

- **Librería UI:** [React 19](https://react.dev/) (Hooks, Context API, componentes modulares JSX).
- **Herramienta de Build:** [Vite 6](https://vitejs.dev/) (`vite.config.ts`) con recarga en caliente ultrarrápida (HMR) y compilación optimizada en menos de 1 segundo.
- **Gestor de Paquetes:** [pnpm](https://pnpm.io/) (v12) con políticas de seguridad en cadena de suministro (*Supply-Chain Policies*), almacenamiento sin duplicados y resolución estricta contra dependencias fantasma.
- **Tipografía:** fuentes pixel autoalojadas (`Silkscreen` para títulos/UI y `VT323` para la terminal CRT) + sans-serif del sistema para los párrafos.
- **Estilos:** CSS3 con variables personalizadas, paleta crema/gris (`#f6d4b1` / `#525252`), bordes discontinuos, sombras duras sin desenfoque y diseño 100% responsivo para móviles, tablets y monitores ultrawide.
- **3D:** [Three.js](https://threejs.org/) para el ordenador retro del hero.
- **Despliegue Continuo (CI/CD):** GitHub Actions automatizado con [deploy.yml](.github/workflows/deploy.yml) para publicación directa en GitHub Pages en cada push a la rama `main`.

---

## 📂 Estructura del Proyecto

```text
Portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Pipeline de despliegue en GitHub Pages con pnpm
├── public/
│   ├── favicon.svg             # Favicon vectorial
│   ├── fonts/                  # Fuentes pixel autoalojadas (fonts.css + .woff2)
│   ├── previews/               # Capturas de los proyectos del vault
│   └── images/                 # Escenas Pixar antiguas (actualmente sin uso)
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Barra contextual persistente superior derecha
│   │   ├── Navbar.css
│   │   ├── RetroComputer.jsx   # Hero 3D del ordenador retro y secuencia de arranque
│   │   ├── RetroComputer.css
│   │   ├── PixarBackground.jsx # Componente legacy sin uso (fondo eliminado)
│   │   ├── PixarBackground.css
│   │   └── sections/
│   │       ├── InfoSection.jsx     # Perfil, biografía y datos de contacto
│   │       ├── InfoSection.css
│   │       ├── TechSection.jsx     # Habilidades, filtros y stack principal
│   │       ├── TechSection.css
│   │       ├── StudiesSection.jsx  # Línea de tiempo académica
│   │       ├── StudiesSection.css
│   │       ├── ProjectsSection.jsx # Vault de 20 proyectos con modales y confeti
│   │       └── ProjectsSection.css
│   ├── utils/
│   │   └── i18n.jsx            # Contexto React de internacionalización (ES / EN)
│   ├── App.jsx                 # Layout principal, hero y secciones con scroll-snap
│   ├── App.css
│   ├── main.jsx                # Punto de entrada de React 19
│   └── style.css               # Sistema de diseño retro-minimalista
├── index.html                  # Plantilla HTML con CSP y fuentes locales
├── package.json                # Dependencias del proyecto
├── pnpm-lock.yaml              # Bloqueo de versiones determinista y seguro
└── vite.config.ts              # Configuración de Vite con @vitejs/plugin-react
```

---

## 💻 Desarrollo Local

Para clonar y ejecutar el portafolio en tu máquina local:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Salvart/Portfolio.git
   cd Portfolio
   ```

2. **Instalar dependencias con pnpm:**
   ```bash
   pnpm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   pnpm dev
   ```

4. **Compilar para producción:**
   ```bash
   pnpm build
   ```

5. **Previsualizar la compilación de producción localmente:**
   ```bash
   pnpm preview
   ```

---

## 📬 Contacto & Redes

- **ArtStation:** [https://www.artstation.com/salv_art](https://www.artstation.com/salv_art)
- **LinkedIn / Contacto:** Disponible en el portafolio web.
