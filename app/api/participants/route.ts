import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getData, setData } from '@/lib/storage';
import type { Participant } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const participants = await getData<Participant>('participants');
  return NextResponse.json(participants);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, team, funFact, superpower } = body;

  if (!name || !team) {
    return NextResponse.json({ error: 'name and team are required' }, { status: 400 });
  }

  const participants = await getData<Participant>('participants');
  const newParticipant: Participant = {
    id: uuidv4(),
    name,
    team,
    funFact: funFact || '',
    superpower: superpower || '',
    createdAt: new Date().toISOString(),
  };

  participants.push(newParticipant);
  await setData('participants', participants);

  return NextResponse.json(newParticipant, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const participants = await getData<Participant>('participants');
  const filtered = participants.filter((p) => p.id !== id);

  if (filtered.length === participants.length) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  await setData('participants', filtered);
  return NextResponse.json({ success: true });
}
