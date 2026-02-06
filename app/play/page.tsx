'use client';

import dynamic from 'next/dynamic';

const SpinWheel = dynamic(() => import('@/components/wheel/SpinWheel'), { ssr: false });

export default function PlayPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <SpinWheel />
    </div>
  );
}
