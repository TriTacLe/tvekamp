import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getData, setData } from '@/lib/storage';
import type { GameResult } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results = await getData<GameResult>('results');
  return NextResponse.json(results);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { gameId, gameName, winner, webPlayer, devopsPlayer } = body;

  if (!gameId || !gameName || !winner || !webPlayer || !devopsPlayer) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const results = await getData<GameResult>('results');
  const newResult: GameResult = {
    id: uuidv4(),
    gameId,
    gameName,
    winner,
    webPlayer,
    devopsPlayer,
    timestamp: new Date().toISOString(),
  };

  results.push(newResult);
  await setData('results', results);

  return NextResponse.json(newResult, { status: 201 });
}
