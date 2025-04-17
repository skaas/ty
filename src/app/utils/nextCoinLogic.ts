import * as _ from 'lodash';

import { CoinValue, Position } from 'app/models';
import { getSameAdjacentCoinsWithValue, tryMerge, randomSelection } from 'app/utils';
import { CONST } from 'app/utils/constants';

export namespace NextCoinLogic {
  export function getNextCoin(coins: CoinValue[][], curPos: Position): CoinValue {
    switch (CONST.NEXT_COIN_TYPE) {
    case 1:
      return getNextCoin1(coins, curPos);
    default:
      return getNextCoin2(coins, curPos);
    }
  }
}

function getNextCoin2(coins: CoinValue[][], curPos: Position): CoinValue {
  return 5;
}

function getNextCoin1(coins: CoinValue[][], curPos: Position): CoinValue {
  let candidates = getCandidates(coins, curPos, 1);
  let maxWeight = getMaxWeight(candidates);

  if (maxWeight.hasMax) {
    return maxWeight.maxValue;
  }

  candidates = getCandidates(coins, curPos, 0.5);
  maxWeight = getMaxWeight(candidates);
  return maxWeight.maxValue;
}

function getMaxWeight(candidates: { [key: number]: number })
  : {maxValue: CoinValue, hasMax: boolean } {

  let hasMax = true;
  let maxValues: CoinValue[] = [];
  let maxWeight = -1;
  for (const value of [1, 5, 10, 50, 100] as CoinValue[]) {
    const weight = candidates[value];
    if (weight > maxWeight) {
      maxWeight = weight;
      maxValues = [value];
    } else if (weight === maxWeight) {
      maxValues.push(value);
    }
  }

  if (maxWeight === 0) {
    maxValues = [1];
    hasMax = false;
  }

  return {
    hasMax,
    maxValue: randomSelection<CoinValue>(maxValues),
  };
}

function getCandidates(coins: CoinValue[][], curPos: Position, filterWeight: number)
  : { [key: number]: number } {
  // 가중치 0으로 초기화
  const candidates: { [key: number]: number } = {};
  [1, 5, 10, 50, 100].forEach((value) => {
    candidates[value] = 0;
  });

  const CASES = [CASE1, CASE2, CASE3];

  CASES.forEach((CASE) => {
    for (const paths of CASE) {
      const targetPos = { row: curPos.row + paths.row, col: curPos.col + paths.col };

      if (targetPos.row >= CONST.GAME_SIZE || targetPos.row < 0) {
        continue;
      }

      if (targetPos.col >= CONST.GAME_SIZE || targetPos.col < 0) {
        continue;
      }

      if (coins[targetPos.row][targetPos.col] !== 0) {
        continue;
      }

      const weight = getWeightForRoute(coins, curPos, paths);

      if (weight !== filterWeight) {
        continue;
      }

      // 1, 10, 100원
      for (const value of [1, 10, 100] as CoinValue[]) {
        const coinsCopy = _.map(coins, _.clone);
        const sameCoins = getSameAdjacentCoinsWithValue(targetPos, value, coinsCopy);
        const mergedValue = tryMerge(value, sameCoins.length);

        // 합칠 수 있으면 +10
        if (mergedValue !== value) {
          candidates[value] = candidates[value] + 10 * weight;
        }

        // 4개면 +8
        if (sameCoins.length === 4) {
          candidates[value] = candidates[value] + 8 * weight;
        }

        // 3개면 +6
        if (sameCoins.length === 3) {
          candidates[value] = candidates[value] + 6 * weight;
        }
      }

      // 5, 50원
      for (const value of [5, 50] as CoinValue[]) {
        const coinsCopy = _.map(coins, _.clone);
        const sameCoins = getSameAdjacentCoinsWithValue(targetPos, value, coinsCopy);
        const mergedValue = tryMerge(value, sameCoins.length);

        // 합칠 수 있으면 +8
        if (mergedValue !== value) {
          candidates[value] = candidates[value] + 8 * weight;
        }
      }
    }
  });

  return candidates;
}

// return 0.0 for impossible route
// return 0.5 for blocked route
// return 1.0 for possible route
function getWeightForRoute(coins: CoinValue[][], curPos: Position, paths: Paths): number {
  let possible = 0.0;
  for (const route of paths.routes) {
    const weights = route.map((pos) => {
      const row = curPos.row + pos.row;
      const col = curPos.col + pos.col;
      if (row >= CONST.GAME_SIZE || row < 0) { return 0.0; }
      if (col >= CONST.GAME_SIZE || col < 0) { return 0.0; }

      return coins[row][col] === 0 ? 1.0 : 0.5;
    });
    const weight = Math.max(...weights);
    possible = Math.max(possible, weight);
  }

  return possible;
}

interface Paths extends Position {
  routes: Position[][];
}

const CASE1: Paths[] = [
  {
    row: -1,
    col: 0,
    routes: [
      [{ row: 0, col:  1 }, { row: -1, col:  1 }],
      [{ row: 0, col: -1 }, { row: -1, col: -1 }],
    ],
  },
  {
    row: 1,
    col: 0,
    routes: [
      [{ row: 0, col:  1 }, { row:  1, col:  1 }],
      [{ row: 0, col: -1 }, { row:  1, col: -1 }],
    ],
  },
  {
    row: 0,
    col: 1,
    routes: [
      [{ row: -1, col: 0 }, { row: -1, col:  1 }],
      [{ row:  1, col: 0 }, { row:  1, col:  1 }],
    ],
  },
  {
    row: 0,
    col: -1,
    routes: [
      [{ row: -1, col: 0 }, { row: -1, col: -1 }],
      [{ row:  1, col: 0 }, { row:  1, col: -1 }],
    ],
  },
];

const CASE2: Paths[] = [
  {
    row: -2,
    col: -1,
    routes: [
      [{ row: -1, col:  0 }, { row: -1, col:  0 }],
      [{ row: -1, col:  0 }, { row:  0, col: -1 }],
      [{ row:  0, col: -1 }, { row: -1, col:  0 }],
    ],
  },
  {
    row: -2,
    col: 1,
    routes: [
      [{ row: -1, col:  0 }, { row: -1, col:  0 }],
      [{ row: -1, col:  0 }, { row:  0, col:  1 }],
      [{ row:  0, col:  1 }, { row: -1, col:  0 }],
    ],
  },
  {
    row: 2,
    col: -1,
    routes: [
      [{ row:  1, col:  0 }, { row:  1, col:  0 }],
      [{ row:  1, col:  0 }, { row:  0, col: -1 }],
      [{ row:  0, col: -1 }, { row:  1, col:  0 }],
    ],
  },
  {
    row: 2,
    col: 1,
    routes: [
      [{ row:  1, col:  0 }, { row:  1, col:  0 }],
      [{ row:  1, col:  0 }, { row:  0, col:  1 }],
      [{ row:  0, col:  1 }, { row:  1, col:  0 }],
    ],
  },
  {
    row: -1,
    col: 2,
    routes: [
      [{ row:  0, col:  1 }, { row:  0, col:  1 }],
      [{ row:  0, col:  1 }, { row: -1, col:  0 }],
      [{ row: -1, col:  0 }, { row:  0, col:  1 }],
    ],
  },
  {
    row: 1,
    col: 2,
    routes: [
      [{ row:  0, col:  1 }, { row:  0, col:  1 }],
      [{ row:  0, col:  1 }, { row:  1, col:  0 }],
      [{ row:  1, col:  0 }, { row:  0, col:  1 }],
    ],
  },
  {
    row: -1,
    col: -2,
    routes: [
      [{ row:  0, col: -1 }, { row:  0, col: -1 }],
      [{ row:  0, col: -1 }, { row: -1, col:  0 }],
      [{ row: -1, col:  0 }, { row:  0, col: -1 }],
    ],
  },
  {
    row: 1,
    col: -2,
    routes: [
      [{ row:  0, col: -1 }, { row:  0, col: -1 }],
      [{ row:  0, col: -1 }, { row:  1, col:  0 }],
      [{ row:  1, col:  0 }, { row:  0, col: -1 }],
    ],
  },
];

const CASE3: Paths[] = [
  {
    row: -3,
    col: 0,
    routes: [
      [{ row: -1, col:  0 }, { row: -1, col:  0 }],
    ],
  },
  {
    row: 3,
    col: 0,
    routes: [
      [{ row:  1, col:  0 }, { row:  1, col:  0 }],
    ],
  },
  {
    row: 0,
    col: 3,
    routes: [
      [{ row:  0, col:  1 }, { row:  0, col:  1 }],
    ],
  },
  {
    row: 0,
    col: -3,
    routes: [
      [{ row:  0, col: -1 }, { row:  0, col: -1 }],
    ],
  },
];
