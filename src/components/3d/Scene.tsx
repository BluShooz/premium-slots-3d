import React, { Suspense } from 'react';
import { OrbitControls, PerspectiveCamera, Environment, Stars, Float } from '@react-three/drei';
import { SlotMachine } from './SlotMachine';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';

export const Scene: React.FC = () => {
    return (
        <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
            <OrbitControls
                enablePan={false}
                minDistance={10}
                maxDistance={25}
                maxPolarAngle={Math.PI / 2}
            />

            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={1} color="gold" />

            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                <SlotMachine />
            </Float>

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Environment preset="city" />

            <EffectComposer>
                <Bloom luminanceThreshold={1} luminanceSmoothing={0.9} height={300} />
                <Noise opacity={0.02} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
        </Suspense>
    );
};
