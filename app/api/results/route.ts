import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_PATH = path.join(process.cwd(), 'data', 'results.json');

function readResults() {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeResults(data: unknown) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export async function GET() {
  const results = readResults();
  return NextResponse.json(results);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { gameId, gameName, winner, webPlayer, devopsPlayer } = body;

  if (!gameId || !gameName || !winner || !webPlayer || !devopsPlayer) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const results = readResults();
  const newResult = {
    id: uuidv4(),
    gameId,
    gameName,
    winner,
    webPlayer,
    devopsPlayer,
    timestamp: new Date().toISOString(),
  };

  results.push(newResult);
  writeResults(results);

  return NextResponse.json(newResult, { status: 201 });
}
