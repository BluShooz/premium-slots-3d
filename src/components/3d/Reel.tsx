import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { ReelBlurMaterial } from '../../shaders/ReelBlurMaterial';
import { useGameStore } from '../../store/useGameStore';
import type { GameStatus } from '../../store/useGameStore';
import { SYMBOLS_COUNT } from '../../logic/SlotLogic';
import symbolsUrl from '../../assets/symbols.png';

interface ReelProps {
    index: number;
    position: [number, number, number];
}

export const Reel: React.FC<ReelProps> = ({ index, position }) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const materialRef = useRef<any>(null!);
    void ReelBlurMaterial; // Suppress unused warning, we only need the side effect of extend()
    const status = useGameStore((state: { status: GameStatus }) => state.status);
    const results = useGameStore((state: { results: number[][] }) => state.results);

    const [speed, setSpeed] = useState(0);
    const [offset, setOffset] = useState(0);
    const targetOffset = useRef(0);
    const isStopping = useRef(false);

    const texture = useTexture(symbolsUrl);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    useFrame((_state, delta) => {
        if (status === 'spinning') {
            const newSpeed = Math.min(speed + delta * 5, 10);
            setSpeed(newSpeed);
            setOffset(prev => prev + newSpeed * delta);
            isStopping.current = false;
        } else if (status === 'stopping' && !isStopping.current) {
            // Calculate where to stop based on result
            const symbolIndex = results[index][1]; // Middle symbol
            const resultOffset = (symbolIndex / SYMBOLS_COUNT);
            targetOffset.current = Math.ceil(offset * 10) / 10 + resultOffset + 2; // Add some spins before stop
            isStopping.current = true;
        }

        if (isStopping.current) {
            const remaining = targetOffset.current - offset;
            if (remaining > 0.01) {
                const newSpeed = Math.max(remaining * 5, 0.5);
                setSpeed(newSpeed);
                setOffset(prev => prev + newSpeed * delta);
            } else {
                setOffset(targetOffset.current);
                setSpeed(0);
            }
        }

        if (materialRef.current) {
            materialRef.current.uOffset = -offset;
            materialRef.current.uBlurAmount = speed * 0.5;
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            <cylinderGeometry args={[1, 1, 2, 32, 1, true]} />
            <reelBlurMaterial
                ref={materialRef}
                uMap={texture}
                transparent
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};
