'use client';

import { useEffect, type ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function Modal({ open, onClose, children, title }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {title && (
          <h2 className="font-display text-2xl mb-4 text-center">{title}</h2>
        )}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/50 hover:text-white text-xl"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
