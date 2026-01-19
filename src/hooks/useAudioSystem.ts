import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import type { GameStatus } from '../store/useGameStore';

// We'll use the Web Audio API to synthesize sounds since we don't have external assets
class AudioManager {
    private ctx: AudioContext | null = null;
    private motorNode: OscillatorNode | null = null;
    private motorGain: GainNode | null = null;
    private idleHum: OscillatorNode | null = null;

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.startIdleHum();
        }
    }

    private startIdleHum() {
        if (!this.ctx) return;
        this.idleHum = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        this.idleHum.type = 'sine';
        this.idleHum.frequency.setValueAtTime(50, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.005, this.ctx.currentTime);
        this.idleHum.connect(gain);
        gain.connect(this.ctx.destination);
        this.idleHum.start();
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

    public playSpin() {
        if (!this.ctx) return;
        // Motor start sound
        this.motorNode = this.ctx.createOscillator();
        this.motorGain = this.ctx.createGain();
        this.motorNode.type = 'sawtooth';
        this.motorNode.frequency.setValueAtTime(60, this.ctx.currentTime);
        this.motorNode.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.3);

        this.motorGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.motorGain.gain.linearRampToValueAtTime(0.02, this.ctx.currentTime + 0.1);

        this.motorNode.connect(this.motorGain);
        this.motorGain.connect(this.ctx.destination);
        this.motorNode.start();
    }

    public stopMotor() {
        if (this.motorGain && this.ctx) {
            this.motorGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
            setTimeout(() => {
                this.motorNode?.stop();
                this.motorNode = null;
            }, 200);
        }
    }

    public playStop() {
        // Mechanical Thunk
        this.playTone(80, 'square', 0.1, 0.05); // Low impact
        this.playTone(40, 'sine', 0.15, 0.08); // Sub impact
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
            soundManager.playSpin();
        }
        if (status === 'idle') {
            soundManager.stopMotor();
        }
        if (status === 'won') {
            soundManager.playWin();
            soundManager.stopMotor();
        }
    }, [status]);
};
