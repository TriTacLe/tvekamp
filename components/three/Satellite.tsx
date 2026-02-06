'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Satellite() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime() * 0.3;
    // Elliptical orbit
    groupRef.current.position.x = Math.cos(t) * 8;
    groupRef.current.position.y = Math.sin(t * 0.7) * 3 + 2;
    groupRef.current.position.z = Math.sin(t) * 5 - 5;
    // Slow tumble
    groupRef.current.rotation.y = t * 0.5;
    groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.2;
  });

  return (
    <group ref={groupRef} scale={0.15}>
      {/* Body */}
      <mesh>
        <boxGeometry args={[1, 1, 1.5]} />
        <meshStandardMaterial color="#8888aa" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Left solar panel */}
      <mesh position={[-2, 0, 0]}>
        <boxGeometry args={[2, 0.05, 1]} />
        <meshStandardMaterial color="#4466ff" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Right solar panel */}
      <mesh position={[2, 0, 0]}>
        <boxGeometry args={[2, 0.05, 1]} />
        <meshStandardMaterial color="#4466ff" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Panel connectors */}
      <mesh position={[-0.9, 0, 0]}>
        <boxGeometry args={[0.3, 0.08, 0.08]} />
        <meshStandardMaterial color="#666" />
      </mesh>
      <mesh position={[0.9, 0, 0]}>
        <boxGeometry args={[0.3, 0.08, 0.08]} />
        <meshStandardMaterial color="#666" />
      </mesh>

      {/* Antenna */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5]} />
        <meshStandardMaterial color="#aaa" />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.06]} />
        <meshStandardMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}
