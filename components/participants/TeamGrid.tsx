'use client';

import type { Participant } from '@/lib/types';
import ParticipantCard from './ParticipantCard';
import TeamStats from './TeamStats';

interface TeamGridProps {
  webPlayers: Participant[];
  devopsPlayers: Participant[];
  webWins: number;
  devopsWins: number;
  onDelete?: (id: string) => void;
}

export default function TeamGrid({ webPlayers, devopsPlayers, webWins, devopsWins, onDelete }: TeamGridProps) {
  const webAura = webPlayers.reduce((sum, p) => sum + (p.auraPoints || 0), 0);
  const devopsAura = devopsPlayers.reduce((sum, p) => sum + (p.auraPoints || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {/* Web Team */}
      <div>
        <TeamStats team="web" count={webPlayers.length} wins={webWins} auraPoints={webAura} />
        <div className="space-y-3">
          {webPlayers.map((p) => (
            <ParticipantCard key={p.id} participant={p} onDelete={onDelete} />
          ))}
          {webPlayers.length === 0 && (
            <p className="text-white/30 text-sm text-center py-8">Ingen deltakere enna</p>
          )}
        </div>
      </div>

      {/* DevOps Team */}
      <div>
        <TeamStats team="devops" count={devopsPlayers.length} wins={devopsWins} auraPoints={devopsAura} />
        <div className="space-y-3">
          {devopsPlayers.map((p) => (
            <ParticipantCard key={p.id} participant={p} onDelete={onDelete} />
          ))}
          {devopsPlayers.length === 0 && (
            <p className="text-white/30 text-sm text-center py-8">Ingen deltakere enna</p>
          )}
        </div>
      </div>
    </div>
  );
}
