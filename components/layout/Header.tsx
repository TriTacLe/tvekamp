'use client';

import { useGameSession } from '@/hooks/useGameSession';

export default function Header() {
  const { animationEnabled, toggleAnimation } = useGameSession();

  return (
    <header className="relative z-10 pt-6 pb-2 text-center">
      <h1 className="font-display text-5xl md:text-7xl tracking-wider">
        <span className="bg-gradient-to-r from-web-primary via-purple-400 to-devops-primary bg-clip-text text-transparent">
          TVEKAMP
        </span>
      </h1>
      <p className="font-body text-sm text-white/50 mt-1">Web vs DevOps</p>

      <button
        onClick={toggleAnimation}
        className="absolute top-6 right-4 text-white/40 hover:text-white/80 transition-colors text-sm font-body flex items-center gap-1.5"
        title={animationEnabled ? 'Skru av animasjon' : 'Skru på animasjon'}
      >
        <span className={`w-8 h-4 rounded-full relative inline-block transition-colors ${animationEnabled ? 'bg-web-primary/60' : 'bg-white/10'}`}>
          <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${animationEnabled ? 'left-4' : 'left-0.5'}`} />
        </span>
        <span className="hidden sm:inline">3D</span>
      </button>
    </header>
  );
}
