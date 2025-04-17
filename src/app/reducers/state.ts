import { RouterState } from 'react-router-redux';
import { CoinValue, Position, DialogState, AIThoughtEntry } from 'app/models';

export interface RootState {
  router: RouterState;
  game: GameState;
  dialog: DialogState;
}

export interface GameState {
  coins: CoinValue[][];
  candidates: CoinValue[];
  savedCoin: CoinValue;
  lastPos: Position;
  available: Position[];
  score: number;
  log: string;
  isReplay: boolean;
  totalMove: number;
  gameOver: boolean;
  aiThoughts: AIThoughtEntry[];
}
