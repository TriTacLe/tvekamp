'use client';

import { useState } from 'react';
import { useParticipants } from '@/hooks/useParticipants';
import { useResults } from '@/hooks/useResults';
import TeamGrid from '@/components/participants/TeamGrid';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

export default function ParticipantsPage() {
  const { webPlayers, devopsPlayers, loading, addParticipant, deleteParticipant } = useParticipants();
  const { webWins, devopsWins } = useResults();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [team, setTeam] = useState<'web' | 'devops'>('web');
  const [funFact, setFunFact] = useState('');
  const [superpower, setSuperpower] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await addParticipant({ name: name.trim(), team, funFact: funFact.trim(), superpower: superpower.trim() });
      setName('');
      setFunFact('');
      setSuperpower('');
      setShowAdd(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteParticipant(id);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white/50 font-body">Laster deltakere...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-3xl">Deltakere</h2>
        <Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>
          + Legg til
        </Button>
      </div>

      <TeamGrid
        webPlayers={webPlayers}
        devopsPlayers={devopsPlayers}
        webWins={webWins}
        devopsWins={devopsWins}
        onDelete={handleDelete}
      />

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Legg til deltaker">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/50 mb-1 font-body">Navn</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Skriv navn..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-body focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1 font-body">Lag</label>
            <div className="flex gap-2">
              <button
                onClick={() => setTeam('web')}
                className={`flex-1 py-2 rounded-lg font-body text-sm transition-all cursor-pointer ${
                  team === 'web' ? 'bg-web-primary text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                Web
              </button>
              <button
                onClick={() => setTeam('devops')}
                className={`flex-1 py-2 rounded-lg font-body text-sm transition-all cursor-pointer ${
                  team === 'devops' ? 'bg-devops-primary text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                DevOps
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1 font-body">Superkraft</label>
            <input
              type="text"
              value={superpower}
              onChange={(e) => setSuperpower(e.target.value)}
              placeholder="F.eks. CSS-mester"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-body focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1 font-body">Fun fact</label>
            <input
              type="text"
              value={funFact}
              onChange={(e) => setFunFact(e.target.value)}
              placeholder="Noe morsomt..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-body focus:outline-none focus:border-purple-500"
            />
          </div>
          <Button variant="primary" onClick={handleAdd} disabled={!name.trim() || submitting} className="w-full">
            {submitting ? 'Legger til...' : 'Legg til'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
