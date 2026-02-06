'use client';

import { useRef, useMemo, useCallback, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { WHEEL_COLORS } from '@/lib/constants';
import type { Game } from '@/lib/types';

interface SpinningWheel3DProps {
  games: Game[];
  spinning: boolean;
  onSpinComplete: (game: Game) => void;
}

export default function SpinningWheel3D({ games, spinning, onSpinComplete }: SpinningWheel3DProps) {
  const wheelRef = useRef<THREE.Group>(null);
  const spinStateRef = useRef({
    isSpinning: false,
    startTime: 0,
    duration: 0,
    startAngle: 0,
    totalSpin: 0,
    targetIndex: -1,
  });

  const segmentAngle = games.length > 0 ? (Math.PI * 2) / games.length : Math.PI * 2;

  // Create segments
  const segments = useMemo(() => {
    if (games.length === 0) return [];
    return games.map((game, i) => {
      const shape = new THREE.Shape();
      const startAngle = i * segmentAngle;
      const endAngle = startAngle + segmentAngle;
      const radius = 3;

      shape.moveTo(0, 0);
      const steps = 32;
      for (let s = 0; s <= steps; s++) {
        const angle = startAngle + (s / steps) * (endAngle - startAngle);
        shape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      }
      shape.lineTo(0, 0);

      return {
        shape,
        color: WHEEL_COLORS[i % WHEEL_COLORS.length],
        game,
        midAngle: startAngle + segmentAngle / 2,
      };
    });
  }, [games, segmentAngle]);

  const startSpin = useCallback(() => {
    if (games.length === 0) return;
    const targetIndex = Math.floor(Math.random() * games.length);
    const currentAngle = wheelRef.current?.rotation.z ?? 0;
    // Spin at least 5 full rotations + land on target
    const targetAngle = targetIndex * segmentAngle + segmentAngle / 2;
    const totalSpin = Math.PI * 10 + (Math.PI * 2 - targetAngle) + Math.PI / 2;

    spinStateRef.current = {
      isSpinning: true,
      startTime: -1, // will be set on first frame
      duration: 4 + Math.random() * 2,
      startAngle: currentAngle,
      totalSpin,
      targetIndex,
    };
  }, [games, segmentAngle]);

  useEffect(() => {
    if (spinning) {
      startSpin();
    }
  }, [spinning, startSpin]);

  useFrame(({ clock }) => {
    const state = spinStateRef.current;
    if (!state.isSpinning || !wheelRef.current) return;

    if (state.startTime < 0) {
      state.startTime = clock.getElapsedTime();
    }
    const elapsed = clock.getElapsedTime() - state.startTime;
    const progress = Math.min(elapsed / state.duration, 1);

    // Cubic ease-out
    const eased = 1 - Math.pow(1 - progress, 3);
    wheelRef.current.rotation.z = state.startAngle + state.totalSpin * eased;

    if (progress >= 1) {
      state.isSpinning = false;
      onSpinComplete(games[state.targetIndex]);
    }
  });

  if (games.length === 0) {
    return (
      <group>
        <mesh>
          <circleGeometry args={[3, 64]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        <Text position={[0, 0, 0.1]} fontSize={0.4} color="white" anchorX="center" anchorY="middle">
          Ingen spill
        </Text>
      </group>
    );
  }

  return (
    <group>
      {/* Wheel */}
      <group ref={wheelRef}>
        {segments.map((seg, i) => (
          <group key={i}>
            <mesh>
              <extrudeGeometry
                args={[
                  seg.shape,
                  { depth: 0.3, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02 },
                ]}
              />
              <meshStandardMaterial color={seg.color} />
            </mesh>
            {/* Label */}
            <Text
              position={[
                Math.cos(seg.midAngle) * 1.8,
                Math.sin(seg.midAngle) * 1.8,
                0.35,
              ]}
              rotation={[0, 0, seg.midAngle - Math.PI / 2]}
              fontSize={0.22}
              maxWidth={2}
              color="white"
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
            >
              {seg.game.name}
            </Text>
          </group>
        ))}

        {/* Center cap */}
        <mesh position={[0, 0, 0.35]}>
          <circleGeometry args={[0.4, 32]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
      </group>

      {/* Pointer (top) */}
      <mesh position={[0, 3.3, 0.5]}>
        <coneGeometry args={[0.25, 0.5, 3]} />
        <meshStandardMaterial color="#ff4444" emissive="#ff2222" emissiveIntensity={0.5} />
      </mesh>

      {/* Outer ring */}
      <mesh>
        <ringGeometry args={[3, 3.15, 64]} />
        <meshStandardMaterial color="#ffffff" opacity={0.15} transparent />
      </mesh>
    </group>
  );
}
