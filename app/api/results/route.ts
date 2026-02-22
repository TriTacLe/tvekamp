import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getData, setData } from '@/lib/storage';
import type { GameResult, Participant } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results = await getData<GameResult>('results');
  return NextResponse.json(results);
}

export async function DELETE() {
  await setData('results', []);
  return NextResponse.json({ success: true });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { gameId, gameName, winner, webPlayers, devopsPlayers, points } = body;

  if (!gameId || !gameName || !winner || !webPlayers || !devopsPlayers) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const auraPoints = points || 1;

  const results = await getData<GameResult>('results');
  const newResult: GameResult = {
    id: uuidv4(),
    gameId,
    gameName,
    winner,
    webPlayers,
    devopsPlayers,
    points: auraPoints,
    timestamp: new Date().toISOString(),
  };

  results.push(newResult);
  await setData('results', results);

  // Award aura points to winning players
  const winnerPlayers: string[] =
    winner === 'web'
      ? webPlayers.split(',').map((n: string) => n.trim()).filter(Boolean)
      : devopsPlayers.split(',').map((n: string) => n.trim()).filter(Boolean);

  if (winnerPlayers.length > 0) {
    const participants = await getData<Participant>('participants');
    let updated = false;
    const updatedParticipants = participants.map((p) => {
      if (winnerPlayers.includes(p.name)) {
        updated = true;
        return { ...p, auraPoints: (p.auraPoints || 0) + auraPoints };
      }
      return p;
    });
    if (updated) {
      await setData('participants', updatedParticipants);
    }
  }

  return NextResponse.json(newResult, { status: 201 });
}
