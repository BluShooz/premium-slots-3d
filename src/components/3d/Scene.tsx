import React, { Suspense } from 'react';
import { OrbitControls, Stars, Environment, Float, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { SlotMachine } from './SlotMachine';

export const Scene: React.FC = () => {
    return (
        <>
            <color attach="background" args={['#050505']} />

            <PresentationControls
                global
                snap
                rotation={[0, 0, 0]}
                polar={[-Math.PI / 6, Math.PI / 6]}
                azimuth={[-Math.PI / 4, Math.PI / 4]}
            >
                <Suspense fallback={null}>
                    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                        <SlotMachine />
                    </Float>
                    <Environment preset="night" background={false} />
                </Suspense>
            </PresentationControls>

            <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={10}
                maxDistance={25}
                makeDefault
            />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <spotLight
                position={[0, 15, 10]}
                angle={0.3}
                penumbra={1}
                intensity={200}
                color="#ffffff"
                castShadow
            />

            <pointLight position={[-10, 5, 5]} intensity={50} color="#00ffff" />
            <pointLight position={[10, 5, 5]} intensity={50} color="#ff00ff" />

            <EffectComposer>
                <Bloom
                    luminanceThreshold={0.8}
                    mipmapBlur
                    intensity={1.5}
                    radius={0.4}
                />
                <Noise opacity={0.05} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
                <ChromaticAberration
                    offset={new THREE.Vector2(0.001, 0.001)}
                    radialModulation={false}
                    modulationOffset={0}
                />
            </EffectComposer>
        </>
    );
};
