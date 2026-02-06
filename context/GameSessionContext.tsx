'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { GameFlowPhase, Game } from '@/lib/types';

interface GameSessionState {
  phase: GameFlowPhase;
  playedGameIds: Set<string>;
  usedPlayerNames: Set<string>;
  currentGame: Game | null;
  selectedWebPlayer: string;
  selectedDevopsPlayer: string;
  showConfetti: boolean;
  animationEnabled: boolean;
  lastWinner: 'web' | 'devops' | null;
}

interface GameSessionContextType extends GameSessionState {
  setPhase: (phase: GameFlowPhase) => void;
  setCurrentGame: (game: Game | null) => void;
  setSelectedWebPlayer: (name: string) => void;
  setSelectedDevopsPlayer: (name: string) => void;
  setLastWinner: (winner: 'web' | 'devops' | null) => void;
  markGamePlayed: (gameId: string) => void;
  unmarkGamePlayed: (gameId: string) => void;
  resetAllGames: () => void;
  markPlayersUsed: (webPlayer: string, devopsPlayer: string) => void;
  unmarkPlayerUsed: (name: string) => void;
  resetAllPlayers: () => void;
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
  const [selectedWebPlayer, setSelectedWebPlayer] = useState('');
  const [selectedDevopsPlayer, setSelectedDevopsPlayer] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [lastWinner, setLastWinner] = useState<'web' | 'devops' | null>(null);

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

  const markPlayersUsed = useCallback((webPlayer: string, devopsPlayer: string) => {
    setUsedPlayerNames((prev) => {
      const next = new Set(prev);
      next.add(webPlayer);
      next.add(devopsPlayer);
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
    setSelectedWebPlayer('');
    setSelectedDevopsPlayer('');
    setLastWinner(null);
  }, []);

  return (
    <GameSessionContext.Provider
      value={{
        phase,
        playedGameIds,
        usedPlayerNames,
        currentGame,
        selectedWebPlayer,
        selectedDevopsPlayer,
        showConfetti,
        animationEnabled,
        lastWinner,
        setPhase,
        setCurrentGame,
        setSelectedWebPlayer,
        setSelectedDevopsPlayer,
        setLastWinner,
        markGamePlayed,
        unmarkGamePlayed,
        resetAllGames,
        markPlayersUsed,
        unmarkPlayerUsed,
        resetAllPlayers,
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
