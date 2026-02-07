'use client';

import type { Participant } from '@/lib/types';

interface ParticipantCardProps {
  participant: Participant;
  onDelete?: (id: string) => void;
}

export default function ParticipantCard({ participant, onDelete }: ParticipantCardProps) {
  const isWeb = participant.team === 'web';
  const borderColor = isWeb ? 'border-web-primary/30' : 'border-devops-primary/30';
  const glowColor = isWeb ? 'hover:shadow-web-primary/20' : 'hover:shadow-devops-primary/20';

  return (
    <div
      className={`glass rounded-xl p-5 border ${borderColor} ${glowColor} hover:shadow-lg transition-all duration-300 relative group`}
    >
      {onDelete && (
        <button
          onClick={() => onDelete(participant.id)}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm cursor-pointer"
          title="Fjern deltaker"
        >
          &times;
        </button>
      )}
      <div className="flex flex-col items-center text-center gap-3">
        {participant.imageUrl ? (
          <img
            src={participant.imageUrl}
            alt={participant.name}
            className="w-48 h-48 rounded-full object-cover border-4 border-white/10 shadow-lg"
          />
        ) : (
          <div
            className={`w-48 h-48 rounded-full flex items-center justify-center text-4xl font-bold ${
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
