'use client';

import { useState } from 'react';
import { useGames } from '@/hooks/useGames';
import GamesList from '@/components/games/GamesList';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

export default function GamesPage() {
  const { games, loading, addGame, deleteGame } = useGames();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [rules, setRules] = useState('');
  const [time, setTime] = useState(5);
  const [playersPerTeam, setPlayersPerTeam] = useState(1);
  const [points, setPoints] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async () => {
    if (!name.trim() || !rules.trim()) return;
    setSubmitting(true);
    try {
      await addGame({ name: name.trim(), rules: rules.trim(), time, playersPerTeam, points });
      setName('');
      setRules('');
      setTime(5);
      setPlayersPerTeam(1);
      setPoints(1);
      setShowAdd(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGame(id);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white/50 font-body">Laster spill...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-3xl">Alle Spill</h2>
        <Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>
          + Legg til
        </Button>
      </div>

      <GamesList games={games} onDelete={handleDelete} />

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Legg til spill">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/50 mb-1 font-body">Navn</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Spillnavn..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-body focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1 font-body">Regler</label>
            <textarea
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              placeholder="Beskriv reglene..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-body focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-white/50 mb-1 font-body">Tid (min)</label>
              <input
                type="number"
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
                min={1}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-body focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1 font-body">Per lag (0=alle)</label>
              <input
                type="number"
                value={playersPerTeam}
                onChange={(e) => setPlayersPerTeam(Number(e.target.value))}
                min={0}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-body focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1 font-body">Poeng</label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                min={1}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-body focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
          <Button variant="primary" onClick={handleAdd} disabled={!name.trim() || !rules.trim() || submitting} className="w-full">
            {submitting ? 'Legger til...' : 'Legg til'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
