export interface Participant {
  id: string;
  name: string;
  team: 'web' | 'devops';
  funFact?: string;
  superpower?: string;
  imageUrl?: string;
  createdAt?: string;
}

export interface Game {
  id: string;
  name: string;
  rules: string;
  time: number;
  players: number;
  visible: boolean;
  createdAt?: string;
}

export interface GameResult {
  id: string;
  gameId: string;
  gameName: string;
  winner: 'web' | 'devops';
  webPlayer: string;
  devopsPlayer: string;
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
