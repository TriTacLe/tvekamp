'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { GameFlowPhase, Game } from '@/lib/types';

interface GameSessionState {
  phase: GameFlowPhase;
  playedGameIds: Set<string>;
  usedPlayerNames: Set<string>;
  currentGame: Game | null;
  selectedWebPlayers: string[];
  selectedDevopsPlayers: string[];
  showConfetti: boolean;
  animationEnabled: boolean;
  lastWinner: 'web' | 'devops' | null;
  webScore: number;
  devopsScore: number;
}

interface GameSessionContextType extends GameSessionState {
  setPhase: (phase: GameFlowPhase) => void;
  setCurrentGame: (game: Game | null) => void;
  setSelectedWebPlayers: (names: string[]) => void;
  setSelectedDevopsPlayers: (names: string[]) => void;
  setLastWinner: (winner: 'web' | 'devops' | null) => void;
  markGamePlayed: (gameId: string) => void;
  unmarkGamePlayed: (gameId: string) => void;
  resetAllGames: () => void;
  markPlayersUsed: (players: string[]) => void;
  unmarkPlayerUsed: (name: string) => void;
  resetAllPlayers: () => void;
  addScore: (team: 'web' | 'devops', points: number) => void;
  triggerConfetti: () => void;
  toggleAnimation: () => void;
  reset: () => void;
}

const GameSessionContext = createContext<GameSessionContextType | null>(null);

export function GameSessionProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<GameFlowPhase>('idle');
  const [playedGameIds, setPlayedGameIds] = useState<Set<string>>(new Set());
  const [usedPlayerNames, setUsedPlayerNames] = useState<Set<string>>(new Set());
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [selectedWebPlayers, setSelectedWebPlayers] = useState<string[]>([]);
  const [selectedDevopsPlayers, setSelectedDevopsPlayers] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [lastWinner, setLastWinner] = useState<'web' | 'devops' | null>(null);
  const [webScore, setWebScore] = useState(0);
  const [devopsScore, setDevopsScore] = useState(0);

  const markGamePlayed = useCallback((gameId: string) => {
    setPlayedGameIds((prev) => new Set(prev).add(gameId));
  }, []);

  const unmarkGamePlayed = useCallback((gameId: string) => {
    setPlayedGameIds((prev) => {
      const next = new Set(prev);
      next.delete(gameId);
      return next;
    });
  }, []);

  const resetAllGames = useCallback(() => {
    setPlayedGameIds(new Set());
  }, []);

  const markPlayersUsed = useCallback((players: string[]) => {
    setUsedPlayerNames((prev) => {
      const next = new Set(prev);
      players.forEach((p) => next.add(p));
      return next;
    });
  }, []);

  const unmarkPlayerUsed = useCallback((name: string) => {
    setUsedPlayerNames((prev) => {
      const next = new Set(prev);
      next.delete(name);
      return next;
    });
  }, []);

  const resetAllPlayers = useCallback(() => {
    setUsedPlayerNames(new Set());
  }, []);

  const addScore = useCallback((team: 'web' | 'devops', points: number) => {
    if (team === 'web') {
      setWebScore((prev) => prev + points);
    } else {
      setDevopsScore((prev) => prev + points);
    }
  }, []);

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  const toggleAnimation = useCallback(() => {
    setAnimationEnabled((prev) => !prev);
  }, []);

  const reset = useCallback(() => {
    setPhase('idle');
    setCurrentGame(null);
    setSelectedWebPlayers([]);
    setSelectedDevopsPlayers([]);
    setLastWinner(null);
  }, []);

  return (
    <GameSessionContext.Provider
      value={{
        phase,
        playedGameIds,
        usedPlayerNames,
        currentGame,
        selectedWebPlayers,
        selectedDevopsPlayers,
        showConfetti,
        animationEnabled,
        lastWinner,
        webScore,
        devopsScore,
        setPhase,
        setCurrentGame,
        setSelectedWebPlayers,
        setSelectedDevopsPlayers,
        setLastWinner,
        markGamePlayed,
        unmarkGamePlayed,
        resetAllGames,
        markPlayersUsed,
        unmarkPlayerUsed,
        resetAllPlayers,
        addScore,
        triggerConfetti,
        toggleAnimation,
        reset,
      }}
    >
      {children}
    </GameSessionContext.Provider>
  );
}

export function useGameSession() {
  const ctx = useContext(GameSessionContext);
  if (!ctx) throw new Error('useGameSession must be used within GameSessionProvider');
  return ctx;
}
