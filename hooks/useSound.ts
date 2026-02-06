'use client';

import { useCallback, useRef } from 'react';

type SoundType = 'spin' | 'reveal' | 'gameStart' | 'winner' | 'click';

const audioCtxRef: { current: AudioContext | null } = { current: null };

function getAudioContext(): AudioContext {
  if (!audioCtxRef.current) {
    audioCtxRef.current = new AudioContext();
  }
  if (audioCtxRef.current.state === 'suspended') {
    audioCtxRef.current.resume();
  }
  return audioCtxRef.current;
}

function playSynth(type: SoundType) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  switch (type) {
    case 'spin': {
      // Rising frequency sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.5);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
      break;
    }
    case 'reveal': {
      // Ding/chime — two quick notes
      [523, 659, 784].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, now + i * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.4);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.4);
      });
      break;
    }
    case 'gameStart': {
      // Battle horn — low brass sound
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc2.type = 'square';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.setValueAtTime(196, now + 0.3);
      osc2.frequency.setValueAtTime(131, now);
      osc2.frequency.setValueAtTime(197, now + 0.3);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.setValueAtTime(0.15, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.8);
      osc2.stop(now + 0.8);
      break;
    }
    case 'winner': {
      // Victory fanfare — ascending notes
      [523, 659, 784, 1047].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, now + i * 0.15);
        gain.gain.linearRampToValueAtTime(0.12, now + i * 0.15 + 0.02);
        gain.gain.setValueAtTime(0.12, now + i * 0.15 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.5);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 0.5);
      });
      break;
    }
    case 'click': {
      // Subtle click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 1000;
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
      break;
    }
  }
}

export function useSound() {
  const lastPlayed = useRef<number>(0);

  const playSound = useCallback((type: SoundType) => {
    // Debounce: prevent double-plays within 50ms
    const now = Date.now();
    if (now - lastPlayed.current < 50) return;
    lastPlayed.current = now;

    try {
      playSynth(type);
    } catch {
      // Silently fail — audio not supported or blocked
    }
  }, []);

  return { playSound };
}
