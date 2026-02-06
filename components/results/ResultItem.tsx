'use client';

import type { GameResult } from '@/lib/types';

export default function ResultItem({ result }: { result: GameResult }) {
  const isWebWin = result.winner === 'web';
  const winnerBg = isWebWin ? 'border-web-primary/30' : 'border-devops-primary/30';

  return (
    <div className={`glass rounded-xl p-4 border ${winnerBg}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-display text-base">{result.gameName}</h4>
        <span
          className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
            isWebWin
              ? 'bg-web-primary/20 text-web-primary'
              : 'bg-devops-primary/20 text-devops-primary'
          }`}
        >
          {isWebWin ? 'Web vant' : 'DevOps vant'}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-white/40">
        <span>{result.webPlayer}</span>
        <span>vs</span>
        <span>{result.devopsPlayer}</span>
        <span className="ml-auto">
          {new Date(result.timestamp).toLocaleDateString('no-NO')}
        </span>
      </div>
    </div>
  );
}
