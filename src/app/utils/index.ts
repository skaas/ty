export * from './storage';
export * from './constants';
export * from './nextCoinLogic';
export * from './encode';

import { Position, Directions, CoinValue } from 'app/models';
import { CONST } from 'app/utils/constants';

export function omit<T extends object, K extends keyof T>(target: T, ...omitKeys: K[]): Omit<T, K> {
  return (Object.keys(target) as K[]).reduce(
    (res, key) => {
      if (!omitKeys.includes(key)) {
        (res as any)[key] = target[key];
      }
      return res;
    },
    {} as Omit<T, K>
  );
}

export function keyToOffset(event: KeyboardEvent): Position | null {
  switch (event.keyCode) {
  case 37: // left
    return { row: 0, col: -1 };
  case 38: // up
    return { row: -1, col: 0 };
  case 39: // right
    return { row: 0, col: 1 };
  case 40: // down
    return { row: 1, col: 0 };
  default:
    return null;
  }
}

export function randomSelection<T>(array: T[]): T {
  const length = array.length;

  if (length === 0) {
    throw new Error('Empty Array');
  }

  const index = Math.floor(Math.random() * length);
  return array[index];
}

export function getDirection(from: Position, to: Position): Directions {
  const totalOffset = Math.abs(from.row - to.row) + Math.abs(from.col - to.col);
  if (totalOffset > 1) {
    throw new Error('getDirection support only adjacent position');
  }

  if (to.row - from.row > 0) {
    return Directions.DOWN;
  }
  if (to.row - from.row < 0) {
    return Directions.UP;
  }
  if (to.col - from.col > 0) {
    return Directions.RIGHT;
  }
  return Directions.LEFT;
}

export function containsPos(pos: Position, array: Position[]): boolean {
  let isAvaiable = false;
  array.forEach((rhs) => {
    if (pos.row === rhs.row && pos.col === rhs.col) {
      isAvaiable = true;
      return;
    }
  });

  return isAvaiable;
}

export function getSameAdjacentCoins(curPos: Position, coins: CoinValue[][]): Position[] {

  let result: Position[] = [curPos];
  const row = curPos.row;
  const col = curPos.col;
  const value = coins[row][col];
  coins[row][col] = 0;

  if (value === 0) { return result; }

  // up
  if (row > 0 && coins[row - 1][col] === value) {
    const pos = { col, row: row - 1 };
    result = result.concat(getSameAdjacentCoins(pos, coins));
  }

  // down
  if (row < CONST.GAME_SIZE - 1 && coins[row + 1][col] === value) {
    const pos = { col, row: row + 1 };
    result = result.concat(getSameAdjacentCoins(pos, coins));
  }

  // left
  if (col > 0 && coins[row][col - 1] === value) {
    const pos = { row, col: col - 1 };
    result = result.concat(getSameAdjacentCoins(pos, coins));
  }

  // right
  if (col < CONST.GAME_SIZE - 1 && coins[row][col + 1] === value) {
    const pos = { row, col: col + 1 };
    result = result.concat(getSameAdjacentCoins(pos, coins));
  }

  return result;
}

export function getSameAdjacentCoinsWithValue(
  curPos: Position, value: CoinValue, coins: CoinValue[][]
  ): Position[] {

  let result: Position[] = [curPos];
  const row = curPos.row;
  const col = curPos.col;
  coins[row][col] = 0;

  if (value === 0) { return result; }

  // up
  if (row > 0 && coins[row - 1][col] === value) {
    const pos = { col, row: row - 1 };
    result = result.concat(getSameAdjacentCoins(pos, coins));
  }

  // down
  if (row < CONST.GAME_SIZE - 1 && coins[row + 1][col] === value) {
    const pos = { col, row: row + 1 };
    result = result.concat(getSameAdjacentCoins(pos, coins));
  }

  // left
  if (col > 0 && coins[row][col - 1] === value) {
    const pos = { row, col: col - 1 };
    result = result.concat(getSameAdjacentCoins(pos, coins));
  }

  // right
  if (col < CONST.GAME_SIZE - 1 && coins[row][col + 1] === value) {
    const pos = { row, col: col + 1 };
    result = result.concat(getSameAdjacentCoins(pos, coins));
  }

  return result;
}

export function tryMerge(value: CoinValue, count: number): CoinValue {
  const mergedValue = value * count;

  const coinValues = CoinValue.VALUES.filter(coin => coin > value);

  for (const coin of coinValues.reverse()) {
    if (mergedValue >= coin) {
      return coin;
    }
  }
  return value;
}

export function mergePoint(value: CoinValue, count: number): { value: number, bonus: boolean } {
  const mergedValue = value * count;

  const coinValues = CoinValue.VALUES.filter(coin => coin > value);

  for (const coin of coinValues.reverse()) {
    if (mergedValue === coin) {
      return {
        value: coin,
        bonus: false
      };
    }

    if (mergedValue > coin) {
      return {
        value: coin * 2,
        bonus: true,
      };
    }
  }

  return {
    value: 0,
    bonus: false,
  };
}

// 이미지 경로 관리를 위한 전역 상수 추가
export const ASSETS_PATH = {
  IMAGES: '/assets/images'
};
