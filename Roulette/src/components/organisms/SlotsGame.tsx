import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowsClockwise, Info, Lightning } from '@phosphor-icons/react';
import { useBalance } from '../../context/BalanceContext';
import confetti from 'canvas-confetti';
import { cn } from '../../lib/utils';

import { SlotSymbol } from '../../types/slots';
import { evaluateSpin, generateResults } from '../../lib/slotsUtils';

const SYMBOLS: SlotSymbol[] = [
    { id: 'seven',   display: '7',  value: 200, label: 'Jackpot',  color: '#ef4444' },
    { id: 'diamond', display: '💎', value: 100, label: 'Diamond',  color: '#34d399' },
    { id: 'crown',   display: '👑', value: 50,  label: 'Crown',    color: '#fbbf24' },
    { id: 'cherry',  display: '🍒', value: 25,  label: 'Cherry',   color: '#f43f5e' },
    { id: 'bar',     display: 'BAR', value: 15, label: 'Bar',      color: '#4b5563' },
    { id: 'lemon',   display: '🍋', value: 10,  label: 'Lemon',    color: '#eab308' },
];

const REEL_COUNT = 3;

const SlotsGame: React.FC = () => {
    const navigate = useNavigate();
    const { balance, withdraw, deposit } = useBalance();

    const [reels, setReels] = useState<SlotSymbol[][]>(
        Array(REEL_COUNT).fill(null).map(() => [SYMBOLS[0], SYMBOLS[1], SYMBOLS[2]])
    );
    const [spinningReels, setSpinningReels] = useState<boolean[]>([false, false, false]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [bet, setBet] = useState(100);
    const [message, setMessage] = useState('Good luck!');
    const [winAmount, setWinAmount] = useState(0);
    const [winningLine, setWinningLine] = useState<number | null>(null);

    const spin = async () => {
        if (balance < bet) { 
            setMessage('Insufficient balance!'); 
            return; 
        }
        setIsSpinning(true);
        setSpinningReels([true, true, true]);
        withdraw(bet);
        setMessage('Spinning…');
        setWinAmount(0);
        setWinningLine(null);

        const newResults = generateResults(SYMBOLS, REEL_COUNT);

        await Array.from({ length: REEL_COUNT }).reduce(async (promise, _, i) => {
            await promise;
            await new Promise(res => setTimeout(res, 1500 + i * 400));
            setSpinningReels(prev => Object.assign([...prev], { [i]: false }));
            setReels(prev => Object.assign([...prev], { [i]: newResults[i] }));
        }, Promise.resolve());

        setIsSpinning(false);
        checkWin(newResults);
    };

    const checkWin = (results: SlotSymbol[][]) => {
        const outcome = evaluateSpin(results, bet);

        if (outcome.totalWin > 0) {
            deposit(outcome.totalWin);
            setWinAmount(outcome.totalWin);
            setWinningLine(outcome.wonLine);
            setMessage(`Winner! +$${outcome.totalWin.toLocaleString()}`);
            confetti({ particleCount: 220, spread: 100, origin: { y: 0.5 }, colors: ['#fbbf24', '#ffffff', '#ef4444'] });
        } else if (outcome.isNearMiss) {
            deposit(outcome.payout);
            setWinAmount(outcome.payout);
            setMessage(`Near miss! +$${outcome.payout}`);
        } else {
            setMessage('Better luck next time');
        }
    };

    const BET_OPTIONS = [50, 100, 200, 500];

    return (
        <div className="flex flex-col gap-6">
            {/* Header info */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/')}
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
                    >
                        <ArrowLeft size={18} weight="bold" />
                    </button>
                    <div>
                        <h2 className="text-xl font-black tracking-tight">Slots</h2>
                        <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mt-1">Classic 3-Reel · Lucky Diamond</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-2">
                        <Lightning size={12} weight="fill" className="text-yellow-500" />
                        <span className="text-[10px] font-black uppercase text-yellow-500/80 tracking-widest">Jackpot Active</span>
                    </div>
                </div>
            </div>

            {/* Machine Area */}
            <div className="relative w-full aspect-[16/9] max-h-[600px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-[40px] border-8 border-gray-700 overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] flex flex-col p-1">
                {/* Machine top light */}
                <div className={cn(
                    "h-2 w-full transition-all duration-300",
                    isSpinning ? "bg-yellow-400 shadow-[0_0_20px_#fbbf24]" : "bg-gray-600"
                )} />

                <div className="flex-1 flex flex-col items-center justify-center p-12 relative">
                    {/* Reel Shadows */}
                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent z-20 pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent z-20 pointer-events-none" />

                    {/* Reels */}
                    <div className="flex gap-4 w-full h-full relative z-10">
                        {reels.map((reel, ri) => (
                            <div
                                key={ri}
                                className="flex-1 bg-zinc-800 rounded-2xl border-4 border-gray-600 overflow-hidden relative shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]"
                            >
                                <motion.div
                                    animate={spinningReels[ri]
                                        ? { y: [-1000, 0] }
                                        : { y: 0 }}
                                    transition={spinningReels[ri]
                                        ? { repeat: Infinity, duration: 0.1, ease: 'linear' }
                                        : { type: 'spring', stiffness: 200, damping: 25 }}
                                    className="flex flex-col items-center"
                                >
                                    {(spinningReels[ri]
                                        ? [...SYMBOLS, ...SYMBOLS, ...SYMBOLS]
                                        : reel
                                    ).map((sym, idx) => (
                                        <div
                                            key={idx}
                                            className="h-[150px] flex flex-col items-center justify-center shrink-0 w-full"
                                        >
                                            <div className="text-7xl mb-2 drop-shadow-md">
                                                {sym.display}
                                            </div>
                                            {!spinningReels[ri] && (
                                                <div className="text-[10px] font-bold uppercase text-gray-400 tracking-[0.2em]">
                                                    {sym.label}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </motion.div>

                                {/* Winning line highlight */}
                                {winningLine !== null && (
                                    <div className="absolute inset-0 bg-yellow-400/10 pointer-events-none border-y-4 border-yellow-400/50 z-30" style={{ top: `${winningLine * 33.33}%`, height: '33.33%' }} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Center Info Overlay */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 text-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={message}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={cn(
                                    "text-2xl font-black uppercase tracking-tight px-6 py-2 rounded-full",
                                    winAmount > 0 ? "bg-yellow-400 text-black shadow-lg" : "bg-black/40 text-white/60"
                                )}
                            >
                                {message}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-[#1e293b] border border-white/5 rounded-3xl p-6 flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-8">
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-black uppercase text-white/30 tracking-widest pl-1">Select Bet</span>
                        <div className="flex gap-2">
                            {BET_OPTIONS.map(val => (
                                <button
                                    key={val}
                                    onClick={() => setBet(val)}
                                    disabled={isSpinning}
                                    className={cn(
                                        "px-6 h-10 rounded-xl font-bold text-xs transition-all border-2",
                                        bet === val ? "bg-accent border-accent text-black" : "bg-white/5 border-white/10 text-white/50 hover:text-white"
                                    )}
                                >
                                    ${val}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="w-px h-10 bg-white/10" />

                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-black uppercase text-white/20 tracking-widest leading-none">Jackpot Potential</span>
                        <span className="text-3xl font-black tracking-tighter text-accent">${bet * 20}</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden lg:block text-right">
                        <div className="text-[10px] font-black uppercase text-white/40 tracking-[0.1em] mb-1">RTP 96.5%</div>
                        <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest font-mono">SECURE PLAY</div>
                    </div>
                    
                    <button
                        onClick={spin}
                        disabled={isSpinning || balance < bet}
                        className={cn(
                            "group h-16 w-48 rounded-2xl font-black text-sm uppercase tracking-widest transition-all relative overflow-hidden",
                            isSpinning ? "bg-slate-800 text-slate-600 scale-95" : "bg-red-600 text-white shadow-[0_4px_20px_rgba(239,68,68,0.4)] hover:scale-105 active:scale-95"
                        )}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            <ArrowsClockwise size={18} weight="bold" className={cn(isSpinning && "animate-spin")} />
                            {isSpinning ? 'SPINNING' : 'SPIN'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SlotsGame;
