import { useEffect, useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { audioSynth } from '../../utils/audioSynth';

export function AudioController() {
    // Global State
    const musicVolume = useUserStore((state) => state.musicVolume);
    const sfxVolume = useUserStore((state) => state.sfxVolume);
    const isMusicMuted = useUserStore((state) => state.isMusicMuted);
    const isSfxMuted = useUserStore((state) => state.isSfxMuted);
    const isIntroVideoCompleted = useUserStore((state) => state.isIntroVideoCompleted);
    const hasInteracted = useUserStore((state) => state.hasInteracted);
    const setHasInteracted = useUserStore((state) => state.setHasInteracted);

    // 1. Initialize Audio Context on first User Interaction
    useEffect(() => {
        if (hasInteracted) {
            audioSynth.init();
            return;
        }

        const handleInteraction = () => {
            if (!hasInteracted) {
                setHasInteracted(true);
                audioSynth.init();

                // Force immediate sync of volumes from store on first init
                const state = useUserStore.getState();
                audioSynth.setMusicVolume(state.isMusicMuted ? 0 : state.musicVolume);
                audioSynth.setSfxVolume(state.isSfxMuted ? 0 : state.sfxVolume);
            }
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('touchstart', handleInteraction);
        window.addEventListener('mousedown', handleInteraction);

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
            window.removeEventListener('mousedown', handleInteraction);
        };
    }, [hasInteracted, setHasInteracted]);

    // 2. Manage Music Playback & Volume
    useEffect(() => {
        // Play/Stop Music based on Mute state and Intro completion
        if (hasInteracted && !isMusicMuted && isIntroVideoCompleted) {
            audioSynth.startMusic();
        } else {
            audioSynth.stopMusic();
        }

        // Always ensure volume is correct (e.g. if slider moves while playing)
        audioSynth.setMusicVolume(isMusicMuted ? 0 : musicVolume);

    }, [isMusicMuted, musicVolume, hasInteracted, isIntroVideoCompleted]);

    // 4. Cleanup on unmount (leaving the map to start the game)
    useEffect(() => {
        return () => {
            audioSynth.stopMusic();
        };
    }, []);

    // 3. Manage SFX Volume (Independent of Playback)
    useEffect(() => {
        audioSynth.setSfxVolume(isSfxMuted ? 0 : sfxVolume);
    }, [sfxVolume, isSfxMuted]);

    // No visible UI anymore - it lives in the Settings Modal now
    return null;
}
