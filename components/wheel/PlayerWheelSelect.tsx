'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { WHEEL_COLORS } from '@/lib/constants';
import type { Participant } from '@/lib/types';

interface PlayerWheelSelectProps {
  webPlayers: Participant[];
  devopsPlayers: Participant[];
  usedPlayerNames: Set<string>;
  onSelect: (webPlayer: string, devopsPlayer: string) => void;
  onBack: () => void;
}

type Step = 'spin-web' | 'result-web' | 'spin-devops' | 'result-devops';

export default function PlayerWheelSelect({
  webPlayers,
  devopsPlayers,
  usedPlayerNames,
  onSelect,
  onBack,
}: PlayerWheelSelectProps) {
  const [step, setStep] = useState<Step>('spin-web');
  const [chosenWeb, setChosenWeb] = useState('');
  const [chosenDevops, setChosenDevops] = useState('');
  const [spinning, setSpinning] = useState(false);

  const availableWeb = webPlayers.filter((p) => !usedPlayerNames.has(p.name));
  const availableDevops = devopsPlayers.filter((p) => !usedPlayerNames.has(p.name));

  const handleWebResult = useCallback((name: string) => {
    setChosenWeb(name);
    setSpinning(false);
    setStep('result-web');
  }, []);

  const handleDevopsResult = useCallback((name: string) => {
    setChosenDevops(name);
    setSpinning(false);
    setStep('result-devops');
  }, []);

  const currentPlayers = step.includes('web') ? availableWeb : availableDevops;
  const teamLabel = step.includes('web') ? '🌐 Web' : '🔧 DevOps';
  const teamColor = step.includes('web') ? '#6366f1' : '#f97316';

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div className="relative flex flex-col items-center max-w-lg w-full">
        <h2 className="font-display text-3xl mb-2 text-white">Velg Spillere</h2>
        <p className="font-body text-white/60 mb-4">
          {step === 'spin-web' && 'Spin for å velge Web-spiller'}
          {step === 'result-web' && `Web: ${chosenWeb} — Godta eller spin igjen`}
          {step === 'spin-devops' && 'Spin for å velge DevOps-spiller'}
          {step === 'result-devops' && `DevOps: ${chosenDevops} — Godta eller spin igjen`}
        </p>

        {/* The wheel */}
        {currentPlayers.length > 0 ? (
          <MiniWheel
            key={step.includes('web') ? 'web' : 'devops'}
            items={currentPlayers.map((p) => p.name)}
            spinning={spinning}
            onResult={step.includes('web') ? handleWebResult : handleDevopsResult}
            accentColor={teamColor}
          />
        ) : (
          <div className="w-96 h-96 rounded-full bg-white/5 flex items-center justify-center">
            <p className="text-yellow-400 font-body text-sm text-center px-4">
              Ingen tilgjengelige {step.includes('web') ? 'web' : 'devops'}-spillere
            </p>
          </div>
        )}

        {/* Chosen players summary */}
        {(chosenWeb || chosenDevops) && (
          <div className="flex gap-4 mt-4 font-body text-sm">
            {chosenWeb && (
              <span className="px-3 py-1 rounded-full bg-web-primary/20 text-web-primary">
                🌐 {chosenWeb}
              </span>
            )}
            {chosenDevops && (
              <span className="px-3 py-1 rounded-full bg-devops-primary/20 text-devops-primary">
                🔧 {chosenDevops}
              </span>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              if (step === 'spin-web' || step === 'result-web') {
                onBack();
              } else {
                setChosenDevops('');
                setStep('result-web');
              }
            }}
            className="px-6 py-3 rounded-full font-body text-sm text-white/60 hover:text-white bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
          >
            Tilbake
          </button>

          {(step === 'spin-web' || step === 'spin-devops') && currentPlayers.length > 0 && (
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
              SPIN {teamLabel}
            </button>
          )}

          {step === 'result-web' && (
            <>
              <button
                onClick={() => {
                  setChosenWeb('');
                  setStep('spin-web');
                }}
                className="px-6 py-3 rounded-full font-body text-sm text-white/60 hover:text-white bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
              >
                Spin igjen
              </button>
              <button
                onClick={() => setStep('spin-devops')}
                className="
                  px-8 py-3 rounded-full font-display text-lg tracking-wider
                  bg-gradient-to-r from-green-600 to-emerald-600
                  hover:from-green-500 hover:to-emerald-500
                  shadow-xl shadow-green-500/30 transition-all
                  hover:scale-105 active:scale-95 border border-white/20 cursor-pointer
                "
              >
                Godta
              </button>
            </>
          )}

          {step === 'result-devops' && (
            <>
              <button
                onClick={() => {
                  setChosenDevops('');
                  setStep('spin-devops');
                }}
                className="px-6 py-3 rounded-full font-body text-sm text-white/60 hover:text-white bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
              >
                Spin igjen
              </button>
              <button
                onClick={() => onSelect(chosenWeb, chosenDevops)}
                className="
                  px-8 py-3 rounded-full font-display text-lg tracking-wider
                  bg-gradient-to-r from-green-600 to-emerald-600
                  hover:from-green-500 hover:to-emerald-500
                  shadow-xl shadow-green-500/30 transition-all
                  hover:scale-105 active:scale-95 border border-white/20 cursor-pointer
                "
              >
                Start Kamp!
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Mini 2D Canvas Wheel ─────────────────────────────── */

interface MiniWheelProps {
  items: string[];
  spinning: boolean;
  onResult: (item: string) => void;
  accentColor: string;
}

function MiniWheel({ items, spinning, onResult, accentColor }: MiniWheelProps) {
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

        // Text
        const midA = startA + segmentAngle / 2;
        const textR = radius * 0.65;
        ctx.save();
        ctx.translate(cx + Math.cos(midA) * textR, cy + Math.sin(midA) * textR);
        ctx.rotate(midA + Math.PI / 2);
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.min(18, 170 / items.length)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Truncate long names
        const displayName = item.length > 12 ? item.slice(0, 11) + '…' : item;
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
    [items, segmentAngle]
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
    // Pointer is at top (–π/2), spin so target segment is under pointer
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
