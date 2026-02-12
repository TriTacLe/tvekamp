'use client';

import type { Game } from '@/lib/types';
import Button from '@/components/ui/Button';

interface GameActiveProps {
  game: Game;
  webPlayers: string[];
  devopsPlayers: string[];
  onFinish: () => void;
}

export default function GameActive({ game, webPlayers, devopsPlayers, onFinish }: GameActiveProps) {
  const isAllGame = game.playersPerTeam === 0;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div className="relative text-center max-w-lg">
        <h2 className="font-display text-3xl mb-6 text-yellow-400">Kamp pågår!</h2>
        <h3 className="font-display text-2xl mb-8">{game.name}</h3>

        <div className="flex items-center justify-center gap-6 mb-8">
          {/* Web team */}
          <div className="text-center">
            {isAllGame ? (
              <div className="w-16 h-16 rounded-full web-gradient flex items-center justify-center text-2xl font-bold mb-2 mx-auto">
                🌐
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 mb-2">
                {webPlayers.map((name) => (
                  <div key={name} className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full web-gradient flex items-center justify-center text-lg font-bold">
                      {name.charAt(0)}
                    </div>
                    <span className="font-body font-semibold text-sm">{name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-web-primary">{isAllGame ? 'Hele Web-laget' : 'Web'}</p>
          </div>

          {/* VS */}
          <div className="relative">
            <div className="font-display text-4xl text-white/80">VS</div>
            <div className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-white/20" />
          </div>

          {/* DevOps team */}
          <div className="text-center">
            {isAllGame ? (
              <div className="w-16 h-16 rounded-full devops-gradient flex items-center justify-center text-2xl font-bold mb-2 mx-auto">
                🔧
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 mb-2">
                {devopsPlayers.map((name) => (
                  <div key={name} className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full devops-gradient flex items-center justify-center text-lg font-bold">
                      {name.charAt(0)}
                    </div>
                    <span className="font-body font-semibold text-sm">{name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-devops-primary">{isAllGame ? 'Hele DevOps-laget' : 'DevOps'}</p>
          </div>
        </div>

        <Button variant="primary" size="lg" onClick={onFinish}>
          Kamp ferdig!
        </Button>
      </div>
    </div>
  );
}
