'use client';

import { useGames } from '@/hooks/useGames';
import GamesList from '@/components/games/GamesList';

export default function GamesPage() {
  const { games, loading } = useGames();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white/50 font-body">Laster spill...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="font-display text-3xl text-center mb-6">Alle Spill</h2>
      <GamesList games={games} />
    </div>
  );
}
