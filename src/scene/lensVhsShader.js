// Postprocesado de la cámara: ojo de pez, cromática, banda magnética,
// desenfoque muy ligero y un realce (sharpen) posterior, sin glitch.
export const LensVhsShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uResolution: { value: [1, 1] },
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
    uniform vec2 uResolution;
    uniform float uDistortion;
    uniform float uChroma;
    varying vec2 vUv;

    // Desenfoque muy suave: una cruz de 5 muestras a un píxel de distancia.
    vec3 softBlur(vec2 uv, vec2 texel) {
      vec3 sum = texture2D(tDiffuse, uv).rgb * 4.0;
      sum += texture2D(tDiffuse, uv + vec2(texel.x, 0.0)).rgb * 2.0;
      sum += texture2D(tDiffuse, uv - vec2(texel.x, 0.0)).rgb * 2.0;
      sum += texture2D(tDiffuse, uv + vec2(0.0, texel.y)).rgb * 2.0;
      sum += texture2D(tDiffuse, uv - vec2(0.0, texel.y)).rgb * 2.0;
      return sum / 12.0;
    }

    void main() {
      vec2 centered = vUv - 0.5;
      float r2 = dot(centered, centered);

      // Ojo de pez: curvatura invertida, más acusada hacia los bordes.
      vec2 uv = 0.5 + centered * (1.0 + uDistortion * r2);

      // Banda magnética lenta: al pasar desplaza las líneas horizontales.
      float cycle = fract(uTime / 16.0);
      float phase = clamp((cycle - 0.78) / 0.22, 0.0, 1.0);
      float bandPos = 1.15 - phase * 2.3;
      float bandActive = step(0.78, cycle) * smoothstep(0.08, 0.0, abs(vUv.y - bandPos));
      float tear = sin(vUv.y * 190.0 + uTime * 14.0) * 0.004
                 + sin(vUv.y * 53.0 - uTime * 6.0) * 0.007;
      uv.x += bandActive * tear * 2.2;
      uv = clamp(uv, 0.0, 1.0);

      // Aberración cromática radial suave.
      vec2 dir = normalize(centered + vec2(0.0001));
      float shift = uChroma * (0.25 + r2 * 1.4);
      vec2 rUv = clamp(uv + dir * shift, 0.0, 1.0);
      vec2 bUv = clamp(uv - dir * shift, 0.0, 1.0);

      vec3 base = vec3(
        texture2D(tDiffuse, rUv).r,
        texture2D(tDiffuse, uv).g,
        texture2D(tDiffuse, bUv).b
      );

      // Desenfoque ligero de cámara y realce inmediatamente después.
      vec3 blurred = softBlur(uv, 1.0 / uResolution);
      vec3 softened = mix(base, blurred, 0.3);
      vec3 color = softened + (base - blurred) * 0.15;

      gl_FragColor = vec4(color, 1.0);
    }
  `
}
