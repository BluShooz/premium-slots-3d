import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Coins, Play, PlusCircle, Trophy } from 'lucide-react';

export const UIOverlay: React.FC = () => {
    const { credits, bet, status, lastWin, spin, setBet, addCredits } = useGameStore();

    return (
        <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-8 font-display">
            {/* Top Bar */}
            <div className="flex justify-between items-start">
                <div className="glass p-4 rounded-2xl flex items-center gap-4 pointer-events-auto">
                    <div className="bg-gold-dark/20 p-2 rounded-lg">
                        <Coins className="text-gold w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-xs text-white/50 uppercase tracking-widest font-bold">Balance</div>
                        <div className="text-3xl font-black text-white">{credits.toLocaleString()}</div>
                    </div>
                </div>

                {lastWin > 0 && (
                    <div className="glass p-4 rounded-2xl flex items-center gap-4 animate-bounce pointer-events-auto">
                        <div className="bg-green-500/20 p-2 rounded-lg">
                            <Trophy className="text-green-500 w-8 h-8" />
                        </div>
                        <div>
                            <div className="text-xs text-green-500/50 uppercase tracking-widest font-bold">Big Win!</div>
                            <div className="text-3xl font-black text-white">+{lastWin.toLocaleString()}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Controls */}
            <div className="flex justify-center items-end gap-8 pb-4">
                <div className="glass p-4 rounded-2xl flex items-center gap-6 pointer-events-auto">
                    <div className="flex flex-col items-center">
                        <div className="text-[10px] text-white/40 uppercase tracking-tighter mb-1">Bet Amount</div>
                        <div className="flex items-center gap-4 bg-black/40 p-2 rounded-xl">
                            <button
                                onClick={() => setBet(Math.max(10, bet - 10))}
                                className="w-10 h-10 rounded-lg hover:bg-white/10 transition-colors text-2xl font-bold flex items-center justify-center"
                            >
                                -
                            </button>
                            <span className="text-2xl font-black min-w-[60px] text-center text-gold">{bet}</span>
                            <button
                                onClick={() => setBet(bet + 10)}
                                className="w-10 h-10 rounded-lg hover:bg-white/10 transition-colors text-2xl font-bold flex items-center justify-center"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={spin}
                        disabled={status !== 'idle' || credits < bet}
                        className={`
              w-24 h-24 rounded-full flex flex-col items-center justify-center gap-1 transition-all
              ${status !== 'idle' ? 'bg-white/5 opacity-50' : 'bg-gold hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(212,175,55,0.4)]'}
            `}
                    >
                        <Play className={`w-10 h-10 ${status !== 'idle' ? 'text-white/20' : 'text-black fill-black'}`} />
                        <span className={`text-[10px] font-black uppercase ${status !== 'idle' ? 'text-white/20' : 'text-black'}`}>
                            {status === 'spinning' ? 'Luck...' : 'Spin'}
                        </span>
                    </button>

                    <button
                        onClick={() => addCredits(1000)}
                        className="flex flex-col items-center pointer-events-auto group"
                    >
                        <PlusCircle className="text-white/20 group-hover:text-gold transition-colors" />
                        <span className="text-[8px] text-white/20 uppercase mt-1">Refill</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
