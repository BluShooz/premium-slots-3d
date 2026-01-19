import React from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import pbrTextureUrl from '../../assets/pbr_textures.png';

export const Cabinet: React.FC = () => {
    const pbrTexture = useTexture(pbrTextureUrl);
    const spin = useGameStore(state => state.spin);
    const status = useGameStore(state => state.status);

    pbrTexture.wrapS = THREE.RepeatWrapping;
    pbrTexture.wrapT = THREE.RepeatWrapping;
    pbrTexture.repeat.set(2, 2);

    return (
        <group>
            {/* Heavy Base - Anchors the machine */}
            <mesh position={[0, -4.5, -0.5]}>
                <boxGeometry args={[7, 1.5, 4]} />
                <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.3} map={pbrTexture} />
            </mesh>

            {/* Main Column */}
            <mesh position={[0, 0, -1.5]}>
                <boxGeometry args={[12, 11, 3]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    metalness={0.9}
                    roughness={0.2}
                    map={pbrTexture}
                />
            </mesh>

            {/* Tilted Front Panel Area */}
            <group position={[0, 0, -0.1]} rotation={[-Math.PI / 16, 0, 0]}>
                {/* Screen Bezel */}
                <mesh position={[0, 0.5, 0]}>
                    <boxGeometry args={[11.5, 7.5, 0.4]} />
                    <meshStandardMaterial color="#050505" metalness={1} roughness={0.05} />
                </mesh>

                {/* Glossy Screen Surface */}
                <mesh position={[0, 0.5, 0.21]}>
                    <planeGeometry args={[11, 7]} />
                    <meshPhysicalMaterial
                        color="#000"
                        roughness={0}
                        metalness={0}
                        transmission={0.5}
                        thickness={0.1}
                        transparent
                        opacity={0.3}
                    />
                </mesh>
            </group>

            {/* Control Panel Shelf (Tilted forward for player ergonomics) */}
            <group position={[0, -3.8, 1.2]} rotation={[-Math.PI / 6, 0, 0]}>
                <mesh>
                    <boxGeometry args={[12, 2.5, 0.6]} />
                    <meshStandardMaterial color="#111" metalness={1} roughness={0.1} />
                </mesh>

                {/* Physical Spin Button */}
                <group position={[0, 0.3, 0]}
                    onPointerDown={(e) => { e.stopPropagation(); status === 'idle' && spin(); }}>
                    <mesh position={[0, 0.2, 0]}>
                        <cylinderGeometry args={[0.9, 0.9, 0.4, 32]} />
                        <meshStandardMaterial
                            color={status === 'idle' ? "#ff0044" : "#440011"}
                            emissive={status === 'idle' ? "#ff0044" : "#000"}
                            emissiveIntensity={2}
                        />
                    </mesh>
                    <mesh>
                        <cylinderGeometry args={[1.1, 1.1, 0.2, 32]} />
                        <meshStandardMaterial color="#333" metalness={1} roughness={0.1} />
                    </mesh>
                </group>
            </group>

            {/* LED Side Strips - Vibrant Ambient Light */}
            <mesh position={[-6.1, 0, 0.5]}>
                <boxGeometry args={[0.2, 11, 0.2]} />
                <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={3} />
            </mesh>
            <mesh position={[6.1, 0, 0.5]}>
                <boxGeometry args={[0.2, 11, 0.2]} />
                <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={3} />
            </mesh>

            {/* Top Banner / Crown */}
            <mesh position={[0, 6, -0.5]}>
                <boxGeometry args={[12.5, 2, 3.5]} />
                <meshStandardMaterial color="#600" metalness={0.8} roughness={0.1} map={pbrTexture} />
            </mesh>
        </group>
    );
};
