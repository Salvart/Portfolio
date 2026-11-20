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

      // Glitch atenuado: ráfagas menos frecuentes sobre celdas grandes tipo píxel.
      float gTick = floor(uTime * 1.7);
      float gRand = fract(sin(gTick * 127.1) * 43758.5453);
      float glitchOn = step(0.86, gRand);

      vec2 grid = vec2(9.0, 6.0);
      vec2 cell = floor(vUv * grid + vec2(gTick * 0.5, gTick * 0.25));
      float colParity = mod(cell.x + gTick, 2.0);
      float colSign = mix(-1.0, 1.0, colParity);
      float cellRand = fract(sin(dot(cell, vec2(12.9898, 78.233)) + gTick * 1.7) * 43758.5453);
      float cellOn = step(0.55 + colParity * 0.12, cellRand);
      float burst = glitchOn * cellOn;

      // Columnas pares e impares se desplazan en direcciones contrarias.
      float shiftX = burst * colSign * (0.02 + cellRand * 0.035);
      float shiftY = burst * (cellRand - 0.5) * 0.012;
      uv += vec2(shiftX, shiftY);

      // Cuadros grandes: se ajusta la muestra a una rejilla gruesa dentro de cada celda.
      vec2 pixelGrid = vec2(24.0, 15.0);
      vec2 pixelUv = (floor(uv * pixelGrid) + 0.5) / pixelGrid;
      uv = mix(uv, pixelUv, burst * 0.8);
      uv = clamp(uv, 0.0, 1.0);

      // Aberración cromática: radial suave + separación moderada durante el glitch.
      vec2 dir = normalize(centered + vec2(0.0001));
      float baseShift = uChroma * (0.25 + r2 * 1.4);
      float burstShift = burst * (0.009 + cellRand * 0.015);
      vec2 rUv = uv + dir * (baseShift + burstShift) + vec2(shiftX * 0.4, 0.0);
      vec2 bUv = uv - dir * (baseShift + burstShift) - vec2(shiftX * 0.4, 0.0);
      float red = texture2D(tDiffuse, clamp(rUv, 0.0, 1.0)).r;
      float green = texture2D(tDiffuse, uv).g;
      float blue = texture2D(tDiffuse, clamp(bUv, 0.0, 1.0)).b;

      vec3 color = vec3(red, green, blue);

      // Tintado suave: los canales se desbalancean por columna alterna.
      float tint = fract(sin(dot(cell, vec2(39.425, 11.135)) + gTick) * 23421.631);
      color.r += burst * tint * 0.15;
      color.b += burst * (1.0 - tint) * 0.15;
      color.g *= 1.0 - burst * 0.09;

      // Píxeles ocasionales que se encienden o apagan.
      float block = step(0.965, fract(sin(dot(cell, vec2(13.13, 7.7)) + gTick * 7.7) * 7891.23));
      float blockSign = mix(-0.06, 0.11, step(0.5, fract(tint * 3.0)));
      color += burst * block * blockSign;

      gl_FragColor = vec4(color, 1.0);
    }
  `
}
