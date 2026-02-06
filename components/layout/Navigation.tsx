'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="relative z-10 flex justify-center gap-1 px-4 pb-4">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              px-4 py-2 rounded-lg font-body text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? 'bg-white/15 text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }
            `}
          >
            <span className="mr-1.5">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
