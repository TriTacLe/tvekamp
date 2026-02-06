'use client';

import { TEAM_CONFIG } from '@/lib/constants';

interface TeamStatsProps {
  team: 'web' | 'devops';
  count: number;
  wins: number;
}

export default function TeamStats({ team, count, wins }: TeamStatsProps) {
  const config = TEAM_CONFIG[team];

  return (
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${config.gradient}`} />
      <span className="font-display text-xl">{config.name}</span>
      <span className="text-white/40 text-sm">
        {count} deltakere &middot; {wins} seiere
      </span>
    </div>
  );
}
