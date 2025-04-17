import { v4 as uuidv4 } from 'uuid';
import { GameState } from 'app/reducers/state';
import { CoinValue, Position, NextCoinType } from 'app/models';

const SAVED_GAME_KEY = 'SAVED_GAME_V0';
const BEST_SCORE_KEY = 'BEST_SCORE_V0';
const UUID_KEY = 'UUID_VALUE_V0';
const GAME_SIZE_KEY = 'GAME_SIZE_V0';
const GAME_PRESET_KEY = 'GAME_PRESET_V0';
const GAME_POS_KEY = 'GAME_POS_V0';
const NEXT_COIN_TYPE_KEY = 'NEXT_COIN_TYPE_V0';

export namespace Storage {
  export function getSavedGame(): GameState | null {
    try {
      const game = localStorage.getItem(SAVED_GAME_KEY);
      if (game != null) {
        return JSON.parse(game) as GameState;
      }
      return game;
    } catch {
      return null;
    }
  }

  export function saveGame(game: GameState): void {
    try {
      localStorage.setItem(SAVED_GAME_KEY, JSON.stringify(game));
    } catch {}
  }

  export function resetSavedGame(): void {
    try {
      localStorage.removeItem(SAVED_GAME_KEY);
    } catch {}
  }

  export function getBestScore(): number {
    try {
      const bestScore = localStorage.getItem(BEST_SCORE_KEY);
      if (bestScore != null) {
        return parseInt(bestScore, 10);
      }
      return 0;
    } catch {
      return 0;
    }
  }

  export function setBestScore(score: number): void {
    try {
      const bestScore = Math.max(getBestScore(), score);
      localStorage.setItem(BEST_SCORE_KEY, JSON.stringify(bestScore));
    } catch {}
  }

  export function getUUID(): string {
    try {
      let uuid = localStorage.getItem(UUID_KEY);
      if (uuid == null) {
        uuid = uuidv4();
        localStorage.setItem(UUID_KEY, uuid);
      }
      return uuid;
    } catch {
      return uuidv4();
    }
  }

  export function getGameSize(): number {
    try {
      const gameSize = localStorage.getItem(GAME_SIZE_KEY);
      if (gameSize != null) {
        return parseInt(gameSize, 10);
      }

      return 6;
    } catch {
      return 6;
    }
  }

  export function setGameSize(size: number): void {
    try {
      localStorage.setItem(GAME_SIZE_KEY, JSON.stringify(size));
    } catch {}
  }

  export function getGamePreset(): CoinValue[][] | null {
    try {
      const gamePreset = localStorage.getItem(GAME_PRESET_KEY);
      if (gamePreset != null) {
        return JSON.parse(gamePreset);
      }

      return null;
    } catch {
      return null;
    }
  }

  export function setGamePreset(preset: CoinValue[][]): void {
    try {
      localStorage.setItem(GAME_PRESET_KEY, JSON.stringify(preset));
    } catch {}
  }

  export function getGamePos(): Position | null {
    try {
      const gamePos = localStorage.getItem(GAME_POS_KEY);
      if (gamePos != null) {
        return JSON.parse(gamePos) as Position;
      }

      return null;
    } catch {
      return null;
    }
  }

  export function setGamePos(pos: Position): void {
    try {
      localStorage.setItem(GAME_POS_KEY, JSON.stringify(pos));
    } catch {}
  }

  export function getNextCoinType(): NextCoinType {
    try {
      const gamePos = localStorage.getItem(NEXT_COIN_TYPE_KEY);
      if (gamePos != null) {
        return JSON.parse(gamePos) as NextCoinType;
      }

      return 1;
    } catch {
      return 1;
    }
  }

  export function setNextCoinType(type: NextCoinType): void {
    try {
      localStorage.setItem(NEXT_COIN_TYPE_KEY, JSON.stringify(type));
    } catch {}
  }
}
