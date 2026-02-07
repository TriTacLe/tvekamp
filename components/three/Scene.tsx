'use client';

import { Canvas } from '@react-three/fiber';
import Satellite from './Satellite';
import Confetti3D from './Confetti3D';
import { useGameSession } from '@/hooks/useGameSession';
import { StarsBackground } from '@/components/ui/stars-background';
import { ShootingStars } from '@/components/ui/shooting-stars';

export default function Scene() {
  const { showConfetti, animationEnabled } = useGameSession();

  if (!animationEnabled) return null;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" style={{ background: '#0f0f1a' }}>
      {/* Aceternity UI: twinkling stars canvas */}
      <StarsBackground
        starDensity={0.00025}
        allStarsTwinkle
        twinkleProbability={0.8}
        minTwinkleSpeed={0.3}
        maxTwinkleSpeed={1.2}
      />
      {/* Aceternity UI: shooting star streaks */}
      <ShootingStars
        starColor="#6366f1"
        trailColor="#8b5cf6"
        minSpeed={15}
        maxSpeed={35}
        minDelay={800}
        maxDelay={3000}
        starWidth={12}
        starHeight={1}
      />
      <ShootingStars
        starColor="#f97316"
        trailColor="#22c55e"
        minSpeed={10}
        maxSpeed={25}
        minDelay={2000}
        maxDelay={5000}
        starWidth={8}
        starHeight={1}
      />
      {/* 3D elements: satellite + confetti */}
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, 5]} intensity={0.3} color="#6366f1" />
        <Satellite />
        <Confetti3D active={showConfetti} />
      </Canvas>
    </div>
  );
}
