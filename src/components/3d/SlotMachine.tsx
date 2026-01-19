import React, { useEffect } from 'react';
import { Reel } from './Reel';
import { Cabinet } from './Cabinet';
import { useGameStore } from '../../store/useGameStore';
import { generateResult, calculateWin } from '../../logic/SlotLogic';

export const SlotMachine: React.FC = () => {
    const { status, stop, setWin, bet, results } = useGameStore();

    useEffect(() => {
        if (status === 'spinning') {
            // Logic for stopping reels sequentially
            const timer = setTimeout(() => {
                const newResults = generateResult();
                stop(newResults);
            }, 2000); // Spin for 2 seconds

            return () => clearTimeout(timer);
        }

        if (status === 'stopping') {
            // After stopping, check for win
            const timer = setTimeout(() => {
                const win = calculateWin(results, bet);
                if (win > 0) {
                    setWin(win);
                } else {
                    useGameStore.getState().resetStatus();
                }
            }, 1500); // Wait for reels to visually stop

            return () => clearTimeout(timer);
        }
    }, [status]);

    return (
        <group>
            <Cabinet />

            {/* 5 Reels spaced apart */}
            <group position={[0, 0, 0.5]}>
                {[...Array(5)].map((_, i) => (
                    <Reel
                        key={i}
                        index={i}
                        position={[(i - 2) * 2.2, 0, 0]}
                    />
                ))}
            </group>
        </group>
    );
};
