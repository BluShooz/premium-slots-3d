import React from 'react';

export const Cabinet: React.FC = () => {

    return (
        <group>
            {/* Outer Shell */}
            <mesh position={[0, 0, -1.2]}>
                <boxGeometry args={[13, 7, 1.5]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    metalness={0.9}
                    roughness={0.1}
                    envMapIntensity={1}
                />
            </mesh>

            {/* Decorative Side Panels */}
            <mesh position={[-6.25, 0, -0.2]}>
                <boxGeometry args={[0.5, 6.5, 2]} />
                <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
            </mesh>
            <mesh position={[6.25, 0, -0.2]}>
                <boxGeometry args={[0.5, 6.5, 2]} />
                <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
            </mesh>

            {/* Top Banner Area */}
            <mesh position={[0, 3.5, -0.5]}>
                <boxGeometry args={[12, 1, 1]} />
                <meshStandardMaterial
                    color="#c41e3a"
                    emissive="#c41e3a"
                    emissiveIntensity={0.5}
                    metalness={0.8}
                />
            </mesh>

            {/* Lights / LED strips */}
            <mesh position={[-5.8, 0, 0.5]}>
                <boxGeometry args={[0.1, 6, 0.1]} />
                <meshStandardMaterial color="cyan" emissive="cyan" emissiveIntensity={2} />
            </mesh>
            <mesh position={[5.8, 0, 0.5]}>
                <boxGeometry args={[0.1, 6, 0.1]} />
                <meshStandardMaterial color="cyan" emissive="cyan" emissiveIntensity={2} />
            </mesh>
        </group>
    );
};
