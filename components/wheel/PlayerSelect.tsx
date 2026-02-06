'use client';

import { useState } from 'react';
import type { Participant } from '@/lib/types';
import Button from '@/components/ui/Button';

interface PlayerSelectProps {
  webPlayers: Participant[];
  devopsPlayers: Participant[];
  usedPlayerNames: Set<string>;
  onSelect: (webPlayer: string, devopsPlayer: string) => void;
  onBack: () => void;
}

export default function PlayerSelect({
  webPlayers,
  devopsPlayers,
  usedPlayerNames,
  onSelect,
  onBack,
}: PlayerSelectProps) {
  const [web, setWeb] = useState('');
  const [devops, setDevops] = useState('');

  const availableWeb = webPlayers.filter((p) => !usedPlayerNames.has(p.name));
  const availableDevops = devopsPlayers.filter((p) => !usedPlayerNames.has(p.name));

  const canStart = web !== '' && devops !== '';

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div className="relative glass rounded-2xl p-6 max-w-md w-full">
        <h2 className="font-display text-2xl text-center mb-6">Velg Spillere</h2>

        {/* Web player */}
        <div className="mb-4">
          <label className="block text-sm text-white/50 mb-1 font-body">
            🌐 Web-spiller
          </label>
          <select
            value={web}
            onChange={(e) => setWeb(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-body focus:outline-none focus:border-web-primary"
          >
            <option value="">Velg spiller...</option>
            {availableWeb.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
          {availableWeb.length === 0 && (
            <p className="text-xs text-yellow-400 mt-1">Alle web-spillere er brukt denne runden</p>
          )}
        </div>

        {/* DevOps player */}
        <div className="mb-6">
          <label className="block text-sm text-white/50 mb-1 font-body">
            🔧 DevOps-spiller
          </label>
          <select
            value={devops}
            onChange={(e) => setDevops(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-body focus:outline-none focus:border-devops-primary"
          >
            <option value="">Velg spiller...</option>
            {availableDevops.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
          {availableDevops.length === 0 && (
            <p className="text-xs text-yellow-400 mt-1">
              Alle DevOps-spillere er brukt denne runden
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={onBack} className="flex-1">
            Tilbake
          </Button>
          <Button
            variant="primary"
            onClick={() => onSelect(web, devops)}
            disabled={!canStart}
            className="flex-1"
          >
            Start Kamp!
          </Button>
        </div>
      </div>
    </div>
  );
}
