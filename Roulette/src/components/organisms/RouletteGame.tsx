import React, { useState, useEffect } from 'react';
import { RouletteWheel } from '../molecules/RouletteWheel';
import { BettingTable } from './BettingTable';
import { GameControls } from './GameControls';
import { useRoulette } from '../../hooks/useRoulette';
import { useAudio } from '../../hooks/useAudio';
import { BetType, RED_NUMBERS } from '../../types/roulette';
import confetti from 'canvas-confetti';
import { ClockCounterClockwise, SpeakerHigh, SpeakerX, ArrowLeft, TrendUp, TrendDown, Plus } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBalance } from '../../context/BalanceContext';
import { cn } from '../../lib/utils';

const RouletteGame: React.FC = () => {
    const navigate = useNavigate();
    const { balance, withdraw, deposit } = useBalance();
    const { state, placeBet, undoBet, clearBets, repeatLastBets, refillBalance, spin, resolveSpin, getStats } = useRoulette(balance, withdraw, deposit);
    const { play, stop } = useAudio();
    const [selectedChip, setSelectedChip] = useState(100);
    const [winningNumber, setWinningNumber] = useState<number | null>(null);
    const [winMessage, setWinMessage] = useState<{ amount: number } | null>(null);
    const [muted, setMuted] = useState(false);
    const stats = getStats();

    const handlePlaceBet = (type: BetType, value: number | string) => {
        if (!muted) play('chip', 0.4);
        placeBet({ type, value, amount: selectedChip });
    };

    const handleSpin = () => {
        const result = spin();
        if (result !== undefined) {
            if (!muted) play('spin', 0.6);
            setWinningNumber(result);
            setWinMessage(null);
        }
    };

    const onAnimationComplete = () => {
        if (winningNumber !== null) {
            if (!muted) { stop('spin'); play('ball', 0.8); }
            const winAmount = resolveSpin(winningNumber);
            if (winAmount > 0) {
                if (!muted) setTimeout(() => play('win', 0.7), 200);
                setWinMessage({ amount: winAmount });
                confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 }, colors: ['#ffab0a', '#ffffff', '#e68a00', '#ffd700'] });
            } else {
                if (!muted) setTimeout(() => play('lose', 0.3), 200);
            }
        }
    };

    useEffect(() => {
        if (winMessage) {
            const t = setTimeout(() => setWinMessage(null), 5000);
            return () => clearTimeout(t);
        }
    }, [winMessage]);

    return (
        <div className="min-h-screen text-white overflow-x-hidden">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0" style={{
                backgroundImage: `radial-gradient(ellipse 70% 50% at 30% 20%, rgba(6, 95, 70, 0.2) 0%, transparent 60%), linear-gradient(180deg, #064e3b 0%, #065f46 100%)`,
            }} />

            {/* Game Info Bar */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/')}
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
                    >
                        <ArrowLeft size={18} weight="bold" />
                    </button>
                    <div>
                        <h2 className="text-xl font-black tracking-tight">Casino Ramon</h2>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* History */}
                    <div className="hidden sm:flex items-center gap-1.5">
                        {state.winningHistory.length === 0
                            ? <span className="text-[10px] text-white/20 italic">No results yet</span>
                            : state.winningHistory.slice(0, 8).map((num, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className={cn(
                                        'w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black border transition-all',
                                        num === 0 ? 'bg-accent/20 border-accent/30 text-accent'
                                            : RED_NUMBERS.includes(num) ? 'bg-white/5 border-white/10 text-white'
                                                : 'bg-white/5 border-white/10 text-white/40'
                                    )}
                                >
                                    {num}
                                </motion.div>
                            ))}
                    </div>
                    <button
                        onClick={() => setMuted(!muted)}
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
                    >
                        {muted ? <SpeakerX size={18} weight="fill" /> : <SpeakerHigh size={18} weight="fill" />}
                    </button>
                </div>
            </div>

            {/* ===== MAIN ===== */}
            <main className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-16 items-start px-4 md:px-8 py-10 relative z-10">
                {/* LEFT: Wheel */}
                <div className="relative flex flex-col items-center justify-center xl:sticky xl:top-24">
                    <AnimatePresence>
                        {winMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: 60, scale: 0.7 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="absolute top-0 z-50 flex flex-col items-center pointer-events-none"
                            >
                                <div
                                    className="px-14 py-8 rounded-2xl flex flex-col items-center"
                                    style={{
                                        background: 'var(--accent)',
                                        boxShadow: '0 0 80px rgba(29, 185, 84, 0.4), 0 20px 60px rgba(0,0,0,0.6)',
                                    }}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40 mb-1">Winner!</span>
                                    <span className="text-6xl font-black text-black leading-none">${winMessage.amount.toLocaleString()}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <RouletteWheel
                        isSpinning={state.isSpinning}
                        winningNumber={winningNumber}
                        onAnimationComplete={onAnimationComplete}
                    />

                    {/* Status bar */}
                    <motion.div
                        animate={state.isSpinning ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="mt-10 px-8 py-3 rounded-xl flex items-center gap-3 text-xs font-bold bg-[#1e293b] border border-white/5 shadow-2xl"
                        style={{
                            color: state.isSpinning ? 'var(--accent)' : 'rgba(255,255,255,0.6)',
                        }}
                    >
                        <ClockCounterClockwise size={14} weight="duotone" className={state.isSpinning ? 'text-accent animate-spin' : 'text-slate-300'} />
                        <span className="uppercase tracking-widest">{state.isSpinning ? 'The wheel is spinning...' : 'Select a chip and place your bets'}</span>
                    </motion.div>

                </div>

                {/* RIGHT: Betting area */}
                <div className="flex flex-col gap-6 pb-16">
                    <BettingTable onPlaceBet={handlePlaceBet} activeBets={state.activeBets} />
                    <GameControls
                        onSpin={handleSpin}
                        onClear={clearBets}
                        onUndo={() => { if (!muted) play('chip', 0.2); undoBet(); }}
                        onRepeat={() => { if (!muted) play('chip', 0.2); repeatLastBets(); }}
                        onRefill={() => navigate('/deposit')}
                        canSpin={state.activeBets.length > 0 && !state.isSpinning}
                        canUndo={state.activeBets.length > 0 && !state.isSpinning}
                        canRepeat={state.activeBets.length === 0 && state.lastBets.length > 0 && !state.isSpinning}
                        canRefill={balance < 100}
                        selectedChip={selectedChip}
                        setSelectedChip={(chip) => { if (!muted) play('chip', 0.2); setSelectedChip(chip); }}
                        balance={balance}
                    />
                </div>
            </main>
        </div>
    );
};

export default RouletteGame;
