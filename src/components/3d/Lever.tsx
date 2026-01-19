import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';

export const Lever: React.FC = () => {
    const meshRef = useRef<THREE.Group>(null!);
    const armRef = useRef<THREE.Mesh>(null!);
    const leverStatus = useRef<'idle' | 'pulling' | 'returning'>('idle');
    const pullAngle = useRef(0);

    const status = useGameStore(state => state.status);
    const spin = useGameStore(state => state.spin);

    const handlePointerDown = (e: any) => {
        e.stopPropagation();
        if (status === 'idle') {
            leverStatus.current = 'pulling';
        }
    };

    const handlePointerUp = () => {
        if (leverStatus.current === 'pulling') {
            leverStatus.current = 'returning';
            if (pullAngle.current > 0.8) {
                spin();
            }
        }
    };

    useFrame((_state, delta) => {
        if (leverStatus.current === 'pulling') {
            pullAngle.current = Math.min(pullAngle.current + delta * 5, 1.2);
        } else if (leverStatus.current === 'returning') {
            pullAngle.current = Math.max(pullAngle.current - delta * 10, 0);
            if (pullAngle.current === 0) leverStatus.current = 'idle';
        }

        if (armRef.current) {
            armRef.current.rotation.x = pullAngle.current;
        }
    });

    return (
        <group ref={meshRef} position={[2.2, 0, 0]}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}>
            {/* Base Socket */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.2, 0.3, 0.4, 16]} />
                <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Rotating Arm */}
            <group ref={armRef}>
                {/* Rod */}
                <mesh position={[0, 0.6, 0]}>
                    <cylinderGeometry args={[0.05, 0.05, 1.2, 8]} />
                    <meshStandardMaterial color="#888" metalness={1} roughness={0.05} />
                </mesh>

                {/* Ball Knob */}
                <mesh position={[0, 1.2, 0]}>
                    <sphereGeometry args={[0.2, 24, 24]} />
                    <meshStandardMaterial color="#d00" metalness={0.5} roughness={0.2} emissive="#300" />
                </mesh>
            </group>
        </group>
    );
};
