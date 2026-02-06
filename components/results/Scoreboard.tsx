'use client';

import { TEAM_CONFIG } from '@/lib/constants';

interface ScoreboardProps {
  webWins: number;
  devopsWins: number;
}

export default function Scoreboard({ webWins, devopsWins }: ScoreboardProps) {
  const total = webWins + devopsWins;

  return (
    <div className="glass rounded-2xl p-6 max-w-2xl mx-auto mb-8">
      <h3 className="font-display text-2xl text-center mb-6">Stillingen</h3>

      <div className="flex items-center justify-center gap-8">
        {/* Web Score */}
        <div className="text-center">
          <div className="font-display text-5xl web-gradient bg-clip-text text-transparent">
            {webWins}
          </div>
          <div className="text-sm text-white/50 mt-1">{TEAM_CONFIG.web.name}</div>
        </div>

        {/* VS */}
        <div className="font-display text-2xl text-white/30">VS</div>

        {/* DevOps Score */}
        <div className="text-center">
          <div className="font-display text-5xl devops-gradient bg-clip-text text-transparent">
            {devopsWins}
          </div>
          <div className="text-sm text-white/50 mt-1">{TEAM_CONFIG.devops.name}</div>
        </div>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="mt-6 h-3 rounded-full bg-white/5 overflow-hidden flex">
          <div
            className="web-gradient transition-all duration-500"
            style={{ width: `${(webWins / total) * 100}%` }}
          />
          <div
            className="devops-gradient transition-all duration-500"
            style={{ width: `${(devopsWins / total) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
