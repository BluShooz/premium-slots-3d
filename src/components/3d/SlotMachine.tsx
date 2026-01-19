import React, { useEffect } from 'react';
import { Cabinet } from './Cabinet';
import { Reel } from './Reel';
import { Lever } from './Lever';
import { useGameStore } from '../../store/useGameStore';
import { generateResult, calculateWin } from '../../logic/SlotLogic';

export const SlotMachine: React.FC = () => {
    const status = useGameStore(state => state.status);
    const setResults = useGameStore(state => state.setResults);
    const setStatus = useGameStore(state => state.setStatus);
    const setWin = useGameStore(state => state.setWin);
    const bet = useGameStore(state => state.bet);

    useEffect(() => {
        if (status === 'spinning') {
            const timer = setTimeout(() => {
                const newResults = generateResult();
                setResults(newResults);
                setStatus('stopping');
            }, 2000);
            return () => clearTimeout(timer);
        }

        if (status === 'stopping') {
            const timer = setTimeout(() => {
                const results = useGameStore.getState().results;
                const winAmount = calculateWin(results, bet);
                if (winAmount > 0) {
                    setWin(winAmount);
                    setStatus('won');
                } else {
                    setStatus('idle');
                }
            }, 3000); // Wait for reels to stop
            return () => clearTimeout(timer);
        }
    }, [status, setResults, setStatus, setWin, bet]);

    return (
        <group>
            {/* Reels in a container */}
            <group position={[0, 0, 0.5]}>
                {[...Array(5)].map((_, i) => (
                    <Reel
                        key={i}
                        index={i}
                        position={[(i - 2) * 2.1, 0, 0]}
                    />
                ))}
            </group>

            {/* Decorative Cabinet */}
            <Cabinet />

            {/* Interactive Lever */}
            <Lever />
        </group>
    );
};
