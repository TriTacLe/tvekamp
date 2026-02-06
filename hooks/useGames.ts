'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Game } from '@/lib/types';

export function useGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGames = useCallback(async () => {
    try {
      const res = await fetch('/api/games');
      const data = await res.json();
      setGames(data);
    } catch (err) {
      console.error('Failed to fetch games:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const addGame = useCallback(async (data: { name: string; rules: string; time?: number; players?: number }) => {
    const res = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add game');
    const newG = await res.json();
    setGames((prev) => [...prev, newG]);
    return newG;
  }, []);

  const deleteGame = useCallback(async (id: string) => {
    const res = await fetch(`/api/games?id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete game');
    setGames((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const visibleGames = games.filter((g) => g.visible);

  return { games, visibleGames, loading, refetch: fetchGames, addGame, deleteGame };
}
