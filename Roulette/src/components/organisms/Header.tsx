import React from 'react';
import { useBalance } from '../../context/BalanceContext';
import { User, Plus } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const { balance } = useBalance();
    const navigate = useNavigate();

    return (
        <header className="h-14 border-b border-white/5 px-6 flex items-center justify-between bg-[#0d0f12] sticky top-0 z-30">
            <div className="flex-1" />

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="balance-chip flex items-center gap-3 bg-[#1b1e23] border-white/5">
                        <span className="text-sm font-medium">${balance.toLocaleString()}</span>
                        <button 
                            onClick={() => navigate('/deposit')}
                            className="w-6 h-6 rounded-lg bg-accent flex items-center justify-center text-black hover:scale-105 transition-transform"
                        >
                            <Plus size={14} weight="bold" />
                        </button>
                    </div>
                </div>


            </div>
        </header>
    );
};

export default Header;
