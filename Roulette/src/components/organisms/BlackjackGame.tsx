import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowsClockwise, Plus, HandPalm, Info } from '@phosphor-icons/react';
import confetti from 'canvas-confetti';
import { useBalance } from '../../context/BalanceContext';
import { Card, CardView } from '../atoms/Card';
import { createDeck, calculateHandValue } from '../../lib/blackjackUtils';
import { cn } from '../../lib/utils';

type GameStatus = 'betting' | 'playing' | 'dealer-turn' | 'result';

const CHIP_OPTIONS = [
    { value: 50,  color: '#34d399', rim: '#059669', label: '50' },
    { value: 100, color: '#1db954', rim: '#15803d', label: '100' },
    { value: 250, color: '#0ea5e9', rim: '#0284c7', label: '250' },
    { value: 500, color: '#8b5cf6', rim: '#6d28d9', label: '500' },
];

const BlackjackGame: React.FC = () => {
    const navigate = useNavigate();
    const { balance, withdraw, deposit } = useBalance();
    
    // Game State
    const [deck, setDeck] = useState<Card[]>([]);
    const [playerHand, setPlayerHand] = useState<Card[]>([]);
    const [dealerHand, setDealerHand] = useState<Card[]>([]);
    const [status, setStatus] = useState<GameStatus>('betting');
    const [currentBet, setCurrentBet] = useState(0);
    const [tempBet, setTempBet] = useState(100);
    const [message, setMessage] = useState('');
    const [isWin, setIsWin] = useState<boolean | null>(null);

    const deal = useCallback(() => {
        if (balance < tempBet) { 
            setMessage('Insufficient balance!'); 
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

        setDeck(nextDeck);
        setPlayerHand(pHand);
        setDealerHand(dHand);
        setCurrentBet(tempBet);
        withdraw(tempBet);
        setIsWin(null);
        setMessage('');

        if (calculateHandValue(pHand) === 21) {
            handleRevealDealer(true, pHand, dHand, nextDeck);
        } else {
            setStatus('playing');
        }
    }, [balance, tempBet, withdraw]);

    const hit = useCallback(() => {
        const lastIndex = deck.length - 1;
        const card = deck[lastIndex];
        const nextDeck = deck.slice(0, lastIndex);
        const newHand = [...playerHand, card];
        
        setDeck(nextDeck);
        setPlayerHand(newHand);

        if (calculateHandValue(newHand) > 21) {
            setStatus('result');
            setMessage('Bust! Dealer Wins');
            setIsWin(false);
        }
    }, [deck, playerHand]);

    const handleRevealDealer = useCallback((playerHasBlackjack = false, pHand?: Card[], dHand?: Card[], currentDeck?: Card[]) => {
        setStatus('dealer-turn');
        const activePlayerHand = pHand || playerHand;
        const activeDealerHand = dHand || dealerHand;
        const activeDeck = currentDeck || deck;

        const revealed: Card[] = activeDealerHand.map(c => ({ ...c, isHidden: false }));
        setDealerHand(revealed);

        const dealerPlayNext = (currentHand: Card[], currentCardsDeck: Card[]) => {
            if (calculateHandValue(currentHand) < 17) {
                const nextCard = currentCardsDeck[currentCardsDeck.length - 1];
                const newDeck = currentCardsDeck.slice(0, -1);
                const newHand = [...currentHand, nextCard];
                setDealerHand(newHand);
                setDeck(newDeck);
                setTimeout(() => dealerPlayNext(newHand, newDeck), 800);
            } else {
                finalizeResult(currentHand, playerHasBlackjack, activePlayerHand);
            }
        };

        setTimeout(() => dealerPlayNext(revealed, activeDeck), 800);
    }, [deck, dealerHand, playerHand]);

    const finalizeResult = (finalDealerHand: Card[], playerHasBlackjack: boolean, activePlayerHand: Card[]) => {
        const pVal = calculateHandValue(activePlayerHand);
        const dVal = calculateHandValue(finalDealerHand);
        
        setStatus('result');

        if (playerHasBlackjack) {
            if (dVal === 21) {
                deposit(currentBet);
                setMessage('Push · Both Blackjack');
                setIsWin(null);
            } else {
                deposit(currentBet * 2.5);
                setMessage('Blackjack! ✦ 3:2 Payout');
                setIsWin(true);
                confetti({ particleCount: 180, spread: 70, origin: { y: 0.6 } });
            }
            return;
        }

        if (dVal > 21) {
            deposit(currentBet * 2);
            setMessage('Dealer Bust · You Win!');
            setIsWin(true);
            confetti({ particleCount: 120 });
        } else if (pVal > dVal) {
            deposit(currentBet * 2);
            setMessage('You Win!');
            setIsWin(true);
            confetti({ particleCount: 100 });
        } else if (pVal < dVal) {
            setMessage('Dealer Wins');
            setIsWin(false);
        } else {
            deposit(currentBet);
            setMessage('Push · Bet Returned');
            setIsWin(null);
        }
    };

    const reset = () => {
        setPlayerHand([]);
        setDealerHand([]);
        setStatus('betting');
        setMessage('');
        setIsWin(null);
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-4">
            {/* Header info */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/')}
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                    >
                        <ArrowLeft size={18} weight="bold" />
                    </button>
                    <div>
                        <h2 className="text-xl font-black tracking-tight">Blackjack</h2>
                        <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mt-1">Dealer Hits Soft 17 · 3:2 Blackjack</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 flex items-center gap-2">
                        <Info size={12} weight="fill" className="text-accent" />
                        <span className="text-[10px] font-black uppercase text-accent/80 tracking-widest">Fair Play</span>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="relative w-full aspect-[16/9] bg-[#065f46] rounded-[40px] border-8 border-[#3d2b1f] overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] flex flex-col justify-between p-12">
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[40%] border-2 border-white/10 rounded-full pointer-events-none opacity-20" />

                {/* Dealer Hand */}
                <div className="flex flex-col items-center gap-4 z-10">
                    <div className="flex gap-4 relative min-h-[150px]">
                        {dealerHand.map((card, i) => <CardView key={`${i}-${card.rank}`} card={card} index={i} />)}
                        {status !== 'betting' && dealerHand.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-xl font-black text-xs shadow-2xl z-30"
                            >
                                <span className={cn(calculateHandValue(dealerHand) > 21 ? 'text-red-500' : 'text-white/80')}>
                                    {calculateHandValue(dealerHand)}
                                </span>
                            </motion.div>
                        )}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Dealer</span>
                </div>

                {/* Center Message */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-20">
                    <AnimatePresence mode="wait">
                        {message && (
                            <motion.div
                                key={message}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={cn(
                                    "text-4xl md:text-6xl font-black tracking-tighter uppercase drop-shadow-2xl",
                                    isWin === true ? "text-yellow-400" : isWin === false ? "text-red-500" : "text-white/80"
                                )}
                            >
                                {message}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Player Hand */}
                <div className="flex flex-col items-center gap-4 z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Player</span>
                    <div className="flex gap-4 relative min-h-[150px]">
                        {playerHand.map((card, i) => <CardView key={`${i}-${card.rank}`} card={card} index={i} />)}
                        {playerHand.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 px-5 py-2 rounded-xl font-black text-sm text-black shadow-xl z-30"
                            >
                                {calculateHandValue(playerHand)}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-[#1e293b] border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative z-30">
                {status === 'betting' ? (
                    <>
                        <div className="flex items-center gap-8">
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">Wager Amount</span>
                                <div className="flex gap-2">
                                    {CHIP_OPTIONS.map(chip => (
                                        <button
                                            key={chip.value}
                                            onClick={() => setTempBet(chip.value)}
                                            disabled={balance < chip.value}
                                            className={cn(
                                                "w-12 h-12 rounded-full font-black text-[11px] transition-all relative border-2",
                                                tempBet === chip.value ? "border-slate-800 scale-110 shadow-lg" : "border-transparent opacity-40 hover:opacity-100",
                                                balance < chip.value && "cursor-not-allowed opacity-10"
                                            )}
                                            style={{ background: `linear-gradient(145deg, ${chip.color}, ${chip.rim})` }}
                                        >
                                            {chip.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="hidden sm:block w-px h-10 bg-slate-300" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">Total Stake</span>
                                <span className="text-3xl font-black text-white">${tempBet}</span>
                            </div>
                        </div>

                        <button
                            onClick={deal}
                            disabled={balance < tempBet}
                            className="w-full md:w-auto bg-accent text-black px-16 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed"
                        >
                            Deal Battles
                        </button>
                    </>
                ) : status === 'playing' ? (
                    <div className="flex items-center gap-4 w-full">
                        <button
                            onClick={hit}
                            className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/10 font-black uppercase tracking-widest text-sm hover:bg-white/10 text-white transition-all flex items-center justify-center gap-3"
                        >
                            <Plus size={18} weight="bold" /> Hit
                        </button>
                        <button
                            onClick={() => handleRevealDealer()}
                            className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/10 font-black uppercase tracking-widest text-sm hover:bg-white/10 text-white transition-all flex items-center justify-center gap-3"
                        >
                            <HandPalm size={18} weight="fill" /> Stand
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={reset}
                        className="w-full h-14 rounded-2xl bg-accent text-black font-black uppercase tracking-widest text-sm shadow-xl flex items-center justify-center gap-3 animate-pulse"
                    >
                        <ArrowsClockwise size={18} weight="bold" /> Play Again
                    </button>
                )}
            </div>
        </div>
    );
};

export default BlackjackGame;
