export interface Participant {
  id: string;
  name: string;
  team: 'web' | 'devops';
  funFact?: string;
  superpower?: string;
  imageUrl?: string;
  auraPoints?: number;
  createdAt?: string;
}

export interface Game {
  id: string;
  name: string;
  rules: string;
  time: number;
  playersPerTeam: number; // 0 = all, 1/2/3 = specific count
  points: number;         // points awarded for winning
  visible: boolean;
  createdAt?: string;
}

export interface GameResult {
  id: string;
  gameId: string;
  gameName: string;
  winner: 'web' | 'devops';
  webPlayers: string;    // comma-separated names
  devopsPlayers: string; // comma-separated names
  points: number;        // points that were awarded
  timestamp: string;
}

export type GameFlowPhase =
  | 'idle'
  | 'spinning'
  | 'reveal'
  | 'player-select'
  | 'active'
  | 'result'
  | 'victory';
