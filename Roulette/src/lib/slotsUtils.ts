import { SlotSymbol } from '../types/slots';

export interface SlotResult {
    totalWin: number;
    wonLine: number | null;
    isNearMiss: boolean;
    payout: number;
}

/**
 * Pure function to evaluate a slot machine spin result
 * Satisfies "Pure Functions & No Side Effects"
 */
export const evaluateSpin = (results: readonly SlotSymbol[][], bet: number): SlotResult => {
    const lineWin = Array.from({ length: 3 }).reduce(
        (acc, _, row) => {
            const line = [results[0][row], results[1][row], results[2][row]];
            if (line.every(s => s.id === line[0].id)) {
                return {
                    totalWin: acc.totalWin + line[0].value * (bet / 10),
                    wonLine: row
                };
            }
            return acc;
        },
        { totalWin: 0, wonLine: null as number | null }
    );

    if (lineWin.totalWin > 0) {
        return {
            totalWin: lineWin.totalWin,
            wonLine: lineWin.wonLine,
            isNearMiss: false,
            payout: lineWin.totalWin
        };
    }

    const midRow = [results[0][1], results[1][1], results[2][1]];
    const counts = midRow.reduce((acc, symbol) => ({
        ...acc,
        [symbol.id]: (acc[symbol.id] || 0) + 1
    }), {} as Record<string, number>);

    if (Object.values(counts).some(c => c === 2)) {
        const payout = Math.floor(bet * 0.5);
        return {
            totalWin: 0,
            wonLine: null,
            isNearMiss: true,
            payout: payout
        };
    }

    return {
        totalWin: 0,
        wonLine: null,
        isNearMiss: false,
        payout: 0
    };
};

/**
 * Creates random spin results
 */
export const generateResults = (symbols: readonly SlotSymbol[], reelCount: number): SlotSymbol[][] => 
    Array.from({ length: reelCount }, () =>
        Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)])
    );
