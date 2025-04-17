import * as _ from 'lodash';

import { CoinValue, Position, AIThoughtEntry } from 'app/models';
import { getSameAdjacentCoinsWithValue, tryMerge, randomSelection } from 'app/utils';
import { CONST } from 'app/utils/constants';

export namespace NextCoinLogic {
  export function getNextCoin(coins: CoinValue[][], curPos: Position, turn: number = 0): { 
    coin: CoinValue, 
    thought: AIThoughtEntry 
  } {
    switch (CONST.NEXT_COIN_TYPE) {
    case 1:
      return getNextCoin1WithThought(coins, curPos, turn);
    default:
      return { 
        coin: getNextCoin2(coins, curPos), 
        thought: {
          turn,
          coinValue: 5,
          weights: { 5: 1.0 },
          reason: "기본 동전 제공",
          timestamp: Date.now()
        }
      };
    }
  }
}

function getNextCoin2(coins: CoinValue[][], curPos: Position): CoinValue {
  return 5;
}

function generateThoughtReason(
  coins: CoinValue[][], 
  curPos: Position, 
  coinValue: CoinValue, 
  candidates: { [key: number]: number }
): string {
  // 병합 가능성 체크
  const mergeOpportunities = countMergeOpportunities(coins, curPos, coinValue);
  if (mergeOpportunities > 0) {
    return `${mergeOpportunities}개 동전 병합 가능성`;
  }
  
  // 전략적 위치 체크
  if (isStrategicPosition(curPos)) {
    return "전략적 위치 확보";
  }
  
  // 가중치가 낮으면 차선책
  const values = Object.keys(candidates).map(key => candidates[Number(key)]);
  const maxWeight = Math.max(...values);
  if (maxWeight < 5) {
    return "차선책 선택";
  }
  
  // 균형 유지 케이스
  return "균형잡힌 분포 유지";
}

function getNextCoin1WithThought(coins: CoinValue[][], curPos: Position, turn: number): { 
  coin: CoinValue, 
  thought: AIThoughtEntry 
} {
  let candidates = getCandidates(coins, curPos, 1);
  let maxWeight = getMaxWeight(candidates);

  if (maxWeight.hasMax) {
    const reason = generateThoughtReason(coins, curPos, maxWeight.maxValue, candidates);
    return {
      coin: maxWeight.maxValue,
      thought: {
        turn,
        coinValue: maxWeight.maxValue,
        weights: {}, // 빈 객체로 전달하여 가중치 숨기기
        reason,
        timestamp: Date.now()
      }
    };
  }

  candidates = getCandidates(coins, curPos, 0.5);
  maxWeight = getMaxWeight(candidates);
  
  return {
    coin: maxWeight.maxValue,
    thought: {
      turn,
      coinValue: maxWeight.maxValue,
      weights: {}, // 빈 객체로 전달하여 가중치 숨기기
      reason: "차선책 선택",
      timestamp: Date.now()
    }
  };
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

        // 합칠 수 있으면 보너스 부여
        if (mergedValue !== value) {
          // 병합 결과와 원래 값의 비율 계산
          const valueMultiplier = mergedValue / value;
          
          // 병합으로 인한 가치 증가에 비례하는 보너스
          const mergeBonus = Math.min(15, 8 * valueMultiplier);
          
          // 인접한 동전 수에 따른 추가 보너스
          const adjacencyBonus = sameCoins.length >= 3 ? (sameCoins.length - 1) * 2 : 0;
          
          // 최종 병합 가치 계산
          candidates[value] = candidates[value] + (mergeBonus + adjacencyBonus) * weight;
        }
      }

      // 5, 50원
      for (const value of [5, 50] as CoinValue[]) {
        const coinsCopy = _.map(coins, _.clone);
        const sameCoins = getSameAdjacentCoinsWithValue(targetPos, value, coinsCopy);
        const mergedValue = tryMerge(value, sameCoins.length);

        // 합칠 수 있으면 보너스 부여
        if (mergedValue !== value) {
          // 병합 결과와 원래 값의 비율 계산
          const valueMultiplier = mergedValue / value;
          
          // 병합으로 인한 가치 증가에 비례하는 보너스
          const mergeBonus = Math.min(12, 6 * valueMultiplier);
          
          // 인접한 동전 수에 따른 추가 보너스
          const adjacencyBonus = sameCoins.length >= 3 ? (sameCoins.length - 1) * 1.5 : 0;
          
          // 최종 병합 가치 계산
          candidates[value] = candidates[value] + (mergeBonus + adjacencyBonus) * weight;
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

// 병합 기회 계산 헬퍼 함수
function countMergeOpportunities(coins: CoinValue[][], curPos: Position, value: CoinValue): number {
  let count = 0;
  
  // 인접한 위치들 확인
  const directions = [
    {row: -1, col: 0}, // 위
    {row: 1, col: 0},  // 아래
    {row: 0, col: -1}, // 왼쪽
    {row: 0, col: 1}   // 오른쪽
  ];
  
  for (const dir of directions) {
    const row = curPos.row + dir.row;
    const col = curPos.col + dir.col;
    
    // 범위 체크
    if (row < 0 || row >= CONST.GAME_SIZE || col < 0 || col >= CONST.GAME_SIZE) {
      continue;
    }
    
    // 빈 공간인지 확인
    if (coins[row][col] === 0) {
      const pos = { row, col };
      const coinsCopy = _.map(coins, _.clone);
      const sameCoins = getSameAdjacentCoinsWithValue(pos, value, coinsCopy);
      if (sameCoins.length >= 2) {
        count++;
      }
    }
  }
  
  return count;
}

// 전략적 위치 확인 헬퍼 함수
function isStrategicPosition(pos: Position): boolean {
  // 중앙에 가까운지 등을 확인
  const centerRow = Math.floor(CONST.GAME_SIZE / 2);
  const centerCol = Math.floor(CONST.GAME_SIZE / 2);
  const distanceFromCenter = Math.abs(pos.row - centerRow) + Math.abs(pos.col - centerCol);
  
  return distanceFromCenter <= 2;
}
