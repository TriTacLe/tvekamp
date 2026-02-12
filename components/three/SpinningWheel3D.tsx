"use client";

import { useRef, useMemo, useCallback, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { WHEEL_COLORS } from "@/lib/constants";
import type { Game } from "@/lib/types";

interface SpinningWheel3DProps {
  games: Game[];
  spinning: boolean;
  onSpinComplete: (game: Game) => void;
}

const RADIUS = 2.8;
const DEPTH = 0.25;

/** Short display names for the wheel */
const ABBREVS: Record<string, string> = {
  "Stein, Saks, Papir": "Saks Papir",
  "Første man til micen": "Til micen",
  "Gjett gjenstander": "Gjett gjenst.",
  "Speed Debugging": "Debugging",
  "Blitz Typeracer": "Typeracer",
  "Stirrekonkurranse": "Stirring",
  "Emoji-gjetting": "Emoji",
  "Nynne med vann": "Nynne",
  "Lefse-smack": "Lefse",
  "Musikkquiz": "Musikk",
};

function getLabel(name: string, maxLen: number): string {
  const short = ABBREVS[name] || name;
  if (short.length <= maxLen) return short;
  return short.slice(0, maxLen - 1) + "…";
}

export default function SpinningWheel3D({
  games,
  spinning,
  onSpinComplete,
}: SpinningWheel3DProps) {
  const wheelRef = useRef<THREE.Group>(null);
  const spinStateRef = useRef({
    isSpinning: false,
    startTime: 0,
    duration: 0,
    startAngle: 0,
    totalSpin: 0,
    targetIndex: -1,
  });

  const n = games.length;
  const segmentAngle = n > 0 ? (Math.PI * 2) / n : Math.PI * 2;

  // Dynamic sizing based on segment count
  const fontSize = Math.min(0.2, 2.2 / n);
  const maxLabelLen = n > 12 ? 10 : n > 8 ? 12 : 16;
  // Place labels along the radial middle of each segment, reading outward
  const labelR = RADIUS * 0.58;

  const segments = useMemo(() => {
    if (n === 0) return [];
    return games.map((game, i) => {
      const shape = new THREE.Shape();
      const startAngle = i * segmentAngle;
      const endAngle = startAngle + segmentAngle;
      shape.moveTo(0, 0);
      const steps = 48;
      for (let s = 0; s <= steps; s++) {
        const a = startAngle + (s / steps) * (endAngle - startAngle);
        shape.lineTo(Math.cos(a) * RADIUS, Math.sin(a) * RADIUS);
      }
      shape.lineTo(0, 0);

      return {
        shape,
        color: WHEEL_COLORS[i % WHEEL_COLORS.length],
        game,
        midAngle: startAngle + segmentAngle / 2,
      };
    });
  }, [games, n, segmentAngle]);

  // Border lines between segments
  const borderLines = useMemo(() => {
    if (n === 0) return [];
    return games.map((_, i) => {
      const a = i * segmentAngle;
      return {
        start: new THREE.Vector3(0, 0, DEPTH + 0.01),
        end: new THREE.Vector3(
          Math.cos(a) * RADIUS,
          Math.sin(a) * RADIUS,
          DEPTH + 0.01
        ),
      };
    });
  }, [n, segmentAngle, games]);

  const startSpin = useCallback(() => {
    if (n === 0) return;
    const targetIndex = Math.floor(Math.random() * n);
    const currentAngle = wheelRef.current?.rotation.z ?? 0;
    const targetAngle = targetIndex * segmentAngle + segmentAngle / 2;
    const totalSpin =
      Math.PI * 10 + (Math.PI * 2 - targetAngle) + Math.PI / 2;

    spinStateRef.current = {
      isSpinning: true,
      startTime: -1,
      duration: 4 + Math.random() * 2,
      startAngle: currentAngle,
      totalSpin,
      targetIndex,
    };
  }, [n, segmentAngle]);

  useEffect(() => {
    if (spinning) startSpin();
  }, [spinning, startSpin]);

  useFrame(({ clock }) => {
    const state = spinStateRef.current;
    if (!state.isSpinning || !wheelRef.current) return;

    if (state.startTime < 0) state.startTime = clock.getElapsedTime();
    const elapsed = clock.getElapsedTime() - state.startTime;
    const progress = Math.min(elapsed / state.duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    wheelRef.current.rotation.z = state.startAngle + state.totalSpin * eased;

    if (progress >= 1) {
      state.isSpinning = false;
      onSpinComplete(games[state.targetIndex]);
    }
  });

  if (n === 0) {
    return (
      <group>
        <mesh>
          <circleGeometry args={[RADIUS, 64]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        <Text
          position={[0, 0, 0.1]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Ingen spill
        </Text>
      </group>
    );
  }

  return (
    <group>
      {/* Wheel body */}
      <group ref={wheelRef}>
        {segments.map((seg, i) => (
          <group key={i}>
            {/* Segment */}
            <mesh>
              <extrudeGeometry
                args={[
                  seg.shape,
                  {
                    depth: DEPTH,
                    bevelEnabled: true,
                    bevelThickness: 0.015,
                    bevelSize: 0.015,
                  },
                ]}
              />
              <meshStandardMaterial
                color={seg.color}
                roughness={0.4}
                metalness={0.1}
              />
            </mesh>

            {/* Label — rotated to read radially outward */}
            <Text
              position={[
                Math.cos(seg.midAngle) * labelR,
                Math.sin(seg.midAngle) * labelR,
                DEPTH + 0.02,
              ]}
              rotation={[0, 0, seg.midAngle]}
              fontSize={fontSize}
              maxWidth={RADIUS * 0.45}
              color="white"
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
              outlineWidth={0.015}
              outlineColor="#000000"
            >
              {getLabel(seg.game.name, maxLabelLen)}
            </Text>
          </group>
        ))}

        {/* Segment border lines */}
        {borderLines.map((line, i) => (
          <line key={`border-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[
                  new Float32Array([
                    line.start.x, line.start.y, line.start.z,
                    line.end.x, line.end.y, line.end.z,
                  ]),
                  3,
                ]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#ffffff" opacity={0.25} transparent />
          </line>
        ))}

        {/* Center cap — dark with ring */}
        <mesh position={[0, 0, DEPTH + 0.02]}>
          <circleGeometry args={[0.45, 48]} />
          <meshStandardMaterial
            color="#0f0f1a"
            roughness={0.3}
            metalness={0.4}
          />
        </mesh>
        <mesh position={[0, 0, DEPTH + 0.03]}>
          <ringGeometry args={[0.4, 0.45, 48]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={0.3}
            roughness={0.2}
            metalness={0.6}
          />
        </mesh>
      </group>

      {/* Pointer (top) */}
      <mesh
        position={[0, RADIUS + 0.05, DEPTH / 2 + 0.1]}
        rotation={[0, 0, Math.PI]}
      >
        <coneGeometry args={[0.25, 0.55, 3]} />
        <meshStandardMaterial
          color="#ff3333"
          emissive="#ff2222"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>

      {/* Outer ring — golden */}
      <mesh position={[0, 0, DEPTH / 2]}>
        <ringGeometry args={[RADIUS, RADIUS + 0.1, 64]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={0.15}
          roughness={0.2}
          metalness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
