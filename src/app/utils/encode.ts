import { GameActions } from 'app/actions';
import { CoinValue, Directions } from 'app/models';
import { getDirection } from 'app/utils';
import { GameState } from 'app/reducers/state';

export namespace GameStepEncoding {
  export function encodeSetNextCoin(preState: GameState, postState: GameState): string {
    const coinIndex = CoinValue.VALUES.indexOf(postState.candidates[2]);
    const decodeValue = 5 + coinIndex;

    return BASE64[decodeValue];
  }

  export function encodeAddCoin(preState: GameState, postState: GameState): string {
    const from = preState.lastPos;
    const to = postState.lastPos;
    const directionValue = directionToValue(getDirection(from, to));

    const coinIndex = CoinValue.VALUES.indexOf(postState.candidates[0]);
    const coinValue = 0 + coinIndex;

    const decodeValue = coinValue + directionValue;

    return BASE64[decodeValue];
  }

  export function encodeSaveCoin(preState: GameState, postState: GameState): string {
    const decodeValue = HOLD_VALUE;
    return BASE64[decodeValue];
  }

  export function decode(value: string): DecodeResult {
    const decodeValue = BASE64.indexOf(value);
    const binary = padLeft(decodeValue.toString(2), 6);

    if (decodeValue === HOLD_VALUE) {
      return {
        action: GameActions.Type.SAVE_COIN,
      };
    }

    const coinValue = parseInt(binary.slice(-4), 2);
    if (coinValue > 4) {
      const index = coinValue - 5;
      return {
        action: GameActions.Type.SET_NEXT_COIN,
        coinValue: CoinValue.VALUES[index],
      };
    }

    const direction = Directions.VALUES[parseInt(binary.slice(0, 2), 2)];
    return {
      direction,
      action: GameActions.Type.ADD_COIN,
    };
  }

  export interface DecodeResult {
    action: GameActions.Type;
    coinValue?: CoinValue;
    direction?: Directions;
  }
}

function padLeft(value: string, length: number): string {
  let result = value;
  while (result.length < length) {
    result = '0' + result;
  }

  return result;
}

function directionToValue(value: Directions): number {
  const index = Directions.VALUES.indexOf(value);
  const bIndex = index.toString(2) + '0000';
  return parseInt(bIndex, 2);
}

const BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const HOLD_VALUE = 61;
