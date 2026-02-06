'use client';

import { useState, useEffect, useCallback } from 'react';
import type { GameResult } from '@/lib/types';

export function useResults() {
  const [results, setResults] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = useCallback(async () => {
    try {
      const res = await fetch('/api/results');
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Failed to fetch results:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const submitResult = useCallback(
    async (data: {
      gameId: string;
      gameName: string;
      winner: 'web' | 'devops';
      webPlayer: string;
      devopsPlayer: string;
    }) => {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to submit result');
      const newResult = await res.json();
      setResults((prev) => [...prev, newResult]);
      return newResult;
    },
    []
  );

  const webWins = results.filter((r) => r.winner === 'web').length;
  const devopsWins = results.filter((r) => r.winner === 'devops').length;

  return { results, webWins, devopsWins, loading, refetch: fetchResults, submitResult };
}
