'use client';

import { useState, useEffect, useRef } from 'react';
import type { Game } from '@/lib/types';
import Button from '@/components/ui/Button';
import { useSound } from '@/hooks/useSound';

interface GameActiveProps {
  game: Game;
  webPlayers: string[];
  devopsPlayers: string[];
  onFinish: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function GameActive({ game, webPlayers, devopsPlayers, onFinish }: GameActiveProps) {
  const isAllGame = game.playersPerTeam === 0;
  const totalSeconds = game.time * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [timeUp, setTimeUp] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { playSound } = useSound();

  // Start countdown on mount
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Sound effects: tick for last 5 seconds, ding at 0
  useEffect(() => {
    if (secondsLeft <= 5 && secondsLeft > 0) {
      playSound('click');
    } else if (secondsLeft === 0) {
      playSound('reveal');
    }
  }, [secondsLeft, playSound]);

  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;

  const timerColor =
    secondsLeft > 30
      ? 'text-white'
      : secondsLeft > 10
      ? 'text-yellow-400'
      : secondsLeft > 5
      ? 'text-orange-400'
      : 'text-red-500';

  const barColor =
    secondsLeft > 30
      ? 'bg-green-400'
      : secondsLeft > 10
      ? 'bg-yellow-400'
      : 'bg-red-500';

  const isUrgent = secondsLeft <= 5 && !timeUp;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />
      <div className="relative text-center max-w-2xl w-full">

        {/* Countdown timer */}
        <div className="mb-5">
          {timeUp ? (
            <div className="font-display text-7xl text-red-400 animate-bounce">TID UT!</div>
          ) : (
            <div
              className={`font-display text-8xl tabular-nums transition-colors duration-500 ${timerColor} ${
                isUrgent ? 'animate-pulse' : ''
              }`}
            >
              {formatTime(secondsLeft)}
            </div>
          )}

          {/* Depleting progress bar */}
          <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden max-w-sm mx-auto">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-linear ${barColor}`}
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* Game name */}
        <h2 className="font-display text-3xl mb-3 text-yellow-400">{game.name}</h2>

        {/* Rules */}
        <p className="text-white/55 font-body text-sm leading-relaxed max-w-lg mx-auto mb-7 px-2">
          {game.rules}
        </p>

        {/* Players VS */}
        <div className="flex items-center justify-center gap-6 mb-8">
          {/* Web team */}
          <div className="text-center min-w-[110px]">
            {isAllGame ? (
              <div className="w-14 h-14 rounded-full web-gradient flex items-center justify-center text-2xl mb-2 mx-auto shadow-lg shadow-web-primary/30">
                🌐
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 mb-2">
                {webPlayers.map((name) => (
                  <div key={name} className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full web-gradient flex items-center justify-center text-base font-bold shadow-md">
                      {name.charAt(0)}
                    </div>
                    <span className="font-body font-semibold text-sm">{name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-web-primary font-semibold uppercase tracking-wide">
              {isAllGame ? 'Hele Web-laget' : 'Web'}
            </p>
          </div>

          {/* VS separator */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className={`font-display text-4xl transition-colors duration-500 ${timeUp ? 'text-red-400' : 'text-white/70'}`}>
              VS
            </div>
            <div className={`w-1 h-8 rounded-full transition-colors duration-500 ${timeUp ? 'bg-red-500' : 'bg-white/20'}`} />
          </div>

          {/* DevOps team */}
          <div className="text-center min-w-[110px]">
            {isAllGame ? (
              <div className="w-14 h-14 rounded-full devops-gradient flex items-center justify-center text-2xl mb-2 mx-auto shadow-lg shadow-devops-primary/30">
                🔧
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 mb-2">
                {devopsPlayers.map((name) => (
                  <div key={name} className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full devops-gradient flex items-center justify-center text-base font-bold shadow-md">
                      {name.charAt(0)}
                    </div>
                    <span className="font-body font-semibold text-sm">{name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-devops-primary font-semibold uppercase tracking-wide">
              {isAllGame ? 'Hele DevOps-laget' : 'DevOps'}
            </p>
          </div>
        </div>

        <Button variant="primary" size="lg" onClick={onFinish}>
          {timeUp ? '🏆 Velg vinner!' : 'Kamp ferdig!'}
        </Button>
      </div>
    </div>
  );
}
