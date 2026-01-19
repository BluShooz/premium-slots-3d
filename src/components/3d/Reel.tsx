import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { ReelBlurMaterial } from '../../shaders/ReelBlurMaterial';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../hooks/useAudioSystem';
import type { GameStatus } from '../../store/useGameStore';
import { SYMBOLS_COUNT } from '../../logic/SlotLogic';
import symbolsUrl from '../../assets/symbols.png';

interface ReelProps {
    index: number;
    position: [number, number, number];
}

type ReelPhysicsState = 'idle' | 'accelerating' | 'cruising' | 'decelerating' | 'settling';

export const Reel: React.FC<ReelProps> = ({ index, position }) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const materialRef = useRef<any>(null!);
    void ReelBlurMaterial;

    const status = useGameStore((state: { status: GameStatus }) => state.status);
    const results = useGameStore((state: { results: number[][] }) => state.results);

    const [speed, setSpeed] = useState(0);
    const [offset, setOffset] = useState(0);
    const physicsState = useRef<ReelPhysicsState>('idle');
    const targetOffset = useRef(0);
    const startTime = useRef(0);

    const texture = useTexture(symbolsUrl);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    // Transition physics state based on game status
    useEffect(() => {
        if (status === 'spinning') {
            physicsState.current = 'accelerating';
            startTime.current = performance.now() / 1000;
        } else if (status === 'stopping') {
            // We'll trigger deceleration individually from SlotMachine.tsx if possible,
            // but for now, we'll use a staggered delay based on index.
            const staggerDelay = index * 0.5 + Math.random() * 0.2;
            setTimeout(() => {
                const symbolIndex = results[index][1]; // Middle symbol
                const resultOffset = (symbolIndex / SYMBOLS_COUNT);
                // Calculate target that aligns with the symbol grid
                const currentSpins = Math.floor(offset);
                targetOffset.current = currentSpins + resultOffset + 2; // Add 2 full spins for smooth decel
                physicsState.current = 'decelerating';
            }, staggerDelay * 1000);
        } else if (status === 'idle') {
            physicsState.current = 'idle';
            setSpeed(0);
        }
    }, [status, index, results]);

    useFrame((_state, delta) => {
        let currentSpeed = speed;

        if (physicsState.current === 'accelerating') {
            currentSpeed = Math.min(speed + delta * 25, 12); // Fast motor accel
            setSpeed(currentSpeed);
        } else if (physicsState.current === 'cruising') {
            // Add subtle micro-wobble (low freq noise)
            const wobble = Math.sin(performance.now() * 0.05) * 0.1;
            currentSpeed = 12 + wobble;
            setSpeed(currentSpeed);
        } else if (physicsState.current === 'decelerating') {
            const remaining = targetOffset.current - offset;
            if (remaining > 0.05) {
                // Smooth deceleration curve
                currentSpeed = Math.max(remaining * 6, 1);
                setSpeed(currentSpeed);
            } else {
                setOffset(targetOffset.current);
                setSpeed(0);
                physicsState.current = 'settling';
                startTime.current = performance.now() / 1000;
                soundManager.playStop(); // Synchronized thunk
            }
        } else if (physicsState.current === 'settling') {
            // Mechanical bounce-back (settle)
            const elapsed = (performance.now() / 1000) - startTime.current;
            const bounce = Math.sin(elapsed * 20) * Math.exp(-elapsed * 10) * 0.02;
            setOffset(targetOffset.current + bounce);
            if (elapsed > 0.5) physicsState.current = 'idle';
        }

        if (physicsState.current !== 'idle' && physicsState.current !== 'settling') {
            setOffset(prev => prev + currentSpeed * delta);
        }

        if (materialRef.current) {
            materialRef.current.uOffset = -offset;
            materialRef.current.uBlurAmount = currentSpeed * 0.4;
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            <cylinderGeometry args={[1, 1, 2, 48, 1, true]} />
            <reelBlurMaterial
                ref={materialRef}
                uMap={texture}
                transparent
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};
