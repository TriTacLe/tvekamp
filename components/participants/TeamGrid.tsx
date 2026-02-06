'use client';

import type { Participant } from '@/lib/types';
import ParticipantCard from './ParticipantCard';
import TeamStats from './TeamStats';

interface TeamGridProps {
  webPlayers: Participant[];
  devopsPlayers: Participant[];
  webWins: number;
  devopsWins: number;
}

export default function TeamGrid({ webPlayers, devopsPlayers, webWins, devopsWins }: TeamGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {/* Web Team */}
      <div>
        <TeamStats team="web" count={webPlayers.length} wins={webWins} />
        <div className="space-y-3">
          {webPlayers.map((p) => (
            <ParticipantCard key={p.id} participant={p} />
          ))}
          {webPlayers.length === 0 && (
            <p className="text-white/30 text-sm text-center py-8">Ingen deltakere ennå</p>
          )}
        </div>
      </div>

      {/* DevOps Team */}
      <div>
        <TeamStats team="devops" count={devopsPlayers.length} wins={devopsWins} />
        <div className="space-y-3">
          {devopsPlayers.map((p) => (
            <ParticipantCard key={p.id} participant={p} />
          ))}
          {devopsPlayers.length === 0 && (
            <p className="text-white/30 text-sm text-center py-8">Ingen deltakere ennå</p>
          )}
        </div>
      </div>
    </div>
  );
}
