// Postprocesado de la cámara: ojo de pez, aberración cromática y glitch de cinta.
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

      // Glitch errático: rejilla que cambia de tamaño y salta a cada tick.
      float gTick = floor(uTime * 3.4);
      float gRand = fract(sin(gTick * 127.1) * 43758.5453);
      float glitchOn = step(0.72, gRand);

      float sliceId = floor(vUv.y * (16.0 + gRand * 30.0) + gTick * 3.0);
      float sRand = fract(sin(sliceId * 78.233 + gTick * 1.7) * 12345.6789);
      float sliceOn = step(0.5, sRand);
      float burst = glitchOn * sliceOn;

      // Desplazamiento brusco en X y pequeño salto vertical en las rodajas.
      float shiftX = burst * (sRand - 0.5) * 0.3;
      float shiftY = burst * (fract(sRand * 9.7) - 0.5) * 0.025;
      uv += vec2(shiftX, shiftY);
      uv = clamp(uv, 0.0, 1.0);

      // Aberración cromática: radial suave + separación agresiva durante el glitch.
      vec2 dir = normalize(centered + vec2(0.0001));
      float baseShift = uChroma * (0.25 + r2 * 1.4);
      float burstShift = burst * (0.018 + sRand * 0.03);
      vec2 rUv = uv + dir * (baseShift + burstShift) + vec2(shiftX * 0.45, 0.0);
      vec2 bUv = uv - dir * (baseShift + burstShift) - vec2(shiftX * 0.45, 0.0);
      float red = texture2D(tDiffuse, clamp(rUv, 0.0, 1.0)).r;
      float green = texture2D(tDiffuse, uv).g;
      float blue = texture2D(tDiffuse, clamp(bUv, 0.0, 1.0)).b;

      vec3 color = vec3(red, green, blue);

      // Tintado de color errático: los canales se desbalancean por rodaja.
      float tint = fract(sin(gTick * 39.425 + sliceId) * 23421.631);
      color.r += burst * tint * 0.3;
      color.b += burst * (1.0 - tint) * 0.3;
      color.g *= 1.0 - burst * 0.18;

      // Bloques ocasionales que se encienden o se apagan.
      float block = step(0.93, fract(sin(sliceId * 13.13 + gTick * 7.7) * 7891.23));
      float blockSign = mix(-0.12, 0.22, step(0.5, fract(tint * 3.0)));
      color += burst * block * blockSign;

      gl_FragColor = vec4(color, 1.0);
    }
  `
}
