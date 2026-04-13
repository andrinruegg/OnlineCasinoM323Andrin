import React from 'react';
import { Bet, BetType, RED_NUMBERS } from '../../types/roulette';
import { motion } from 'framer-motion';
import { Chip } from '../atoms/Chip';
import { cn } from '../../lib/utils';

interface BettingTableProps {
    onPlaceBet: (type: BetType, value: number | string) => void;
    activeBets: readonly Bet[];
}

export const BettingTable: React.FC<BettingTableProps> = ({ onPlaceBet, activeBets }) => {
    const getBetAmount = (type: BetType, value: number | string) =>
        activeBets.filter(b => b.type === type && (b as any).value === value).reduce((sum, b) => sum + b.amount, 0);

    const NumberCell = ({ num }: { num: number }) => {
        const isRed = RED_NUMBERS.includes(num);
        const amount = getBetAmount('straight', num);
        
        return (
            <motion.button
                whileHover={{ scale: 1.05, zIndex: 10, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPlaceBet('straight', num)}
                className={cn(
                    'relative h-16 w-full flex items-center justify-center font-bold text-xl transition-all duration-200 border border-white/20',
                    num === 0 ? 'bg-green-700 text-white rounded-l-xl' : isRed ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'
                )}
            >
                <span className="relative z-10">{num}</span>
                {amount > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Chip amount={amount} />
                    </div>
                )}
            </motion.button>
        );
    };

    const gridNumbers: number[][] = Array.from({ length: 12 }, (_, col) => [
        3 * col + 3,
        3 * col + 2,
        3 * col + 1
    ]);

    return (
        <div className="w-full mx-auto select-none">
            <div className="flex bg-[#065f46] rounded-xl overflow-hidden border-4 border-[#3d2b1f] shadow-2xl">
                <div className="w-20">
                    <NumberCell num={0} />
                </div>

                <div className="flex-1 grid grid-cols-12">
                    {gridNumbers.map((col, i) => (
                        <div key={i} className="flex flex-col">
                            {col.map(num => <NumberCell key={num} num={num} />)}
                        </div>
                    ))}
                </div>

                <div className="w-16 grid grid-rows-3 bg-green-800 border-l border-white/20">
                    <ColumnBet label="2:1" onClick={() => onPlaceBet('col3', 'col3')} amount={getBetAmount('col3', 'col3')} />
                    <ColumnBet label="2:1" onClick={() => onPlaceBet('col2', 'col2')} amount={getBetAmount('col2', 'col2')} />
                    <ColumnBet label="2:1" onClick={() => onPlaceBet('col1', 'col1')} amount={getBetAmount('col1', 'col1')} />
                </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                    { label: '1st 12', type: '1st12' as BetType, value: '1-12' },
                    { label: '2nd 12', type: '2nd12' as BetType, value: '13-24' },
                    { label: '3rd 12', type: '3rd12' as BetType, value: '25-36' },
                ].map(b => (
                    <OutsideBet key={b.label} label={b.label} onClick={() => onPlaceBet(b.type, b.value)} amount={getBetAmount(b.type, b.value)} />
                ))}
            </div>
            
            <div className="mt-3 grid grid-cols-6 gap-3">
                <OutsideBet label="1-18" onClick={() => onPlaceBet('1-18', 'low')} amount={getBetAmount('1-18', 'low')} />
                <OutsideBet label="Even" onClick={() => onPlaceBet('even', 'even')} amount={getBetAmount('even', 'even')} />
                <OutsideBet
                    label="Red"
                    onClick={() => onPlaceBet('red', 'red')}
                    amount={getBetAmount('red', 'red')}
                    accent="bg-red-600"
                />
                <OutsideBet
                    label="Black"
                    onClick={() => onPlaceBet('black', 'black')}
                    amount={getBetAmount('black', 'black')}
                    accent="bg-gray-900"
                />
                <OutsideBet label="Odd" onClick={() => onPlaceBet('odd', 'odd')} amount={getBetAmount('odd', 'odd')} />
                <OutsideBet label="19-36" onClick={() => onPlaceBet('19-36', 'high')} amount={getBetAmount('19-36', 'high')} />
            </div>
        </div>
    );
};

const OutsideBet = ({ label, onClick, amount, accent }: { label: React.ReactNode; onClick: () => void; amount: number; accent?: string }) => (
    <motion.button
        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={cn(
            "relative h-14 flex items-center justify-center rounded-xl transition-all duration-300 border border-white/20 font-bold uppercase tracking-widest text-[11px]",
            accent || "bg-green-800",
            amount > 0 && "ring-4 ring-yellow-400/50"
        )}
    >
        <span className="z-10 text-white">{label}</span>
        {amount > 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none scale-75 opacity-60">
                <Chip amount={amount} />
            </div>
        )}
    </motion.button>
);

const ColumnBet = ({ label, onClick, amount }: { label: string; onClick: () => void; amount: number }) => (
    <motion.button
        whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={cn(
            "relative flex items-center justify-center border-b border-white/20 last:border-b-0 transition-all",
            amount > 0 ? "bg-green-700" : "bg-transparent"
        )}
    >
        <div className="transform -rotate-90 text-[10px] font-bold text-white/80">{label}</div>
        {amount > 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none scale-50 opacity-40">
                <Chip amount={amount} />
            </div>
        )}
    </motion.button>
);
