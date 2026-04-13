import React from 'react';
import Sidebar from '../organisms/Sidebar';
import Header from '../organisms/Header';

interface AppLayoutProps {
    children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#0b0e11] text-white font-sans">
            <Sidebar />

            <div className="flex flex-col flex-1 h-full overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    {children}
                </main>
            </div>
            
        </div>
    );
};

export default AppLayout;
