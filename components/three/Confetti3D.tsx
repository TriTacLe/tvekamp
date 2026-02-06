'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Confetti3DProps {
  active: boolean;
}

export default function Confetti3D({ active }: Confetti3DProps) {
  const ref = useRef<THREE.Points>(null);
  const count = 200;

  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      [0.39, 0.4, 0.95],  // indigo
      [0.55, 0.36, 0.96], // violet
      [0.98, 0.45, 0.09], // orange
      [0.13, 0.77, 0.37], // green
      [1, 0.84, 0.04],    // gold
      [0.93, 0.29, 0.6],  // pink
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 1] = Math.random() * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      vel[i * 3] = (Math.random() - 0.5) * 8;
      vel[i * 3 + 1] = Math.random() * 10 + 5;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 8;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];
    }

    return { positions: pos, velocities: vel, colors: col };
  }, []);

  const startTimeRef = useRef(0);
  const activeRef = useRef(false);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    if (active && !activeRef.current) {
      // Reset on new activation
      activeRef.current = true;
      startTimeRef.current = clock.getElapsedTime();
      const attr = ref.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        (attr.array as Float32Array)[i * 3] = (Math.random() - 0.5) * 0.5;
        (attr.array as Float32Array)[i * 3 + 1] = 0;
        (attr.array as Float32Array)[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

        velocities[i * 3] = (Math.random() - 0.5) * 8;
        velocities[i * 3 + 1] = Math.random() * 10 + 5;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 8;
      }
      attr.needsUpdate = true;
    }

    if (!active) {
      activeRef.current = false;
    }

    if (activeRef.current) {
      const elapsed = clock.getElapsedTime() - startTimeRef.current;
      const attr = ref.current.geometry.attributes.position;

      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        (attr.array as Float32Array)[idx] += velocities[idx] * 0.016;
        (attr.array as Float32Array)[idx + 1] += (velocities[idx + 1] - 9.8 * elapsed) * 0.016;
        (attr.array as Float32Array)[idx + 2] += velocities[idx + 2] * 0.016;
      }
      attr.needsUpdate = true;

      // Fade out
      const mat = ref.current.material as THREE.PointsMaterial;
      mat.opacity = Math.max(0, 1 - elapsed / 3);

      if (elapsed > 3) {
        activeRef.current = false;
      }
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.15} vertexColors transparent opacity={0} sizeAttenuation />
    </points>
  );
}
