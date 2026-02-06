'use client';

import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGameSession } from '@/hooks/useGameSession';
import { useGames } from '@/hooks/useGames';
import { useParticipants } from '@/hooks/useParticipants';
import { useResults } from '@/hooks/useResults';
import { useSound } from '@/hooks/useSound';
import SpinningWheel3D from '@/components/three/SpinningWheel3D';
import GameIntro from './GameIntro';
import PlayerWheelSelect from './PlayerWheelSelect';
import GameActive from './GameActive';
import ResultModal from './ResultModal';
import VictoryScreen from './VictoryScreen';
import type { Game } from '@/lib/types';

export default function SpinWheel() {
  const {
    phase,
    setPhase,
    playedGameIds,
    usedPlayerNames,
    currentGame,
    setCurrentGame,
    selectedWebPlayer,
    selectedDevopsPlayer,
    setSelectedWebPlayer,
    setSelectedDevopsPlayer,
    markGamePlayed,
    unmarkGamePlayed,
    resetAllGames,
    markPlayersUsed,
    unmarkPlayerUsed,
    resetAllPlayers,
    triggerConfetti,
    lastWinner,
    setLastWinner,
    reset,
  } = useGameSession();

  const { visibleGames, loading: gamesLoading } = useGames();
  const { webPlayers, devopsPlayers } = useParticipants();
  const { submitResult } = useResults();
  const { playSound } = useSound();
  const [showResetPanel, setShowResetPanel] = useState(false);

  // Filter out played games
  const availableGames = useMemo(
    () => visibleGames.filter((g) => !playedGameIds.has(g.id)),
    [visibleGames, playedGameIds]
  );

  const playedGames = useMemo(
    () => visibleGames.filter((g) => playedGameIds.has(g.id)),
    [visibleGames, playedGameIds]
  );

  const usedPlayers = useMemo(
    () => [...webPlayers, ...devopsPlayers].filter((p) => usedPlayerNames.has(p.name)),
    [webPlayers, devopsPlayers, usedPlayerNames]
  );

  const handleSpin = () => {
    if (availableGames.length === 0) return;
    playSound('spin');
    setPhase('spinning');
  };

  const handleSpinComplete = (game: Game) => {
    setCurrentGame(game);
    playSound('reveal');
    setPhase('reveal');
  };

  const handleContinueToSelect = () => {
    playSound('click');
    setPhase('player-select');
  };

  const handleSkipGame = () => {
    playSound('click');
    setCurrentGame(null);
    setPhase('idle');
  };

  const handleSelectPlayers = (webPlayer: string, devopsPlayer: string) => {
    setSelectedWebPlayer(webPlayer);
    setSelectedDevopsPlayer(devopsPlayer);
    playSound('gameStart');
    setPhase('active');
  };

  const handleFinishGame = () => {
    playSound('click');
    setPhase('result');
  };

  const handleSelectWinner = async (winner: 'web' | 'devops') => {
    if (!currentGame) return;

    try {
      await submitResult({
        gameId: currentGame.id,
        gameName: currentGame.name,
        winner,
        webPlayer: selectedWebPlayer,
        devopsPlayer: selectedDevopsPlayer,
      });
      markGamePlayed(currentGame.id);
      markPlayersUsed(selectedWebPlayer, selectedDevopsPlayer);
      triggerConfetti();
      playSound('winner');
      setLastWinner(winner);
      setPhase('victory');
    } catch (err) {
      console.error('Failed to submit result:', err);
      reset();
    }
  };

  const handleVictoryDismiss = () => {
    playSound('click');
    reset();
  };

  if (gamesLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white/50 font-body">Laster hjulet...</div>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex flex-col items-center">
      {/* 3D Wheel + overlaid SPIN button */}
      <div className="relative w-full max-w-lg" style={{ height: '500px' }}>
        <div className="absolute inset-0 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[3, 3, 5]} intensity={0.8} />
            <pointLight position={[-3, -3, 5]} intensity={0.3} color="#f97316" />
            <SpinningWheel3D
              games={availableGames}
              spinning={phase === 'spinning'}
              onSpinComplete={handleSpinComplete}
            />
          </Canvas>
        </div>

        {/* SPIN button centered over wheel */}
        {phase === 'idle' && (
          <div className="absolute inset-0 flex items-end justify-center pb-4">
            <button
              onClick={handleSpin}
              disabled={availableGames.length === 0}
              className="
                relative z-20
                px-12 py-4 rounded-full
                font-display text-3xl tracking-widest
                bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600
                hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500
                shadow-xl shadow-purple-500/40
                transition-all duration-300
                disabled:opacity-40 disabled:cursor-not-allowed
                hover:scale-110 active:scale-95
                border border-white/20
                cursor-pointer
              "
            >
              SPIN
            </button>
          </div>
        )}
      </div>

      {availableGames.length === 0 && phase === 'idle' && (
        <p className="text-white/40 text-sm mt-3 font-body">
          Alle spill er spilt!
        </p>
      )}

      {/* Reset panel toggle */}
      {phase === 'idle' && (playedGames.length > 0 || usedPlayers.length > 0) && (
        <div className="mt-4 w-full max-w-lg">
          <button
            onClick={() => setShowResetPanel(!showResetPanel)}
            className="text-white/40 hover:text-white/70 text-sm font-body transition-colors cursor-pointer"
          >
            {showResetPanel ? '▾ Skjul' : '▸ Legg tilbake spill/spillere'}
          </button>

          {showResetPanel && (
            <div className="mt-3 glass rounded-xl p-4 space-y-4">
              {/* Played games */}
              {playedGames.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/50 text-xs font-body uppercase tracking-wider">Spilte spill</span>
                    <button
                      onClick={resetAllGames}
                      className="text-xs text-purple-400 hover:text-purple-300 font-body cursor-pointer"
                    >
                      Legg tilbake alle
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {playedGames.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => unmarkGamePlayed(g.id)}
                        className="px-3 py-1 rounded-full text-xs font-body bg-white/5 text-white/60 hover:bg-white/15 hover:text-white transition-all cursor-pointer"
                        title="Klikk for å legge tilbake"
                      >
                        {g.name} ✕
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Used players */}
              {usedPlayers.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/50 text-xs font-body uppercase tracking-wider">Brukte spillere</span>
                    <button
                      onClick={resetAllPlayers}
                      className="text-xs text-purple-400 hover:text-purple-300 font-body cursor-pointer"
                    >
                      Legg tilbake alle
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {usedPlayers.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => unmarkPlayerUsed(p.name)}
                        className={`px-3 py-1 rounded-full text-xs font-body transition-all cursor-pointer ${
                          p.team === 'web'
                            ? 'bg-web-primary/10 text-web-primary/70 hover:bg-web-primary/20 hover:text-web-primary'
                            : 'bg-devops-primary/10 text-devops-primary/70 hover:bg-devops-primary/20 hover:text-devops-primary'
                        }`}
                        title="Klikk for å legge tilbake"
                      >
                        {p.team === 'web' ? '🌐' : '🔧'} {p.name} ✕
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Overlays based on phase */}
      {phase === 'reveal' && currentGame && (
        <GameIntro game={currentGame} onContinue={handleContinueToSelect} onBack={handleSkipGame} />
      )}

      {phase === 'player-select' && (
        <PlayerWheelSelect
          webPlayers={webPlayers}
          devopsPlayers={devopsPlayers}
          usedPlayerNames={usedPlayerNames}
          onSelect={handleSelectPlayers}
          onBack={() => setPhase('reveal')}
        />
      )}

      {phase === 'active' && currentGame && (
        <GameActive
          game={currentGame}
          webPlayer={selectedWebPlayer}
          devopsPlayer={selectedDevopsPlayer}
          onFinish={handleFinishGame}
        />
      )}

      {phase === 'result' && currentGame && (
        <ResultModal
          gameName={currentGame.name}
          webPlayer={selectedWebPlayer}
          devopsPlayer={selectedDevopsPlayer}
          onSelectWinner={handleSelectWinner}
        />
      )}

      {phase === 'victory' && lastWinner && (
        <VictoryScreen
          winnerTeam={lastWinner}
          winnerName={lastWinner === 'web' ? selectedWebPlayer : selectedDevopsPlayer}
          onDismiss={handleVictoryDismiss}
        />
      )}
    </div>
  );
}
