'use client';

import type { Game } from '@/lib/types';

interface GameCardProps {
  game: Game;
  onDelete?: (id: string) => void;
}

export default function GameCard({ game, onDelete }: GameCardProps) {
  return (
    <div className="glass rounded-xl p-5 hover:bg-white/5 transition-all duration-300 relative group">
      {onDelete && (
        <button
          onClick={() => onDelete(game.id)}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm cursor-pointer"
          title="Fjern spill"
        >
          &times;
        </button>
      )}
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
