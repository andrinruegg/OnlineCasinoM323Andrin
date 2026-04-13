import { useState, useCallback } from 'react';
import { SlotSymbol } from '../types/slots';
import { evaluateSpin, generateResults } from '../lib/slotsUtils';
import { update } from '../lib/fpUtils';

interface SlotsState {
    readonly reels: readonly SlotSymbol[][];
    readonly spinningReels: readonly boolean[];
    readonly isSpinning: boolean;
    readonly message: string;
    readonly winAmount: number;
    readonly winningLine: number | null;
    readonly bet: number;
}

export const useSlots = (
    balance: number,
    withdraw: (amount: number) => boolean,
    deposit: (amount: number) => void,
    symbols: readonly SlotSymbol[]
) => {
    const [state, setState] = useState<SlotsState>({
        reels: Array(3).fill(null).map(() => [symbols[0], symbols[1], symbols[2]]),
        spinningReels: [false, false, false],
        isSpinning: false,
        message: 'Good luck!',
        winAmount: 0,
        winningLine: null,
        bet: 100,
    });

    const setBet = useCallback((amount: number) => {
        setState(prev => update(prev, { bet: amount }));
    }, []);

    const spin = useCallback(async () => {
        if (state.isSpinning) return;
        if (balance < state.bet) {
            setState(prev => update(prev, { message: 'Insufficient balance!' }));
            return;
        }

        setState(prev => update(prev, {
            isSpinning: true,
            spinningReels: [true, true, true],
            message: 'Spinning...',
            winAmount: 0,
            winningLine: null,
        }));

        withdraw(state.bet);

        const newResults = generateResults(symbols, 3);

        // Functional sequence of state updates for visual effect
        await Array.from({ length: 3 }).reduce(async (promise, _, i) => {
            await promise;
            await new Promise(res => setTimeout(res, 1500 + i * 400));
            setState(prev => update(prev, {
                spinningReels: Object.assign([...prev.spinningReels], { [i]: false }),
                reels: Object.assign([...prev.reels], { [i]: newResults[i] }),
            }));
        }, Promise.resolve());

        const outcome = evaluateSpin(newResults, state.bet);

        setState(prev => update(prev, {
            isSpinning: false,
            winAmount: outcome.totalWin > 0 ? outcome.totalWin : (outcome.isNearMiss ? outcome.payout : 0),
            winningLine: outcome.wonLine,
            message: outcome.totalWin > 0 
                ? `Winner! +$${outcome.totalWin.toLocaleString()}` 
                : (outcome.isNearMiss ? `Near miss! +$${outcome.payout}` : 'Better luck next time'),
        }));

        if (outcome.totalWin > 0) {
            deposit(outcome.totalWin);
            return { win: true, amount: outcome.totalWin };
        } else if (outcome.isNearMiss) {
            deposit(outcome.payout);
            return { win: false, nearMiss: true, amount: outcome.payout };
        }
        
        return { win: false };
    }, [state.isSpinning, state.bet, balance, withdraw, deposit, symbols]);

    return {
        state,
        setBet,
        spin,
    };
};
