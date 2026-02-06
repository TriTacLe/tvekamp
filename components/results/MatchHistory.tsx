'use client';

import type { GameResult } from '@/lib/types';
import ResultItem from './ResultItem';

export default function MatchHistory({ results }: { results: GameResult[] }) {
  const sorted = [...results].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="font-display text-2xl text-center mb-4">Kamphistorikk</h3>
      <div className="space-y-3">
        {sorted.map((r) => (
          <ResultItem key={r.id} result={r} />
        ))}
        {sorted.length === 0 && (
          <p className="text-center text-white/30 py-8">Ingen kamper spilt ennå</p>
        )}
      </div>
    </div>
  );
}
