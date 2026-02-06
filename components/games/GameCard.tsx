'use client';

import type { Game } from '@/lib/types';

export default function GameCard({ game }: { game: Game }) {
  return (
    <div className="glass rounded-xl p-5 hover:bg-white/5 transition-all duration-300">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-display text-lg text-white">{game.name}</h3>
        <span className="text-xs text-white/30 bg-white/5 rounded-full px-2 py-0.5">
          {game.time} min
        </span>
      </div>
      <p className="text-sm text-white/50 font-body leading-relaxed">{game.rules}</p>
      <div className="mt-3 flex items-center gap-2 text-xs text-white/30">
        <span>{game.players} spillere</span>
        {!game.visible && (
          <span className="bg-yellow-500/20 text-yellow-400 rounded-full px-2 py-0.5">
            Skjult
          </span>
        )}
      </div>
    </div>
  );
}
