'use client';

import { useResults } from '@/hooks/useResults';
import Scoreboard from '@/components/results/Scoreboard';
import MatchHistory from '@/components/results/MatchHistory';

export default function ResultsPage() {
  const { results, webWins, devopsWins, loading } = useResults();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white/50 font-body">Laster resultater...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="font-display text-3xl text-center mb-6">Resultater</h2>
      <Scoreboard webWins={webWins} devopsWins={devopsWins} />
      <MatchHistory results={results} />
    </div>
  );
}
