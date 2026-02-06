'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Participant } from '@/lib/types';

export function useParticipants() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchParticipants = useCallback(async () => {
    try {
      const res = await fetch('/api/participants');
      const data = await res.json();
      setParticipants(data);
    } catch (err) {
      console.error('Failed to fetch participants:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  const addParticipant = useCallback(async (data: { name: string; team: 'web' | 'devops'; funFact?: string; superpower?: string }) => {
    const res = await fetch('/api/participants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add participant');
    const newP = await res.json();
    setParticipants((prev) => [...prev, newP]);
    return newP;
  }, []);

  const deleteParticipant = useCallback(async (id: string) => {
    const res = await fetch(`/api/participants?id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete participant');
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const webPlayers = participants.filter((p) => p.team === 'web');
  const devopsPlayers = participants.filter((p) => p.team === 'devops');

  return { participants, webPlayers, devopsPlayers, loading, refetch: fetchParticipants, addParticipant, deleteParticipant };
}
