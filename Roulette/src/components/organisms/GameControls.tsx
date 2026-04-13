import React from 'react';
import { Coins, ArrowsClockwise, Trash, ArrowUUpLeft, Repeat, PlusCircle } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GameControlsProps {
    onSpin: () => void;
    onClear: () => void;
    onUndo: () => void;
    onRepeat: () => void;
    onRefill: () => void;
    canSpin: boolean;
    canUndo: boolean;
    canRepeat: boolean;
    canRefill: boolean;
    selectedChip: number;
    setSelectedChip: (amount: number) => void;
    balance: number;
}

const CHIPS = [
    { value: 10, color: '#ffffff', rim: '#e2e8f0', label: '10' },
    { value: 50, color: '#34d399', rim: '#059669', label: '50' },
    { value: 100, color: '#1db954', rim: '#15803d', label: '100' },
    { value: 500, color: '#0ea5e9', rim: '#0284c7', label: '500' },
    { value: 1000, color: '#8b5cf6', rim: '#6d28d9', label: '1K' },
];

export const GameControls: React.FC<GameControlsProps> = ({
    onSpin, onClear, onUndo, onRepeat, onRefill,
    canSpin, canUndo, canRepeat, canRefill,
    selectedChip, setSelectedChip, balance,
}) => {
    return (
        <div
            className="w-full rounded-2xl p-6 flex flex-col gap-6 bg-[#1e293b] border border-white/5 shadow-2xl"
        >
            <div>
                <div className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 mb-4">Select Chip Value</div>
                <div className="flex gap-3 flex-wrap">
                    {CHIPS.map(chip => {
                        const isSelected = selectedChip === chip.value;
                        const isDisabled = balance < chip.value;
                        return (
                            <button
                                key={chip.value}
                                onClick={() => !isDisabled && setSelectedChip(chip.value)}
                                disabled={isDisabled}
                                title={isDisabled ? 'Insufficient balance' : `Select $${chip.value} chip`}
                                className={cn('relative w-14 h-14 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200', isDisabled && 'opacity-25 cursor-not-allowed')}
                                style={{
                                    background: `linear-gradient(145deg, ${chip.color}, ${chip.rim})`,
                                    boxShadow: isSelected
                                        ? `0 0 0 3px rgba(255,255,255,0.2), 0 0 30px ${chip.color}80, 0 6px 20px rgba(0,0,0,0.5)`
                                        : `0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)`,
                                    transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                                    border: `3px solid ${chip.rim}`,
                                }}
                            >
                                <div className="absolute inset-[4px] rounded-full border border-white/[0.1]" />
                                <span className={cn("relative z-10 font-bold text-[11px] drop-shadow-sm", chip.value === 10 ? "text-slate-900" : "text-white")}>{chip.label}</span>
                                {isSelected && (
                                    <motion.div
                                        layoutId="chip-selector"
                                        className="absolute inset-[-4px] rounded-full border-2 border-white/40"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="casino-divider" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    {[
                        { action: onUndo, disabled: !canUndo, icon: <ArrowUUpLeft size={16} weight="bold" />, title: 'Undo' },
                        { action: onRepeat, disabled: !canRepeat, icon: <Repeat size={16} weight="bold" />, title: 'Repeat' },
                        { action: onClear, disabled: !canSpin, icon: <Trash size={16} weight="fill" />, title: 'Clear' },
                    ].map(({ action, disabled, icon, title }) => (
                        <button
                            key={title}
                            onClick={action}
                            disabled={disabled}
                            title={title}
                            className="group h-11 px-4 flex items-center justify-center gap-2 rounded-xl transition-all border border-white/10 bg-white/5 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed hover:bg-white/10 text-white"
                        >
                            {icon}
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">{title}</span>
                        </button>
                    ))}
                </div>

                <button
                    onClick={onSpin}
                    disabled={!canSpin}
                    className={cn(
                        'relative overflow-hidden h-12 px-14 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-3',
                        canSpin
                            ? 'bg-accent text-black shadow-[0_0_20px_rgba(29,185,84,0.3)]'
                            : 'cursor-not-allowed bg-slate-800/50 text-slate-600'
                    )}
                >
                    <ArrowsClockwise size={18} weight="bold" className={cn(canSpin && 'animate-spin-slow')} />
                    Spin
                </button>
            </div>
        </div>
    );
};
