import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBalance } from '../../context/BalanceContext';
import { CaretLeft } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';

const Deposit: React.FC = () => {
    const navigate = useNavigate();
    const { balance, deposit } = useBalance();
    const [amount, setAmount] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedQuickAmount, setSelectedQuickAmount] = useState<number | null>(null);

    const quickAmounts = [100, 500, 1000, 5000, 10000];

    const handleDeposit = (e: React.FormEvent) => {
        e.preventDefault();
        const depositAmount = parseInt(amount, 10);
        if (!isNaN(depositAmount) && depositAmount > 0) {
            deposit(depositAmount);
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                setAmount('');
                setSelectedQuickAmount(null);
            }, 3000);
        }
    };

    const handleQuickSelect = (val: number) => {
        setSelectedQuickAmount(val);
        setAmount(val.toString());
    };

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto py-4">
            {/* Header info */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/')}
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
                    >
                        <CaretLeft size={18} weight="bold" />
                    </button>
                    <div>
                        <h2 className="text-xl font-black tracking-tight">Vault · Deposit</h2>
                        <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mt-1">Instant Bank & Crypto Transfers</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-accent/80 tracking-widest">Encypted</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Form Section */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <AnimatePresence mode="wait">
                        {isSuccess ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-accent/5 border border-accent/20 rounded-[32px] p-12 text-center"
                            >
                                <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                                </div>
                                <h2 className="text-3xl font-black mb-2">Transfer Complete</h2>
                                <p className="text-white/40 text-sm mb-8">Your credits have been added to your vault successfully.</p>
                                <div className="inline-block px-8 py-4 bg-accent text-black rounded-2xl font-black text-2xl shadow-[0_0_30px_rgba(29,185,84,0.3)]">
                                    +${parseInt(amount, 10).toLocaleString()}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-[#1b1e23] border border-white/5 rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[80px] pointer-events-none rounded-full -translate-y-1/2 translate-x-1/2" />
                                
                                <div className="relative z-10">
                                    {/* Quick Select */}
                                    <div className="mb-10">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Select Bundle</h3>
                                        </div>
                                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                            {quickAmounts.map((val) => (
                                                <button
                                                    key={val}
                                                    onClick={() => handleQuickSelect(val)}
                                                    className={cn(
                                                        "py-4 rounded-2xl border-2 font-black transition-all text-xs",
                                                        selectedQuickAmount === val
                                                            ? 'border-accent bg-accent/10 text-accent shadow-[0_0_20px_rgba(29,185,84,0.15)]'
                                                            : 'border-white/5 bg-white/5 text-white/40 hover:text-white/60 hover:border-white/10'
                                                    )}
                                                >
                                                    ${val >= 1000 ? `${val / 1000}k` : val}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Custom Amount */}
                                    <form onSubmit={handleDeposit}>
                                        <div className="mb-10">
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4 pl-1">Custom Amount</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-accent font-black text-2xl">$</div>
                                                <input
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) => {
                                                        setAmount(e.target.value);
                                                        setSelectedQuickAmount(null);
                                                    }}
                                                    placeholder="0.00"
                                                    className="w-full h-20 bg-white/5 border-2 border-transparent rounded-[24px] pl-14 pr-8 text-3xl font-black focus:outline-none focus:border-accent/40 focus:bg-white/10 transition-all placeholder:text-white/5"
                                                />
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            type="submit"
                                            disabled={!amount || parseInt(amount, 10) <= 0}
                                            className="w-full h-16 bg-accent text-black rounded-2xl flex items-center justify-center gap-4 font-black uppercase tracking-widest disabled:opacity-20 transition-all shadow-[0_4px_30px_rgba(29,185,84,0.3)] hover:scale-[1.02] active:scale-95"
                                        >
                                            Confirm Transfer
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar Info Section */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="bg-[#1b1e23] border border-white/5 rounded-[24px] p-6 flex flex-col gap-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 border-b border-white/5 pb-4">Payment Methods</h4>
                        
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-transparent hover:border-accent/20 transition-all group cursor-pointer">
                                <div>
                                    <div className="text-sm font-black">Crypto</div>
                                    <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest">BTC, ETH, LTC</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-transparent hover:border-accent/20 transition-all group cursor-pointer">
                                <div>
                                    <div className="text-sm font-black">Credit Card</div>
                                    <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Visa, Mastercard</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-transparent hover:border-accent/20 transition-all group cursor-pointer">
                                <div>
                                    <div className="text-sm font-black">Bank Transfer</div>
                                    <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Instant SEPA</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-accent/5 border border-accent/20 rounded-[24px] p-6 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase text-accent tracking-[0.2em]">New Bonus</span>
                        </div>
                        <p className="text-xs font-bold text-white/60 leading-relaxed">
                            Deposit more than <span className="text-accent">$10,000</span> today and receive a <span className="text-accent">+20%</span> credit bonus instantly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Deposit;
