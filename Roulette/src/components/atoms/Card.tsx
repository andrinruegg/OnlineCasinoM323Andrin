import React from 'react';
import { motion } from 'framer-motion';

export type Suit = '♠' | '♣' | '♥' | '♦';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
    suit: Suit;
    rank: Rank;
    value: number;
    isHidden?: boolean;
}

interface CardViewProps {
    card: Card;
    index: number;
}

export const CardView: React.FC<CardViewProps> = ({ card, index }) => {
    const isRed = card.suit === '♥' || card.suit === '♦';

    return (
        <motion.div
            initial={{ y: -100, x: 100, opacity: 0, rotate: 20 }}
            animate={{ y: 0, x: 0, opacity: 1, rotate: 0 }}
            transition={{ delay: index * 0.15, type: 'spring', stiffness: 100 }}
            className={`relative w-24 h-36 md:w-32 md:h-48 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-between p-3 md:p-4 border backdrop-blur-sm transition-all duration-500 ${card.isHidden
                ? 'bg-[#1b1e23] border-accent/20'
                : 'bg-white border-white/40'
                }`}
        >
            {/* Holographic Edge */}
            {!card.isHidden && <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 rounded-xl pointer-events-none" />}
            {card.isHidden ? (
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg">
                    <div className="w-full h-full bg-[#1b1e23] flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full border-2 border-accent border-dashed animate-spin-slow opacity-20" />
                        <div className="absolute text-accent font-black text-2xl">?</div>
                    </div>
                </div>
            ) : (
                <>
                    <div className={`flex flex-col items-start ${isRed ? 'text-rose-600' : 'text-zinc-900'}`}>
                        <span className="text-xl md:text-2xl font-black leading-none">{card.rank}</span>
                        <span className="text-lg md:text-xl">{card.suit}</span>
                    </div>
                    <div className={`flex justify-center items-center ${isRed ? 'text-rose-600' : 'text-zinc-900'}`}>
                        <span className="text-4xl md:text-5xl opacity-20">{card.suit}</span>
                    </div>
                    <div className={`flex flex-col items-end rotate-180 ${isRed ? 'text-rose-600' : 'text-zinc-900'}`}>
                        <span className="text-xl md:text-2xl font-black leading-none">{card.rank}</span>
                        <span className="text-lg md:text-xl">{card.suit}</span>
                    </div>
                </>
            )}
        </motion.div>
    );
};
