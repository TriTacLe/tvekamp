'use client';

import { TEAM_CONFIG } from '@/lib/constants';

interface ScoreboardProps {
  webWins: number;
  devopsWins: number;
  webAuraPoints: number;
  devopsAuraPoints: number;
}

export default function Scoreboard({ webWins, devopsWins, webAuraPoints, devopsAuraPoints }: ScoreboardProps) {
  const total = webAuraPoints + devopsAuraPoints;

  return (
    <div className="glass rounded-2xl p-6 max-w-2xl mx-auto mb-8">
      <h3 className="font-display text-2xl text-center mb-1">Aura Poeng</h3>
      <p className="text-center text-white/40 text-xs font-body mb-6">Totale aura poeng per lag</p>

      <div className="flex items-center justify-center gap-8">
        {/* Web Score */}
        <div className="text-center">
          <div className="font-display text-5xl web-gradient bg-clip-text text-transparent">
            {webAuraPoints}
          </div>
          <div className="text-sm text-white/50 mt-1">{TEAM_CONFIG.web.name}</div>
          <div className="text-xs text-white/30 mt-0.5">{webWins} seiere</div>
        </div>

        {/* VS */}
        <div className="flex flex-col items-center gap-1">
          <div className="font-display text-2xl text-white/30">VS</div>
          <div className="text-xs text-yellow-400/60 font-body">aura poeng</div>
        </div>

        {/* DevOps Score */}
        <div className="text-center">
          <div className="font-display text-5xl devops-gradient bg-clip-text text-transparent">
            {devopsAuraPoints}
          </div>
          <div className="text-sm text-white/50 mt-1">{TEAM_CONFIG.devops.name}</div>
          <div className="text-xs text-white/30 mt-0.5">{devopsWins} seiere</div>
        </div>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="mt-6 h-3 rounded-full bg-white/5 overflow-hidden flex">
          <div
            className="web-gradient transition-all duration-500"
            style={{ width: `${(webAuraPoints / total) * 100}%` }}
          />
          <div
            className="devops-gradient transition-all duration-500"
            style={{ width: `${(devopsAuraPoints / total) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
