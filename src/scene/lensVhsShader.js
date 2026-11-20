// Postprocesado de la cámara: ojo de pez, aberración cromática y desgarro de cinta.
export const LensVhsShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uDistortion: { value: 0.18 },
    uChroma: { value: 0.0055 }
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
    uniform float uTime;
    uniform float uDistortion;
    uniform float uChroma;
    varying vec2 vUv;

    void main() {
      vec2 centered = vUv - 0.5;
      float r2 = dot(centered, centered);

      // Ojo de pez: curvatura invertida, más acusada hacia los bordes.
      vec2 uv = 0.5 + centered * (1.0 + uDistortion * r2);

      // Banda magnética lenta: al pasar desplaza y rompe líneas horizontales.
      float cycle = fract(uTime / 16.0);
      float phase = clamp((cycle - 0.78) / 0.22, 0.0, 1.0);
      float bandPos = 1.15 - phase * 2.3;
      float bandActive = step(0.78, cycle) * smoothstep(0.08, 0.0, abs(vUv.y - bandPos));
      float tear = sin(vUv.y * 190.0 + uTime * 14.0) * 0.004
                 + sin(vUv.y * 53.0 - uTime * 6.0) * 0.007;
      uv.x += bandActive * tear * 2.2;

      // Glitch: ráfagas breves que desplazan rodajas horizontales de la imagen.
      float glitchTick = floor(uTime * 1.7);
      float glitchRand = fract(sin(glitchTick * 91.7) * 43758.5453);
      float glitchOn = step(0.9, glitchRand);
      float sliceId = floor(vUv.y * 28.0 + glitchTick);
      float sliceRand = fract(sin(sliceId * 47.3) * 12345.6789);
      float sliceOn = step(0.72, sliceRand);
      uv.x += glitchOn * sliceOn * (sliceRand - 0.5) * 0.12;
      uv = clamp(uv, 0.0, 1.0);

      // Aberración cromática radial, reforzada durante el desgarro y el glitch.
      vec2 dir = normalize(centered + vec2(0.0001));
      float shift = uChroma * (0.25 + r2 * 1.4)
                  + bandActive * 0.002
                  + glitchOn * sliceOn * 0.003;
      float red = texture2D(tDiffuse, uv + dir * shift).r;
      float green = texture2D(tDiffuse, uv).g;
      float blue = texture2D(tDiffuse, uv - dir * shift).b;

      gl_FragColor = vec4(red, green, blue, 1.0);
    }
  `
}
