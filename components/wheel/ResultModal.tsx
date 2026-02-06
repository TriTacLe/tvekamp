'use client';

import Button from '@/components/ui/Button';

interface ResultModalProps {
  gameName: string;
  webPlayer: string;
  devopsPlayer: string;
  onSelectWinner: (winner: 'web' | 'devops') => void;
}

export default function ResultModal({
  gameName,
  webPlayer,
  devopsPlayer,
  onSelectWinner,
}: ResultModalProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div className="relative glass rounded-2xl p-6 max-w-md w-full text-center">
        <h2 className="font-display text-2xl mb-2">Hvem vant?</h2>
        <p className="text-white/50 mb-6 font-body">{gameName}</p>

        <div className="flex gap-4">
          <button
            onClick={() => onSelectWinner('web')}
            className="flex-1 p-4 rounded-xl web-gradient hover:opacity-90 transition-opacity group"
          >
            <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">🏆</div>
            <div className="font-display text-lg">{webPlayer}</div>
            <div className="text-xs text-white/70">Web</div>
          </button>

          <button
            onClick={() => onSelectWinner('devops')}
            className="flex-1 p-4 rounded-xl devops-gradient hover:opacity-90 transition-opacity group"
          >
            <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">🏆</div>
            <div className="font-display text-lg">{devopsPlayer}</div>
            <div className="text-xs text-white/70">DevOps</div>
          </button>
        </div>
      </div>
    </div>
  );
}
