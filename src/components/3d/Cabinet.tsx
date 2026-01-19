import React from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import pbrTextureUrl from '../../assets/pbr_textures.png';

export const Cabinet: React.FC = () => {
    const pbrTexture = useTexture(pbrTextureUrl);
    const spin = useGameStore(state => state.spin);
    const status = useGameStore(state => state.status);

    // Configure texture mapping
    pbrTexture.wrapS = THREE.RepeatWrapping;
    pbrTexture.wrapT = THREE.RepeatWrapping;
    pbrTexture.repeat.set(2, 2);

    return (
        <group>
            {/* Main Body */}
            <mesh position={[0, 0, -1.5]}>
                <boxGeometry args={[12, 10, 2.5]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    metalness={0.9}
                    roughness={0.2}
                    map={pbrTexture}
                />
            </mesh>

            {/* Front Face Plate (Glassy/Reflective) */}
            <mesh position={[0, 0, -0.3]}>
                <boxGeometry args={[11.5, 9.5, 0.2]} />
                <meshStandardMaterial color="#050505" metalness={1} roughness={0.05} />
            </mesh>

            {/* Decorative Side Panels (Gold) */}
            <mesh position={[-6.1, 0, -0.5]}>
                <boxGeometry args={[0.2, 10, 3]} />
                <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} map={pbrTexture} />
            </mesh>
            <mesh position={[6.1, 0, -0.5]}>
                <boxGeometry args={[0.2, 10, 3]} />
                <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} map={pbrTexture} />
            </mesh>

            {/* LED Strips */}
            <mesh position={[-5.8, 0, 0.5]}>
                <boxGeometry args={[0.15, 9, 0.15]} />
                <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={5} />
            </mesh>
            <mesh position={[5.8, 0, 0.5]}>
                <boxGeometry args={[0.15, 9, 0.15]} />
                <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={5} />
            </mesh>

            {/* Physical Control Panel */}
            <mesh position={[0, -4.5, 1]} rotation={[-Math.PI / 4, 0, 0]}>
                <boxGeometry args={[12, 2, 0.5]} />
                <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Physical Spin Button */}
            <group position={[0, -4.5, 1.3]} rotation={[-Math.PI / 4, 0, 0]}
                onPointerDown={(e) => { e.stopPropagation(); status === 'idle' && spin(); }}>
                <mesh position={[0, 0.2, 0]}>
                    <cylinderGeometry args={[0.8, 0.8, 0.4, 32]} />
                    <meshStandardMaterial
                        color={status === 'idle' ? "#ff0044" : "#440011"}
                        emissive={status === 'idle' ? "#ff0044" : "#000"}
                        emissiveIntensity={2}
                    />
                </mesh>
                <mesh>
                    <cylinderGeometry args={[1, 1, 0.2, 32]} />
                    <meshStandardMaterial color="#111" metalness={1} roughness={0.05} />
                </mesh>
            </group>

            {/* Crown / Top Banner */}
            <mesh position={[0, 5.5, -0.5]}>
                <boxGeometry args={[12.5, 1.5, 3]} />
                <meshStandardMaterial color="#800" metalness={0.8} roughness={0.1} map={pbrTexture} />
            </mesh>
        </group>
    );
};
