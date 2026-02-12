import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getData, setData } from '@/lib/storage';
import type { Game } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const games = await getData<Game>('games');
  return NextResponse.json(games);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, rules, time, playersPerTeam, points } = body;

  if (!name || !rules) {
    return NextResponse.json({ error: 'name and rules are required' }, { status: 400 });
  }

  const games = await getData<Game>('games');
  const newGame: Game = {
    id: uuidv4(),
    name,
    rules,
    time: time || 5,
    playersPerTeam: playersPerTeam ?? 1,
    points: points || 1,
    visible: true,
    createdAt: new Date().toISOString(),
  };

  games.push(newGame);
  await setData('games', games);

  return NextResponse.json(newGame, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const games = await getData<Game>('games');
  const filtered = games.filter((g) => g.id !== id);

  if (filtered.length === games.length) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  await setData('games', filtered);
  return NextResponse.json({ success: true });
}
