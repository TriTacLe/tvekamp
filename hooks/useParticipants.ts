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

  const webPlayers = participants.filter((p) => p.team === 'web');
  const devopsPlayers = participants.filter((p) => p.team === 'devops');

  return { participants, webPlayers, devopsPlayers, loading, refetch: fetchParticipants };
}
