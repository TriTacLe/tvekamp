'use client';

import type { Participant } from '@/lib/types';

export default function ParticipantCard({ participant }: { participant: Participant }) {
  const isWeb = participant.team === 'web';
  const borderColor = isWeb ? 'border-web-primary/30' : 'border-devops-primary/30';
  const glowColor = isWeb ? 'hover:shadow-web-primary/20' : 'hover:shadow-devops-primary/20';

  return (
    <div
      className={`glass rounded-xl p-5 border ${borderColor} ${glowColor} hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex flex-col items-center text-center gap-3">
        {participant.imageUrl ? (
          <img
            src={participant.imageUrl}
            alt={participant.name}
            className="w-28 h-28 rounded-full object-cover border-3 border-white/10 shadow-lg"
          />
        ) : (
          <div
            className={`w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold ${
              isWeb ? 'web-gradient' : 'devops-gradient'
            }`}
          >
            {participant.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h3 className="font-body font-semibold text-white text-lg">{participant.name}</h3>
          {participant.superpower && (
            <p className="text-sm text-white/40 mt-0.5">{participant.superpower}</p>
          )}
        </div>
      </div>
      {participant.funFact && (
        <p className="mt-3 text-sm text-white/50 italic text-center">
          &quot;{participant.funFact}&quot;
        </p>
      )}
    </div>
  );
}
