/// <reference types="vite/client" />
import * as THREE from 'three'
import { ThreeElements } from '@react-three/fiber'

declare module '@react-three/fiber' {
    interface ThreeElements {
        reelBlurMaterial: ThreeElements['meshStandardMaterial'] & {
            uTime?: number;
            uMap?: THREE.Texture | null;
            uBlurAmount?: number;
            uOffset?: number;
            uColor?: THREE.Color;
        }
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            reelBlurMaterial: any;
        }
    }
}
