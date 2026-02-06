import type { Metadata } from 'next';
import { Bangers, Poppins } from 'next/font/google';
import './globals.css';
import { GameSessionProvider } from '@/context/GameSessionContext';
import LayoutShell from '@/components/layout/LayoutShell';
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('@/components/three/Scene'), { ssr: false });

const bangers = Bangers({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bangers',
});

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Tvekamp - Web vs DevOps',
  description: 'Hvem er best? Web eller DevOps? La kampen begynne!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" className={`${bangers.variable} ${poppins.variable}`}>
      <body className="font-body min-h-screen bg-bg-dark text-white antialiased">
        <GameSessionProvider>
          <Scene />
          <LayoutShell>{children}</LayoutShell>
        </GameSessionProvider>
      </body>
    </html>
  );
}
