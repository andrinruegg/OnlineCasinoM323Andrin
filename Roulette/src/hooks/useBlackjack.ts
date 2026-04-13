import { useState, useCallback } from 'react';
import { Card } from '../components/atoms/Card';
import { createDeck, calculateHandValue } from '../lib/blackjackUtils';
import { update } from '../lib/fpUtils';

export type GameStatus = 'betting' | 'playing' | 'dealer-turn' | 'result';

interface BlackjackState {
    readonly deck: readonly Card[];
    readonly playerHand: readonly Card[];
    readonly dealerHand: readonly Card[];
    readonly status: GameStatus;
    readonly currentBet: number;
    readonly tempBet: number;
    readonly message: string;
    readonly isWin: boolean | null;
}

export const useBlackjack = (
    balance: number,
    withdraw: (amount: number) => boolean,
    deposit: (amount: number) => void
) => {
    const [state, setState] = useState<BlackjackState>({
        deck: [],
        playerHand: [],
        dealerHand: [],
        status: 'betting',
        currentBet: 0,
        tempBet: 100,
        message: '',
        isWin: null,
    });

    const setTempBet = useCallback((amount: number) => {
        setState(prev => update(prev, { tempBet: amount }));
    }, []);

    const reset = useCallback(() => {
        setState(prev => update(prev, {
            playerHand: [],
            dealerHand: [],
            status: 'betting',
            message: '',
            isWin: null,
        }));
    }, []);

    const finalizeResult = useCallback((
        finalDealerHand: readonly Card[], 
        playerHasBlackjack: boolean, 
        activePlayerHand: readonly Card[],
        betAmount: number
    ) => {
        const pVal = calculateHandValue([...activePlayerHand]);
        const dVal = calculateHandValue([...finalDealerHand]);
        
        const outcome = playerHasBlackjack
            ? (dVal === 21 
                ? { winAmount: betAmount, msg: 'Push · Both Blackjack', winStatus: null as boolean | null }
                : { winAmount: betAmount * 2.5, msg: 'Blackjack! ✦ 3:2 Payout', winStatus: true as boolean | null })
            : (dVal > 21
                ? { winAmount: betAmount * 2, msg: 'Dealer Bust · You Win!', winStatus: true as boolean | null }
                : (pVal > dVal
                    ? { winAmount: betAmount * 2, msg: 'You Win!', winStatus: true as boolean | null }
                    : (pVal < dVal
                        ? { winAmount: 0, msg: 'Dealer Wins', winStatus: false as boolean | null }
                        : { winAmount: betAmount, msg: 'Push · Bet Returned', winStatus: null as boolean | null })));

        const { winStatus, msg, winAmount } = outcome;


        if (winAmount > 0) deposit(winAmount);

        setState(prev => update(prev, {
            status: 'result',
            message: msg,
            isWin: winStatus,
        }));

        return { winStatus, msg, winAmount };
    }, [deposit]);

    const handleRevealDealer = useCallback((
        playerHasBlackjack = false, 
        pHand?: readonly Card[], 
        dHand?: readonly Card[], 
        currentDeck?: readonly Card[],
        betAmount?: number
    ) => {
        const activePlayerHand = pHand || state.playerHand;
        const activeDealerHand = dHand || state.dealerHand;
        const activeDeck = currentDeck || state.deck;
        const activeBet = betAmount || state.currentBet;

        setState(prev => update(prev, { status: 'dealer-turn' }));

        const revealed: Card[] = activeDealerHand.map(c => ({ ...c, isHidden: false }));
        setState(prev => update(prev, { dealerHand: revealed }));

        const dealerPlayNext = (currentHand: readonly Card[], currentCardsDeck: readonly Card[]) => {
            if (calculateHandValue([...currentHand]) < 17) {
                const nextCard = currentCardsDeck[currentCardsDeck.length - 1];
                const newDeck = currentCardsDeck.slice(0, -1);
                const newHand = [...currentHand, nextCard];
                
                setState(prev => update(prev, { 
                    dealerHand: newHand,
                    deck: newDeck
                }));
                
                setTimeout(() => dealerPlayNext(newHand, newDeck), 800);
            } else {
                finalizeResult(currentHand, playerHasBlackjack, activePlayerHand, activeBet);
            }
        };

        setTimeout(() => dealerPlayNext(revealed, activeDeck), 800);
    }, [state.playerHand, state.dealerHand, state.deck, state.currentBet, finalizeResult]);

    const deal = useCallback(() => {
        if (balance < state.tempBet) { 
            setState(prev => update(prev, { message: 'Insufficient balance!' }));
            return; 
        }

        const newDeck = createDeck();
        const p1 = newDeck[newDeck.length - 1];
        const d1 = newDeck[newDeck.length - 2];
        const p2 = newDeck[newDeck.length - 3];
        const d2Hidden = { ...newDeck[newDeck.length - 4], isHidden: true };
        const nextDeck = newDeck.slice(0, -4);

        const pHand = [p1, p2];
        const dHand = [d1, d2Hidden];

        withdraw(state.tempBet);

        setState(prev => update(prev, {
            deck: nextDeck,
            playerHand: pHand,
            dealerHand: dHand,
            currentBet: state.tempBet,
            isWin: null,
            message: '',
        }));

        if (calculateHandValue(pHand) === 21) {
            handleRevealDealer(true, pHand, dHand, nextDeck, state.tempBet);
        } else {
            setState(prev => update(prev, { status: 'playing' }));
        }
    }, [balance, state.tempBet, withdraw, handleRevealDealer]);

    const hit = useCallback(() => {
        if (state.status !== 'playing') return;

        const lastIndex = state.deck.length - 1;
        const card = state.deck[lastIndex];
        const nextDeck = state.deck.slice(0, lastIndex);
        const newHand = [...state.playerHand, card];
        
        setState(prev => update(prev, {
            deck: nextDeck,
            playerHand: newHand,
        }));

        if (calculateHandValue(newHand) > 21) {
            setState(prev => update(prev, {
                status: 'result',
                message: 'Bust! Dealer Wins',
                isWin: false,
            }));
        }
    }, [state.status, state.deck, state.playerHand]);

    const stand = useCallback(() => {
        if (state.status !== 'playing') return;
        handleRevealDealer(false);
    }, [state.status, handleRevealDealer]);

    return {
        state,
        setTempBet,
        deal,
        hit,
        stand,
        reset,
    };
};
