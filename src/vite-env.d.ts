/// <reference types="vite/client" />

interface ReelBlurMaterialProps {
    uTime?: number;
    uMap?: THREE.Texture | null;
    uBlurAmount?: number;
    uOffset?: number;
    uColor?: THREE.Color;
    transparent?: boolean;
    side?: THREE.Side;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            reelBlurMaterial: any; // Simplified for now
        }
    }
}

export { };
