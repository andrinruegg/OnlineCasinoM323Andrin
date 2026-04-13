import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lobby from './components/pages/Lobby';
import RouletteGame from './components/organisms/RouletteGame';
import BlackjackGame from './components/organisms/BlackjackGame';
import SlotsGame from './components/organisms/SlotsGame';
import MusicPlayer from './components/molecules/MusicPlayer';
import Deposit from './components/pages/Deposit';
import AppLayout from './components/templates/AppLayout';
import { ThemeProvider } from './context/ThemeContext';
import { BalanceProvider } from './context/BalanceContext';

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <BalanceProvider>
                <BrowserRouter>
                    <MusicPlayer />
                    <AppLayout>
                        <Routes>
                            <Route path="/" element={<Lobby />} />
                            <Route path="/roulette" element={<RouletteGame />} />
                            <Route path="/blackjack" element={<BlackjackGame />} />
                            <Route path="/slots" element={<SlotsGame />} />
                            <Route path="/deposit" element={<Deposit />} />
                        </Routes>
                    </AppLayout>
                </BrowserRouter>
            </BalanceProvider>
        </ThemeProvider>
    );
};

export default App;
