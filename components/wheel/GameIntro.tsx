'use client';

import type { Game } from '@/lib/types';
import Button from '@/components/ui/Button';

interface GameIntroProps {
  game: Game;
  onContinue: () => void;
  onBack: () => void;
}

export default function GameIntro({ game, onContinue, onBack }: GameIntroProps) {
  const playersLabel = game.playersPerTeam === 0
    ? 'Alle'
    : `${game.playersPerTeam} per lag`;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div className="relative text-center max-w-md">
        <div className="animate-bounce mb-4">
          <span className="text-6xl">🎮</span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          {game.name}
        </h2>
        <div className="glass rounded-xl p-4 mb-6">
          <p className="text-white/70 font-body leading-relaxed">{game.rules}</p>
          <div className="mt-3 flex justify-center gap-4 text-sm text-white/40">
            <span>⏱ {game.time} min</span>
            <span>👥 {playersLabel}</span>
            <span>⭐ {game.points} poeng</span>
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-full font-body text-sm text-white/60 hover:text-white bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
          >
            Tilbake
          </button>
          <Button variant="primary" size="lg" onClick={onContinue}>
            {game.playersPerTeam === 0 ? 'Start Kamp!' : 'Velg Spillere'}
          </Button>
        </div>
      </div>
    </div>
  );
}
