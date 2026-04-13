import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpeakerHigh, SpeakerX, Pause, Play, MusicNotesSimple } from '@phosphor-icons/react';

const JAZZ_TRACK_URL = '/audio/bar-jazz-classics.mp3';

const MusicPlayer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.4);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audio = new Audio(JAZZ_TRACK_URL);
        audio.loop = true;
        audio.volume = volume;
        audioRef.current = audio;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        audio.play().catch(() => {
            const onInteract = () => {
                audio.play().catch(() => {});
                window.removeEventListener('click', onInteract);
            };
            window.addEventListener('click', onInteract);
        });

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.pause();
            audio.src = '';
            audioRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
    }, [volume, isMuted]);

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!audioRef.current) return;
        if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play(); }
    };

    return (
        <div className="fixed bottom-6 left-6 z-[100]">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 rounded-2xl px-4 py-3"
                style={{
                    background: 'rgba(13,15,18,0.92)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                <div className="flex items-end gap-[3px] h-5 w-7">
                    {[0.6, 1, 0.75, 0.9].map((h, i) => (
                        <motion.div
                            key={i}
                            animate={isPlaying ? { scaleY: [0.3, 1, 0.5, 0.8, 0.3] } : { scaleY: 0.3 }}
                            transition={{ repeat: Infinity, duration: 0.6 + i * 0.15, ease: 'easeInOut', delay: i * 0.08 }}
                            className="flex-1 rounded-full origin-bottom"
                            style={{ background: 'var(--accent)', height: '100%', opacity: 0.7 }}
                        />
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-px h-6 bg-white/[0.08]" />
                    <button
                        onClick={togglePlay}
                        className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors text-white/50 hover:text-white"
                    >
                        {isPlaying ? <Pause size={14} weight="fill" /> : <Play size={14} weight="fill" />}
                    </button>
                    <button
                        onClick={e => { e.stopPropagation(); setIsMuted(!isMuted); }}
                        className="transition-colors text-white/40 hover:text-white"
                    >
                        {isMuted ? <SpeakerX size={13} weight="fill" /> : <SpeakerHigh size={13} weight="fill" />}
                    </button>
                    <input
                        type="range" min="0" max="1" step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={e => { setVolume(parseFloat(e.target.value)); if (isMuted) setIsMuted(false); }}
                        className="w-16 h-1 rounded-full cursor-pointer accent-accent"
                        style={{ background: 'rgba(255,255,255,0.08)' }}
                    />
                    <div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-accent/70 leading-none whitespace-nowrap">Midnight Jazz</div>
                        <div className="text-[8px] text-white/25 tracking-widest uppercase mt-0.5 whitespace-nowrap">Lounge Radio</div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MusicPlayer;
