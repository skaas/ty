export type CoinValue = 0 | 1 | 5 | 10 | 50 | 100 | 500 | 1000;

export module CoinValue {
  export const VALUES: CoinValue[] = [1, 5, 10, 50, 100, 500, 1000];

  export function fromString(value: string): CoinValue {
    switch (value) {
    case '0':     return 0;
    case '1':     return 1;
    case '5':     return 5;
    case '10':    return 10;
    case '50':    return 50;
    case '100':   return 100;
    case '500':   return 500;
    case '1000':  return 1000;
    default:      return 0;
    }
  }

  export function isCoinValue(value: number): boolean {
    switch (value) {
    case 0:
    case 1:
    case 5:
    case 10:
    case 50:
    case 100:
    case 500:
    case 1000:
      return true;
    default:
      return false;
    }
  }
}

export interface Position {
  row: number;
  col: number;
}

export namespace Directions {
  export const LEFT = 'left';
  export const RIGHT = 'right';
  export const UP = 'up';
  export const DOWN = 'down';

  export const VALUES: Directions[] = [LEFT, RIGHT, UP, DOWN];

  export function asOffset(direction: Directions): Position {
    switch (direction) {
    case LEFT:
      return { row: 0, col: -1 };
    case RIGHT:
      return { row: 0, col: 1 };
    case UP:
      return { row: -1, col: 0 };
    case DOWN:
      return { row: +1, col: 0 };
    default:
      return { row: 0, col: 0 };
    }
  }
}

export type Directions = typeof Directions.LEFT
  | typeof Directions.RIGHT
  | typeof Directions.UP
  | typeof Directions.DOWN;

export interface DialogState {
  showDialog: boolean;
  title: string;
  msg: string;
  confirmMsg: string;
  cancelMsg: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export type NextCoinType = 1 | 2;

export type Bonus = { pos: Position, value: number, count: number };
