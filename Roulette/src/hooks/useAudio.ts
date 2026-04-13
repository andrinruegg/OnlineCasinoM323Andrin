import { useRef, useCallback } from 'react';

const SOUNDS = {
    chip: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
    spin: 'https://assets.mixkit.co/active_storage/sfx/2014/2014-preview.mp3',
    win: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
    lose: 'https://assets.mixkit.co/active_storage/sfx/2180/2180-preview.mp3',
    ball: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3',
    music: '/audio/bar-jazz-classics.mp3',
};

export const useAudio = () => {
    const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

    const play = useCallback((soundName: keyof typeof SOUNDS, volume: number = 0.5, loop: boolean = false) => {
        if (soundName !== 'music') return;

        if (!audioRefs.current[soundName]) {
            audioRefs.current[soundName] = new Audio(SOUNDS[soundName]);
        }

        const audio = audioRefs.current[soundName];
        audio.volume = volume;
        audio.loop = loop;

        if (soundName === 'music' && !audio.paused) return;

        audio.currentTime = 0;
        audio.play().catch(e => console.warn('Audio play failed:', e));
    }, []);

    const stop = useCallback((soundName: keyof typeof SOUNDS) => {
        const audio = audioRefs.current[soundName];
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }, []);

    const setVolume = useCallback((soundName: keyof typeof SOUNDS, volume: number) => {
        const audio = audioRefs.current[soundName];
        if (audio) {
            audio.volume = volume;
        }
    }, []);

    return { play, stop, setVolume };
};
