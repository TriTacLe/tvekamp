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

  const visibleGames = games.filter((g) => g.visible);

  return { games, visibleGames, loading, refetch: fetchGames };
}
