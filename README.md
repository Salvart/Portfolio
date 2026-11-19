# Salvador Ruiz — Technical Artist & Software Programmer

[![Live Demo](https://img.shields.io/badge/Live_Portfolio-🚀_GitHub_Pages-38bdf8?style=for-the-badge)](https://salvart.github.io/Portfolio/)
[![ArtStation](https://img.shields.io/badge/ArtStation-🎨_View_Profile-13aff0?style=for-the-badge)](https://www.artstation.com/salv_art)

> *« Apasionado por los videojuegos, el arte 3D y el código limpio »*  
> *« Combining 3D art, game engines, and clean software architecture to build memorable interactive experiences. »*

---

## 🌟 Concepto & Experiencia Interactiva

Portafolio profesional interactivo con diseño **minimalista, limpio y de tonalidades tecnológicas**, estructurado en torno a una experiencia visual inmersiva sincronizada con el scroll:

- **Fondo Narrativo 3D Estilo Pixar (Scroll-Driven Cross-Fade):**  
  A medida que el usuario hace scroll vertical por la web, el fondo realiza transiciones fluidas de fundido encadenado (*cross-fade*) optimizadas a 60 fps mediante `requestAnimationFrame`, representando la trayectoria y disciplinas del creador:
  1. **Información / Sobre Mí:** Personaje 3D relajado leyendo el periódico tecnológico en el sillón de su apartamento.
  2. **Tecnologías & Stack:** Se levanta y acude a su estudio de alta tecnología revisando código en monitores envolventes.
  3. **Formación & Estudios:** Con el portátil cerrado a un lado, estudiando libros técnicos, apuntes y esquemas bajo la lámpara de flexo.
  4. **Proyectos & Producciones:** En su banco de trabajo maker soldando una placa base con precisión y herramientas de hardware.

- **Navegación Contextual Persistente:**  
  Menú flotante en cápsula de cristal (*glassmorphism*) en la **esquina superior derecha** que nunca desaparece al hacer scroll. Incluye resaltado en tiempo real de la sección activa (`IntersectionObserver`), scroll suave interactivo, selector bilingüe instantáneo (**ES / EN**) y menú desplegable adaptable a pantallas móviles.

- **Vault de Proyectos Interactivo:**  
  Catálogo con más de 20 producciones comerciales, proyectos de videojuegos (como *INSOMNIS* para PS4, PS5, Steam y Nintendo Switch, el Gemelo Digital de Valdecarros en UE5, etc.), filtros por categorías, modales de detalle y disparador de confeti en enlaces a tiendas oficiales y ArtStation.

---

## 🛠️ Stack Tecnológico de la Web

- **Librería UI:** [React 19](https://react.dev/) (Hooks, Context API, componentes modulares JSX).
- **Herramienta de Build:** [Vite 6](https://vitejs.dev/) (`vite.config.ts`) con recarga en caliente ultrarrápida (HMR) y compilación optimizada en menos de 1 segundo.
- **Gestor de Paquetes:** [pnpm](https://pnpm.io/) (v12) con políticas de seguridad en cadena de suministro (*Supply-Chain Policies*), almacenamiento sin duplicados y resolución estricta contra dependencias fantasma.
- **Tipografía:** [Montserrat](https://fonts.google.com/specimen/Montserrat) (Google Fonts).
- **Estilos:** CSS3 moderno con variables CSS personalizadas, estética *dark tech* (`#070a13` con acentos cian `#38bdf8`), efectos *glassmorphism* y diseño 100% responsivo para móviles, tablets y monitores ultrawide.
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
│   └── images/                 # Escenas 3D estilo Pixar generadas en alta resolución
│       ├── scene-info.jpg      # Escena 1: Información (Sillón / Periódico)
│       ├── scene-tech.jpg      # Escena 2: Tecnologías (Estudio / PC)
│       ├── scene-studies.jpg   # Escena 3: Estudios (Mesa / Libros)
│       └── scene-projects.jpg  # Escena 4: Proyectos (Taller / Placa Base)
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Barra contextual persistente superior derecha
│   │   ├── Navbar.css
│   │   ├── PixarBackground.jsx # Fondo interactivo con interpolación scroll-driven
│   │   ├── PixarBackground.css
│   │   └── sections/
│   │       ├── InfoSection.jsx     # Perfil, biografía y telemetría de estadísticas
│   │       ├── InfoSection.css
│   │       ├── TechSection.jsx     # Árbol de habilidades, filtros y stack principal
│   │       ├── TechSection.css
│   │       ├── StudiesSection.jsx  # Línea de tiempo académica con nodos luminosos
│   │       ├── StudiesSection.css
│   │       ├── ProjectsSection.jsx # Vault de 20 proyectos con modales y confeti
│   │       └── ProjectsSection.css
│   ├── utils/
│   │   └── i18n.jsx            # Contexto React de internacionalización (ES / EN)
│   ├── App.jsx                 # Layout principal y footer tecnológico
│   ├── App.css
│   ├── main.jsx                # Punto de entrada de React 19
│   └── style.css               # Sistema de diseño global y tipografía Montserrat
├── index.html                  # Plantilla HTML con CSP y Google Fonts
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
