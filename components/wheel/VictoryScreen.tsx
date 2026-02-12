'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const VICTORY_IMAGES = [
  '/images/tvekamp.png',
  '/images/image.png',
  '/images/Web-win1.png',
  '/images/devops-vs-web.webp',
  '/images/web-v-devops.webp',
  '/images/web-v-devops1.webp',
  '/images/web-vs-dev.webp',
];

interface VictoryScreenProps {
  winnerTeam: 'web' | 'devops';
  winnerNames: string[];
  points: number;
  onDismiss: () => void;
}

export default function VictoryScreen({ winnerTeam, winnerNames, points, onDismiss }: VictoryScreenProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setImageIndex((prev) => (prev + 1) % VICTORY_IMAGES.length);
        setFading(false);
      }, 300);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const teamLabel = winnerTeam === 'web' ? 'Team Web' : 'Team DevOps';
  const teamGradient = winnerTeam === 'web'
    ? 'from-web-primary to-web-secondary'
    : 'from-devops-primary to-devops-secondary';

  const displayNames = winnerNames.length > 3
    ? teamLabel
    : winnerNames.map((n) => n.split(' ')[0]).join(', ');

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Rotating image */}
      <div className="relative w-80 h-80 md:w-96 md:h-96 mb-8">
        <Image
          src={VICTORY_IMAGES[imageIndex]}
          alt="Victory"
          fill
          className={`object-contain transition-opacity duration-300 ${fading ? 'opacity-0' : 'opacity-100'}`}
          unoptimized
        />
      </div>

      {/* Winner info */}
      <div className="text-center mb-8">
        <h2 className="font-display text-5xl md:text-6xl tracking-wider mb-3">
          <span className={`bg-gradient-to-r ${teamGradient} bg-clip-text text-transparent`}>
            VINNER!
          </span>
        </h2>
        <p className="font-display text-3xl text-white">{displayNames}</p>
        <p className={`font-body text-xl mt-1 bg-gradient-to-r ${teamGradient} bg-clip-text text-transparent`}>
          {teamLabel}
        </p>
        <p className="font-body text-lg mt-2 text-yellow-400">+{points} poeng</p>
      </div>

      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className="
          px-10 py-3 rounded-full
          font-display text-xl tracking-wider
          bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600
          hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500
          shadow-xl shadow-purple-500/40
          transition-all duration-300
          hover:scale-105 active:scale-95
          border border-white/20
          cursor-pointer
        "
      >
        Tilbake til hjulet
      </button>
    </div>
  );
}
