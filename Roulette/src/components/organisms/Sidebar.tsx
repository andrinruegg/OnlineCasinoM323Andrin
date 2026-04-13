import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    House, 
    Wallet, 
    GameController,
    Trophy,
    ClockCounterClockwise
} from '@phosphor-icons/react';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { id: 'lobby', label: 'Lobby', icon: <House size={20} weight="duotone" />, path: '/' },
        { id: 'roulette', label: 'Roulette', icon: <GameController size={20} weight="duotone" />, path: '/roulette' },
        { id: 'blackjack', label: 'Blackjack', icon: <Trophy size={20} weight="fill" />, path: '/blackjack' },
        { id: 'slots', label: 'Slots', icon: <ClockCounterClockwise size={20} weight="duotone" />, path: '/slots' },
    ];

    const secondaryItems = [
        { id: 'wallet', label: 'Vault', icon: <Wallet size={20} weight="duotone" />, path: '/deposit' },
    ];

    return (
        <aside className="w-64 h-full bg-[#0b0e11] border-r border-white/5 flex flex-col z-30">
            <div className="p-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-black font-black">
                    CR
                </div>
                <span className="font-semibold text-base">
                    Casino <span className="text-accent">Ramon</span>
                </span>
            </div>

            <nav className="flex-grow px-4 pb-8 overflow-y-auto custom-scrollbar">
                <div className="text-[11px] font-medium text-white/25 mb-3 pl-1">Games</div>
                <div className="flex flex-col gap-0.5 mb-8">
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => item.path && navigate(item.path)}
                            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>

                <div className="text-[11px] font-medium text-white/25 mb-3 pl-1">Account</div>
                <div className="flex flex-col gap-1">
                    {secondaryItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => item.path && navigate(item.path)}
                            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>
            </nav>


        </aside>
    );
};

export default Sidebar;
