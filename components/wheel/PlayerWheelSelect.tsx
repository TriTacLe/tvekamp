'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { WHEEL_COLORS } from '@/lib/constants';
import type { Participant } from '@/lib/types';

interface PlayerWheelSelectProps {
  webPlayers: Participant[];
  devopsPlayers: Participant[];
  usedPlayerNames: Set<string>;
  playersPerTeam: number;
  onSelect: (webPlayers: string[], devopsPlayers: string[]) => void;
  onBack: () => void;
}

type SelectionMode = 'wheel' | 'manual';
type TeamPhase = 'web' | 'devops';

/** Get a unique short display name — handle duplicate first names by adding last initial */
function getDisplayNames(players: Participant[]): Map<string, string> {
  const firstNames = new Map<string, number>();
  players.forEach((p) => {
    const first = p.name.split(' ')[0];
    firstNames.set(first, (firstNames.get(first) || 0) + 1);
  });

  const result = new Map<string, string>();
  players.forEach((p) => {
    const parts = p.name.split(' ');
    const first = parts[0];
    if ((firstNames.get(first) || 0) > 1 && parts.length > 1) {
      // Add last name initial for disambiguation
      const lastInitial = parts[parts.length - 1][0];
      result.set(p.name, `${first} ${lastInitial}.`);
    } else {
      result.set(p.name, first);
    }
  });
  return result;
}

export default function PlayerWheelSelect({
  webPlayers,
  devopsPlayers,
  usedPlayerNames,
  playersPerTeam,
  onSelect,
  onBack,
}: PlayerWheelSelectProps) {
  const [mode, setMode] = useState<SelectionMode>('wheel');
  const [teamPhase, setTeamPhase] = useState<TeamPhase>('web');
  const [chosenWeb, setChosenWeb] = useState<string[]>([]);
  const [chosenDevops, setChosenDevops] = useState<string[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [currentSpinResult, setCurrentSpinResult] = useState<string | null>(null);

  const availableWeb = useMemo(
    () => webPlayers.filter((p) => !usedPlayerNames.has(p.name) && !chosenWeb.includes(p.name)),
    [webPlayers, usedPlayerNames, chosenWeb]
  );
  const availableDevops = useMemo(
    () => devopsPlayers.filter((p) => !usedPlayerNames.has(p.name) && !chosenDevops.includes(p.name)),
    [devopsPlayers, usedPlayerNames, chosenDevops]
  );

  const currentTeamPlayers = teamPhase === 'web' ? availableWeb : availableDevops;
  const currentChosen = teamPhase === 'web' ? chosenWeb : chosenDevops;
  const needed = playersPerTeam;
  const teamLabel = teamPhase === 'web' ? 'Web' : 'DevOps';
  const teamColor = teamPhase === 'web' ? '#6366f1' : '#f97316';
  const teamEmoji = teamPhase === 'web' ? '🌐' : '🔧';

  const displayNames = useMemo(
    () => getDisplayNames(currentTeamPlayers),
    [currentTeamPlayers]
  );

  // All participants for manual mode (show available from the original pool, minus already used/chosen)
  const manualWebPool = useMemo(
    () => webPlayers.filter((p) => !usedPlayerNames.has(p.name)),
    [webPlayers, usedPlayerNames]
  );
  const manualDevopsPool = useMemo(
    () => devopsPlayers.filter((p) => !usedPlayerNames.has(p.name)),
    [devopsPlayers, usedPlayerNames]
  );

  const handleWheelResult = useCallback((name: string) => {
    setCurrentSpinResult(name);
    setSpinning(false);
  }, []);

  const acceptSpinResult = () => {
    if (!currentSpinResult) return;
    if (teamPhase === 'web') {
      const newChosen = [...chosenWeb, currentSpinResult];
      setChosenWeb(newChosen);
      setCurrentSpinResult(null);
      if (newChosen.length >= needed) {
        setTeamPhase('devops');
      }
    } else {
      const newChosen = [...chosenDevops, currentSpinResult];
      setChosenDevops(newChosen);
      setCurrentSpinResult(null);
      if (newChosen.length >= needed) {
        // Both teams done
        onSelect(chosenWeb, newChosen);
      }
    }
  };

  const rejectSpinResult = () => {
    setCurrentSpinResult(null);
  };

  const startGame = () => {
    onSelect(chosenWeb, chosenDevops);
  };

  // Manual mode toggle
  const toggleManualPlayer = (name: string) => {
    if (teamPhase === 'web') {
      if (chosenWeb.includes(name)) {
        setChosenWeb(chosenWeb.filter((n) => n !== name));
      } else if (chosenWeb.length < needed) {
        setChosenWeb([...chosenWeb, name]);
      }
    } else {
      if (chosenDevops.includes(name)) {
        setChosenDevops(chosenDevops.filter((n) => n !== name));
      } else if (chosenDevops.length < needed) {
        setChosenDevops([...chosenDevops, name]);
      }
    }
  };

  const confirmManualSelection = () => {
    if (teamPhase === 'web' && chosenWeb.length >= needed) {
      setTeamPhase('devops');
    } else if (teamPhase === 'devops' && chosenDevops.length >= needed) {
      onSelect(chosenWeb, chosenDevops);
    }
  };

  const handleBack = () => {
    if (teamPhase === 'devops') {
      setChosenDevops([]);
      setCurrentSpinResult(null);
      setTeamPhase('web');
    } else {
      onBack();
    }
  };

  const statusText = (() => {
    if (mode === 'wheel') {
      if (currentSpinResult) {
        return `${teamEmoji} ${teamLabel}: ${currentSpinResult} — Godta eller spin igjen`;
      }
      const remaining = needed - currentChosen.length;
      if (remaining > 1) {
        return `Spin for ${teamLabel}-spiller ${currentChosen.length + 1}/${needed}`;
      }
      return `Spin for å velge ${teamLabel}-spiller`;
    }
    return `Velg ${needed} ${teamLabel}-spillere`;
  })();

  const manualPool = teamPhase === 'web' ? manualWebPool : manualDevopsPool;
  const manualDisplayNames = useMemo(() => getDisplayNames(manualPool), [manualPool]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div className="relative flex flex-col items-center max-w-lg w-full">
        <h2 className="font-display text-3xl mb-2 text-white">Velg Spillere</h2>

        {/* Mode toggle */}
        <div className="flex rounded-full bg-white/10 p-1 mb-4">
          <button
            onClick={() => setMode('wheel')}
            className={`px-4 py-1.5 rounded-full text-sm font-body transition-all cursor-pointer ${
              mode === 'wheel' ? 'bg-purple-600 text-white' : 'text-white/50 hover:text-white'
            }`}
          >
            Spin Hjulet
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`px-4 py-1.5 rounded-full text-sm font-body transition-all cursor-pointer ${
              mode === 'manual' ? 'bg-purple-600 text-white' : 'text-white/50 hover:text-white'
            }`}
          >
            Velg Manuelt
          </button>
        </div>

        <p className="font-body text-white/60 mb-4">{statusText}</p>

        {mode === 'wheel' ? (
          /* ── Wheel Mode ── */
          <>
            {currentTeamPlayers.length > 0 ? (
              <MiniWheel
                key={`${teamPhase}-${currentChosen.length}`}
                items={currentTeamPlayers.map((p) => p.name)}
                displayItems={currentTeamPlayers.map((p) => displayNames.get(p.name) || p.name.split(' ')[0])}
                spinning={spinning}
                onResult={handleWheelResult}
                accentColor={teamColor}
              />
            ) : (
              <div className="w-96 h-96 rounded-full bg-white/5 flex items-center justify-center">
                <p className="text-yellow-400 font-body text-sm text-center px-4">
                  Ingen tilgjengelige {teamLabel}-spillere
                </p>
              </div>
            )}
          </>
        ) : (
          /* ── Manual Mode ── */
          <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto w-full px-2">
            {manualPool.map((p) => {
              const isChosen = teamPhase === 'web'
                ? chosenWeb.includes(p.name)
                : chosenDevops.includes(p.name);
              const shortName = manualDisplayNames.get(p.name) || p.name.split(' ')[0];
              return (
                <button
                  key={p.id}
                  onClick={() => toggleManualPlayer(p.name)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                    isChosen
                      ? 'bg-purple-600/40 border-2 border-purple-400'
                      : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                    style={{ backgroundColor: teamColor + '40', color: teamColor }}
                  >
                    {shortName[0]}
                  </div>
                  <div className="text-left min-w-0">
                    <p className="font-body font-semibold text-sm text-white truncate">{p.name}</p>
                    {p.superpower && (
                      <p className="text-xs text-white/40 truncate">{p.superpower}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Chosen players summary */}
        {(chosenWeb.length > 0 || chosenDevops.length > 0) && (
          <div className="flex flex-wrap gap-2 mt-4 font-body text-sm justify-center">
            {chosenWeb.map((name) => (
              <span key={name} className="px-3 py-1 rounded-full bg-web-primary/20 text-web-primary">
                🌐 {name.split(' ')[0]}
              </span>
            ))}
            {chosenDevops.map((name) => (
              <span key={name} className="px-3 py-1 rounded-full bg-devops-primary/20 text-devops-primary">
                🔧 {name.split(' ')[0]}
              </span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleBack}
            className="px-6 py-3 rounded-full font-body text-sm text-white/60 hover:text-white bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
          >
            Tilbake
          </button>

          {mode === 'wheel' && !currentSpinResult && currentTeamPlayers.length > 0 && (
            <button
              onClick={() => setSpinning(true)}
              disabled={spinning}
              className="
                px-8 py-3 rounded-full font-display text-xl tracking-wider
                bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600
                hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500
                shadow-xl shadow-purple-500/40 transition-all
                hover:scale-105 active:scale-95 border border-white/20
                cursor-pointer disabled:opacity-50
              "
            >
              SPIN {teamEmoji} {teamLabel}
            </button>
          )}

          {mode === 'wheel' && currentSpinResult && (
            <>
              <button
                onClick={rejectSpinResult}
                className="px-6 py-3 rounded-full font-body text-sm text-white/60 hover:text-white bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
              >
                Spin igjen
              </button>
              <button
                onClick={acceptSpinResult}
                className="
                  px-8 py-3 rounded-full font-display text-lg tracking-wider
                  bg-gradient-to-r from-green-600 to-emerald-600
                  hover:from-green-500 hover:to-emerald-500
                  shadow-xl shadow-green-500/30 transition-all
                  hover:scale-105 active:scale-95 border border-white/20 cursor-pointer
                "
              >
                {teamPhase === 'web' && chosenWeb.length + 1 >= needed
                  ? 'Godta'
                  : teamPhase === 'devops' && chosenDevops.length + 1 >= needed
                    ? 'Start Kamp!'
                    : 'Godta'}
              </button>
            </>
          )}

          {mode === 'manual' && (
            <button
              onClick={confirmManualSelection}
              disabled={
                (teamPhase === 'web' && chosenWeb.length < needed) ||
                (teamPhase === 'devops' && chosenDevops.length < needed)
              }
              className="
                px-8 py-3 rounded-full font-display text-lg tracking-wider
                bg-gradient-to-r from-green-600 to-emerald-600
                hover:from-green-500 hover:to-emerald-500
                shadow-xl shadow-green-500/30 transition-all
                hover:scale-105 active:scale-95 border border-white/20
                cursor-pointer disabled:opacity-50
              "
            >
              {teamPhase === 'web' ? 'Bekreft Web' : 'Start Kamp!'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Mini 2D Canvas Wheel ─────────────────────────────── */

interface MiniWheelProps {
  items: string[];
  displayItems: string[];
  spinning: boolean;
  onResult: (item: string) => void;
  accentColor: string;
}

function MiniWheel({ items, displayItems, spinning, onResult, accentColor }: MiniWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const animRef = useRef<number>(0);
  const spinStateRef = useRef<{
    active: boolean;
    startTime: number;
    duration: number;
    startAngle: number;
    totalSpin: number;
    targetIndex: number;
  }>({
    active: false,
    startTime: 0,
    duration: 0,
    startAngle: 0,
    totalSpin: 0,
    targetIndex: -1,
  });
  const hasTriggeredRef = useRef(false);

  const segmentAngle = (Math.PI * 2) / items.length;

  const draw = useCallback(
    (rotation: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const size = canvas.width;
      const cx = size / 2;
      const cy = size / 2;
      const radius = size / 2 - 20;

      ctx.clearRect(0, 0, size, size);

      // Draw segments
      items.forEach((item, i) => {
        const startA = rotation + i * segmentAngle;
        const endA = startA + segmentAngle;

        // Segment fill
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startA, endA);
        ctx.closePath();
        ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
        ctx.fill();

        // Segment border
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Text — use display name (first name / disambiguated)
        const label = displayItems[i] || item;
        const midA = startA + segmentAngle / 2;
        const textR = radius * 0.65;
        ctx.save();
        ctx.translate(cx + Math.cos(midA) * textR, cy + Math.sin(midA) * textR);
        ctx.rotate(midA + Math.PI / 2);
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.min(18, 170 / items.length)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const displayName = label.length > 14 ? label.slice(0, 13) + '…' : label;
        ctx.fillText(displayName, 0, 0);
        ctx.restore();
      });

      // Center cap
      ctx.beginPath();
      ctx.arc(cx, cy, 24, 0, Math.PI * 2);
      ctx.fillStyle = '#1a1a2e';
      ctx.fill();

      // Outer ring
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Pointer (top)
      ctx.beginPath();
      ctx.moveTo(cx, cy - radius - 12);
      ctx.lineTo(cx - 10, cy - radius - 28);
      ctx.lineTo(cx + 10, cy - radius - 28);
      ctx.closePath();
      ctx.fillStyle = '#ff4444';
      ctx.fill();
    },
    [items, displayItems, segmentAngle]
  );

  // Initial draw
  useEffect(() => {
    draw(rotationRef.current);
  }, [draw]);

  // Spin animation
  useEffect(() => {
    if (!spinning) return;

    const targetIndex = Math.floor(Math.random() * items.length);
    const targetAngle = targetIndex * segmentAngle + segmentAngle / 2;
    const totalSpin = Math.PI * 10 + (Math.PI * 2 - targetAngle) - Math.PI / 2;

    spinStateRef.current = {
      active: true,
      startTime: performance.now(),
      duration: 3000 + Math.random() * 1500,
      startAngle: rotationRef.current,
      totalSpin,
      targetIndex,
    };
    hasTriggeredRef.current = false;

    const animate = (time: number) => {
      const state = spinStateRef.current;
      if (!state.active) return;

      const elapsed = time - state.startTime;
      const progress = Math.min(elapsed / state.duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      rotationRef.current = state.startAngle + state.totalSpin * eased;
      draw(rotationRef.current);

      if (progress >= 1) {
        state.active = false;
        if (!hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          onResult(items[state.targetIndex]);
        }
        return;
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [spinning, items, segmentAngle, draw, onResult]);

  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
  const displaySize = 400;

  return (
    <canvas
      ref={canvasRef}
      width={displaySize * dpr}
      height={displaySize * dpr}
      style={{ width: displaySize, height: displaySize }}
    />
  );
}
