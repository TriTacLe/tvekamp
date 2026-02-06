'use client';

import { Canvas } from '@react-three/fiber';
import StarField from './StarField';
import Satellite from './Satellite';
import Confetti3D from './Confetti3D';
import { useGameSession } from '@/hooks/useGameSession';

export default function Scene() {
  const { showConfetti, animationEnabled } = useGameSession();

  if (!animationEnabled) return null;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: '#0f0f1a' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, 5]} intensity={0.3} color="#6366f1" />
        <StarField />
        <Satellite />
        <Confetti3D active={showConfetti} />
      </Canvas>
    </div>
  );
}
