'use client';

import type { Game } from '@/lib/types';
import GameCard from './GameCard';

export default function GamesList({ games }: { games: Game[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
      {games.length === 0 && (
        <p className="col-span-full text-center text-white/30 py-12">Ingen spill funnet</p>
      )}
    </div>
  );
}
