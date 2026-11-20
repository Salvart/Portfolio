// Realce suave que se aplica después del desenfoque gaussiano.
// Recupera definición sin introducir halos claros: solo contrasta el píxel
// central frente a la media de sus cuatro vecinos.
export const SharpenShader = {
  uniforms: {
    tDiffuse: { value: null },
    uResolution: { value: [1, 1] },
    uAmount: { value: 0.22 }
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
    uniform vec2 uResolution;
    uniform float uAmount;
    varying vec2 vUv;

    void main() {
      vec2 texel = 1.0 / uResolution;
      vec3 center = texture2D(tDiffuse, vUv).rgb;
      vec3 neighbors =
        texture2D(tDiffuse, vUv + vec2(texel.x, 0.0)).rgb +
        texture2D(tDiffuse, vUv - vec2(texel.x, 0.0)).rgb +
        texture2D(tDiffuse, vUv + vec2(0.0, texel.y)).rgb +
        texture2D(tDiffuse, vUv - vec2(0.0, texel.y)).rgb;
      vec3 color = center + (center - neighbors * 0.25) * uAmount;
      gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
    }
  `
}
