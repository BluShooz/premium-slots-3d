import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

export const ReelBlurMaterial = shaderMaterial(
    {
        uTime: 0,
        uMap: null,
        uBlurAmount: 0, // 0 to 1
        uOffset: 0,
        uColor: new THREE.Color('white'),
    },
    // Vertex Shader
    `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
    // Fragment Shader
    `
  uniform float uTime;
  uniform sampler2D uMap;
  uniform float uBlurAmount;
  uniform float uOffset;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    uv.y = fract(uv.y + uOffset);
    
    vec4 color = vec4(0.0);
    float samples = 10.0;
    float blurScale = uBlurAmount * 0.1;
    
    for(float i = 0.0; i < 10.0; i++) {
      float offset = (i / samples - 0.5) * blurScale;
      color += texture2D(uMap, vec2(uv.x, fract(uv.y + offset)));
    }
    
    gl_FragColor = color / samples;
  }
  `
);

extend({ ReelBlurMaterial });

declare global {
    namespace JSX {
        interface IntrinsicElements {
            reelBlurMaterial: any;
        }
    }
}
