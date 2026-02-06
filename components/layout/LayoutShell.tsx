'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Navigation from './Navigation';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  if (isLanding) {
    return <>{children}</>;
  }

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      <Header />
      <Navigation />
      <main className="flex-1 px-4 pb-8">{children}</main>
    </div>
  );
}
