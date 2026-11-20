// Gaussian blur de dos pasos con máscara radial: el centro queda casi nítido
// y el desenfoque crece hacia los bordes, como en un objetivo real con viñeta.
const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const weights = [
  [0.051, -4.0],
  [0.0918, -3.0],
  [0.12245, -2.0],
  [0.1531, -1.0],
  [0.1633, 0.0],
  [0.1531, 1.0],
  [0.12245, 2.0],
  [0.0918, 3.0],
  [0.051, 4.0]
]

const fragment = (axis) => /* glsl */ `
  uniform sampler2D tDiffuse;
  uniform float uTexel;
  uniform float uStrength;
  varying vec2 vUv;

  void main() {
    float dist = distance(vUv, vec2(0.5));
    float mask = smoothstep(0.12, 0.72, dist);
    float stepSize = uTexel * mix(0.15, 1.0, mask) * uStrength;

    vec4 sum = vec4(0.0);
    ${weights
      .map(([weight, offset]) => {
        const coord = axis === 'x'
          ? `vUv + vec2(${offset.toFixed(1)} * stepSize, 0.0)`
          : `vUv + vec2(0.0, ${offset.toFixed(1)} * stepSize)`
        return `sum += texture2D(tDiffuse, ${coord}) * ${weight};`
      })
      .join('\n    ')}

    gl_FragColor = sum;
  }
`

export const VignetteHorizontalBlurShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTexel: { value: 1 / 512 },
    uStrength: { value: 1.5 }
  },
  vertexShader,
  fragmentShader: fragment('x')
}

export const VignetteVerticalBlurShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTexel: { value: 1 / 512 },
    uStrength: { value: 1.5 }
  },
  vertexShader,
  fragmentShader: fragment('y')
}
