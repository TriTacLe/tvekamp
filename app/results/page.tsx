'use client';

import { useState } from 'react';
import { useResults } from '@/hooks/useResults';
import Scoreboard from '@/components/results/Scoreboard';
import MatchHistory from '@/components/results/MatchHistory';

export default function ResultsPage() {
  const { results, webWins, devopsWins, webScore, devopsScore, loading, clearResults } = useResults();
  const [confirming, setConfirming] = useState(false);

  const handleClear = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    try {
      await clearResults();
    } catch (err) {
      console.error(err);
    }
    setConfirming(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white/50 font-body">Laster resultater...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-3xl">Resultater</h2>
        {results.length > 0 && (
          <button
            onClick={handleClear}
            onBlur={() => setConfirming(false)}
            className={`px-4 py-2 rounded-full text-sm font-body transition-all cursor-pointer ${
              confirming
                ? 'bg-red-500/30 text-red-300 hover:bg-red-500/50'
                : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70'
            }`}
          >
            {confirming ? 'Er du sikker?' : 'Tøm resultater'}
          </button>
        )}
      </div>
      <Scoreboard webWins={webWins} devopsWins={devopsWins} webAuraPoints={webScore} devopsAuraPoints={devopsScore} />
      <MatchHistory results={results} />
    </div>
  );
}
