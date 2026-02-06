'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Fullscreen video */}
      <video
        ref={videoRef}
        key={VIDEOS[videoIndex]}
        src={VIDEOS[videoIndex]}
        autoPlay
        muted={muted}
        playsInline
        onEnded={handleVideoEnded}
        className="absolute inset-0 w-full h-full object-contain"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/30" />

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
        title={muted ? 'Slå på lyd' : 'Slå av lyd'}
      >
        {muted ? '🔇' : '🔊'}
      </button>

      {/* Start button — using Link for instant prefetched navigation */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center z-10">
        <Link
          href="/play"
          prefetch={true}
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
            text-white no-underline
          "
        >
          START TVEKAMP
        </Link>
      </div>
    </div>
  );
}
