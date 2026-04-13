import React from 'react';
import { motion } from 'framer-motion';

interface ChipProps {
    amount: number;
}

export const Chip: React.FC<ChipProps> = ({ amount }) => (
    <motion.div
        initial={{ scale: 0, scaleY: 0.1, opacity: 0 }}
        animate={{ scale: 1, scaleY: 1, opacity: 1 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
    >
        <div className="w-10 h-10 rounded-full bg-[#1b1e23] border-[2px] border-accent/40 shadow-[0_0_15px_rgba(29,185,84,0.3)] flex items-center justify-center">
            <div className="w-7 h-7 rounded-full border border-accent/10 flex items-center justify-center font-black text-[9px] text-accent tracking-tighter">
                {amount >= 1000 ? `${(amount / 1000).toFixed(1)}k` : amount}
            </div>
            {/* Chip Serrations */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-accent/10" />
        </div>
    </motion.div>
);
