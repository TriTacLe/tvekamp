'use client';

import { useParticipants } from '@/hooks/useParticipants';
import { useResults } from '@/hooks/useResults';
import TeamGrid from '@/components/participants/TeamGrid';

export default function ParticipantsPage() {
  const { webPlayers, devopsPlayers, loading } = useParticipants();
  const { webWins, devopsWins } = useResults();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white/50 font-body">Laster deltakere...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="font-display text-3xl text-center mb-6">Deltakere</h2>
      <TeamGrid
        webPlayers={webPlayers}
        devopsPlayers={devopsPlayers}
        webWins={webWins}
        devopsWins={devopsWins}
      />
    </div>
  );
}
