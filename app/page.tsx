'use client';

import dynamic from 'next/dynamic';

const VideoLanding = dynamic(() => import('@/components/landing/VideoLanding'), { ssr: false });

export default function HomePage() {
  return <VideoLanding />;
}
