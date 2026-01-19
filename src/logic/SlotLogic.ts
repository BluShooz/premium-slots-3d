export const SYMBOLS_COUNT = 9; // 0-8 symbols in the 3x3 grid
export const REELS_COUNT = 5;
export const ROWS_COUNT = 3;

// Symbol weights (0 is rarest, 9 is common)
const WEIGHTS = [1, 2, 4, 6, 8, 10, 15, 20, 25, 30];
const TOTAL_WEIGHT = WEIGHTS.reduce((a, b) => a + b, 0);

export const getRandomSymbol = () => {
    let r = Math.random() * TOTAL_WEIGHT;
    for (let i = 0; i < SYMBOLS_COUNT; i++) {
        if (r < WEIGHTS[i]) return i;
        r -= WEIGHTS[i];
    }
    return SYMBOLS_COUNT - 1;
};

export const generateResult = () => {
    const result: number[][] = [];
    for (let i = 0; i < REELS_COUNT; i++) {
        const reel: number[] = [];
        for (let j = 0; j < ROWS_COUNT; j++) {
            reel.push(getRandomSymbol());
        }
        result.push(reel);
    }
    return result;
};

export const calculateWin = (result: number[][], bet: number) => {
    let winAmount = 0;

    // Simple payline logic: Check middle row for matching symbols
    const middleRow = result.map(reel => reel[1]);
    const counts: Record<number, number> = {};

    middleRow.forEach(s => {
        counts[s] = (counts[s] || 0) + 1;
    });

    // Check for 3, 4, or 5 of a kind
    Object.entries(counts).forEach(([symbol, count]) => {
        const s = parseInt(symbol);
        if (count >= 3) {
            // Base multiplier based on symbol rarity (lower index = higher pay)
            const basePay = (10 - s) * 5;
            const multiplier = count === 5 ? 10 : count === 4 ? 3 : 1;
            winAmount += basePay * multiplier * (bet / 10);
        }
    });

    return Math.floor(winAmount);
};
