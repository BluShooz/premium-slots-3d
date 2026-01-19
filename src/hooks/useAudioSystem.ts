import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import type { GameStatus } from '../store/useGameStore';

// We'll use the Web Audio API to synthesize sounds since we don't have external assets
class AudioManager {
    private ctx: AudioContext | null = null;

    init() {
        if (!this.ctx) this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playSpin() {
        this.playTone(150, 'sawtooth', 0.1, 0.05);
    }

    playStop() {
        this.playTone(100, 'square', 0.2, 0.1);
    }

    playWin() {
        [440, 554.37, 659.25].forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'triangle', 0.5, 0.1), i * 100);
        });
    }
}

export const soundManager = new AudioManager();

export const useAudioSystem = () => {
    const status = useGameStore((state: { status: GameStatus }) => state.status);

    useEffect(() => {
        soundManager.init();
        if (status === 'spinning') {
            const interval = setInterval(() => soundManager.playSpin(), 100);
            return () => clearInterval(interval);
        }
        if (status === 'stopping') {
            soundManager.playStop();
        }
        if (status === 'won') {
            soundManager.playWin();
        }
    }, [status]);
};
