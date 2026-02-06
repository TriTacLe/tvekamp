'use client';

import type { Game } from '@/lib/types';
import Button from '@/components/ui/Button';

interface GameActiveProps {
  game: Game;
  webPlayer: string;
  devopsPlayer: string;
  onFinish: () => void;
}

export default function GameActive({ game, webPlayer, devopsPlayer, onFinish }: GameActiveProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div className="relative text-center max-w-lg">
        <h2 className="font-display text-3xl mb-6 text-yellow-400">Kamp pågår!</h2>
        <h3 className="font-display text-2xl mb-8">{game.name}</h3>

        <div className="flex items-center justify-center gap-6 mb-8">
          {/* Web player */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full web-gradient flex items-center justify-center text-2xl font-bold mb-2 mx-auto">
              {webPlayer.charAt(0)}
            </div>
            <p className="font-body font-semibold">{webPlayer}</p>
            <p className="text-xs text-web-primary">Web</p>
          </div>

          {/* VS */}
          <div className="relative">
            <div className="font-display text-4xl text-white/80">VS</div>
            <div className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-white/20" />
          </div>

          {/* DevOps player */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full devops-gradient flex items-center justify-center text-2xl font-bold mb-2 mx-auto">
              {devopsPlayer.charAt(0)}
            </div>
            <p className="font-body font-semibold">{devopsPlayer}</p>
            <p className="text-xs text-devops-primary">DevOps</p>
          </div>
        </div>

        <Button variant="primary" size="lg" onClick={onFinish}>
          Kamp ferdig!
        </Button>
      </div>
    </div>
  );
}
