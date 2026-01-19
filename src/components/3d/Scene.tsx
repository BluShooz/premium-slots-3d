import React, { Suspense, useRef } from 'react';
import { OrbitControls, Stars, Environment, Float, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { SlotMachine } from './SlotMachine';
import { useGameStore } from '../../store/useGameStore';

export const Scene: React.FC = () => {
    const status = useGameStore(state => state.status);
    const cameraShake = useRef(new THREE.Vector3(0, 0, 0));
    const controlsRef = useRef<any>(null!);

    useFrame((_state, _delta) => {
        // Implement impulse camera shake on reel stop or win
        if (status === 'stopping' || status === 'won') {
            const shakeAmount = status === 'won' ? 0.05 : 0.01;
            cameraShake.current.set(
                (Math.random() - 0.5) * shakeAmount,
                (Math.random() - 0.5) * shakeAmount,
                (Math.random() - 0.5) * shakeAmount
            );
        } else {
            cameraShake.current.lerp(new THREE.Vector3(0, 0, 0), 0.1);
        }
    });

    return (
        <>
            <color attach="background" args={['#020202']} />

            <PresentationControls
                global
                snap
                rotation={[0.1, 0, 0]}
                polar={[-Math.PI / 10, Math.PI / 6]}
                azimuth={[-Math.PI / 6, Math.PI / 6]}
            >
                <Suspense fallback={null}>
                    <group position={[cameraShake.current.x, cameraShake.current.y, cameraShake.current.z]}>
                        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.25}>
                            <SlotMachine />
                        </Float>
                    </group>
                    <Environment preset="night" background={false} />
                </Suspense>
            </PresentationControls>

            <OrbitControls
                ref={controlsRef}
                enablePan={false}
                enableZoom={true}
                minDistance={8}
                maxDistance={20}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.5}
                makeDefault
            />

            <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

            {/* Strategic Spotlights for Presence */}
            <spotLight
                position={[0, 10, 15]}
                angle={0.4}
                penumbra={1}
                intensity={300}
                color="#ffffff"
                castShadow
            />

            <pointLight position={[-8, 0, 5]} intensity={100} color="#00ffff" />
            <pointLight position={[8, 0, 5]} intensity={100} color="#ff00ff" />
            <pointLight position={[0, -5, 10]} intensity={50} color="#ffffff" />

            <EffectComposer>
                <Bloom
                    luminanceThreshold={0.9}
                    mipmapBlur
                    intensity={2.0}
                    radius={0.5}
                />
                <Noise opacity={0.08} />
                <Vignette eskil={false} offset={0.1} darkness={1.3} />
                <ChromaticAberration
                    offset={new THREE.Vector2(0.0015, 0.0015)}
                    radialModulation={false}
                    modulationOffset={0}
                />
            </EffectComposer>
        </>
    );
};
