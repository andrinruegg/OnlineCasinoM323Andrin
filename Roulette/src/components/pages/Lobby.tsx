import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
} from '@phosphor-icons/react';

const Lobby: React.FC = () => {
    const navigate = useNavigate();

    const games = [
        {
            id: 'roulette',
            title: 'Roulette',
            description: 'European single-zero roulette.',
            path: '/roulette',
            image: '/images/roulette.png',
        },
        {
            id: 'blackjack',
            title: 'Blackjack',
            description: 'Classic card game. Beat the dealer to 21.',
            path: '/blackjack',
            image: '/images/blackjack.png',
        },
        {
            id: 'slots',
            title: 'Slots',
            description: '3-reel slots with classic symbols.',
            path: '/slots',
            image: '/images/slots.png',
        }
    ];

    return (
        <div className="flex flex-col gap-10 pb-20">
            <section>
                <h2 className="text-sm font-semibold text-white/30">Games</h2>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {games.map((game, i) => (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.1 }}
                            onClick={() => navigate(game.path)}
                            className="dashboard-card relative group cursor-pointer overflow-hidden min-h-[320px] flex flex-col justify-end p-8"
                        >
                            <div className={`absolute inset-0 transition-transform duration-700 group-hover:scale-110 opacity-40 group-hover:opacity-60`}>
                                <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e11] via-[#0b0e11]/60 to-transparent" />
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-semibold mb-1.5 group-hover:text-accent transition-colors">{game.title}</h3>
                                <p className="text-sm text-white/35 leading-relaxed max-w-[200px]">
                                    {game.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Lobby;
