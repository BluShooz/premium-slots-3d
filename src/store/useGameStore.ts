import { create } from 'zustand';

export type GameStatus = 'idle' | 'spinning' | 'stopping' | 'checking' | 'won' | 'lost';

interface GameState {
    credits: number;
    bet: number;
    status: GameStatus;
    results: number[][]; // 3x5 matrix of symbols
    lastWin: number;

    // Actions
    spin: () => void;
    stop: (results: number[][]) => void;
    setBet: (amount: number) => void;
    addCredits: (amount: number) => void;
    resetStatus: () => void;
    setWin: (amount: number) => void;
    setResults: (results: number[][]) => void;
    setStatus: (status: GameStatus) => void;
}

export const useGameStore = create<GameState>((set) => ({
    credits: 1000,
    bet: 10,
    status: 'idle',
    results: [
        [0, 1, 2],
        [3, 4, 5],
        [0, 1, 2],
        [3, 4, 5],
        [0, 1, 2],
    ],
    lastWin: 0,

    spin: () => set((state) => {
        if (state.credits < state.bet || state.status !== 'idle') return state;
        return {
            status: 'spinning',
            credits: state.credits - state.bet,
            lastWin: 0
        };
    }),

    stop: (results) => set({
        status: 'stopping',
        results
    }),

    setBet: (amount) => set({ bet: amount }),

    addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),

    resetStatus: () => set({ status: 'idle' }),

    setWin: (amount) => set((state) => ({
        status: 'won',
        credits: state.credits + amount,
        lastWin: amount
    })),

    setResults: (results) => set({ results }),

    setStatus: (status) => set({ status }),
}));
