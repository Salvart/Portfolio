// Ajuste final de contraste y brillo de la imagen, después del realce.
export const ColorGradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uBrightness: { value: 0.035 },
    uContrast: { value: 1.12 }
  },

  vertexShader: /* glsl */ `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uBrightness;
    uniform float uContrast;
    varying vec2 vUv;

    void main() {
      vec3 color = texture2D(tDiffuse, vUv).rgb;
      color = (color - 0.5) * uContrast + 0.5 + uBrightness;
      gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
    }
  `
}
