'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarLoader } from 'react-spinners';

const VIDEOS = [
  '/videos/grok-video-b6c96f58-786c-4981-abf4-fe6ef5a2b6d8.mp4',
  '/videos/grok-video-b6c96f58-786c-4981-abf4-fe6ef5a2b6d8(1).mp4',
  '/videos/grok-video-b6c96f58-786c-4981-abf4-fe6ef5a2b6d8(2).mp4',
  '/videos/grok-video-b6c96f58-786c-4981-abf4-fe6ef5a2b6d8(3).mp4',
  '/videos/grok-video-b6c96f58-786c-4981-abf4-fe6ef5a2b6d8(4).mp4',
  '/videos/grok-video-b6c96f58-786c-4981-abf4-fe6ef5a2b6d8(5).mp4',
];

export default function VideoLanding() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoIndex, setVideoIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [navigating, setNavigating] = useState(false);

  // Prefetch /play so it's ready when user clicks
  useEffect(() => {
    router.prefetch('/play');
  }, [router]);

  const handleVideoEnded = useCallback(() => {
    setVideoIndex((prev) => (prev + 1) % VIDEOS.length);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => !prev);
  }, []);

  const handleStart = useCallback(() => {
    setNavigating(true);
    router.push('/play');
  }, [router]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Fullscreen video — scaled up to fill more width on landscape screens */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          key={VIDEOS[videoIndex]}
          src={VIDEOS[videoIndex]}
          autoPlay
          muted={muted}
          playsInline
          onEnded={handleVideoEnded}
          className="min-w-full min-h-full object-cover"
          style={{ maxHeight: '120vh', maxWidth: '200vw' }}
        />
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Title */}
      <div className="absolute top-12 left-0 right-0 text-center z-10">
        <h1 className="font-display text-6xl md:text-8xl tracking-wider">
          <span className="bg-gradient-to-r from-web-primary via-purple-400 to-devops-primary bg-clip-text text-transparent drop-shadow-lg">
            TVEKAMP
          </span>
        </h1>
        <p className="font-body text-lg text-white/70 mt-2">Web vs DevOps</p>
      </div>

      {/* Mute/unmute button */}
      <button
        onClick={toggleMute}
        className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors text-2xl"
        title={muted ? 'Sla pa lyd' : 'Sla av lyd'}
      >
        {muted ? '🔇' : '🔊'}
      </button>

      {/* Start button with loading state */}
      <div className="absolute bottom-20 left-0 right-0 flex flex-col items-center gap-4 z-10">
        {navigating ? (
          <div className="flex flex-col items-center gap-4">
            <BarLoader color="#8b5cf6" width={200} height={5} speedMultiplier={0.8} />
            <span className="font-display text-xl text-white/70 tracking-widest">LASTER...</span>
          </div>
        ) : (
          <button
            onClick={handleStart}
            className="
              px-16 py-5 rounded-full
              font-display text-3xl md:text-4xl tracking-widest
              bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600
              hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500
              shadow-2xl shadow-purple-500/50
              transition-all duration-300
              hover:scale-110 active:scale-95
              border border-white/30
              cursor-pointer
              animate-pulse hover:animate-none
              text-white
            "
          >
            START TVEKAMP
          </button>
        )}
      </div>
    </div>
  );
}
