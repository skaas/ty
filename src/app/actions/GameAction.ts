import { createAction } from 'redux-actions';
import { CoinValue, Position, Bonus } from 'app/models';

export namespace GameActions {
  export enum Type {
    ADD_COIN = 'ADD_COIN',
    MERGE_COIN = 'MERGE_COIN',
    SET_NEXT_COIN = 'SET_NEXT_COIN',
    SAVE_COIN = 'SAVE_COIN',
    INIT_GAME = 'INIT_GAME',
    RESET_GAME = 'RESET_GAME',
    GAME_OVER = 'GAME_OVER',
    ADD_BONUS = 'Add_BONUS',
  }

  export const addCoin = createAction<AddCoinPayload>(Type.ADD_COIN);
  export const mergeCoin = createAction<MergeCoinPayload>(Type.MERGE_COIN);
  export const setNextCoin = createAction<SetNextCoinPayLoad>(Type.SET_NEXT_COIN);
  export const saveCoin = createAction(Type.SAVE_COIN);
  export const initGame = createAction<InitGamePayload>(Type.INIT_GAME);
  export const resetGame = createAction(Type.RESET_GAME);
  export const gameOver = createAction(Type.GAME_OVER);
  export const addBonus = createAction<AddBonusPayload>(Type.ADD_BONUS);
}

export interface InitGamePayload {
  isReplay: boolean;
}

export interface AddCoinPayload {
  pos: Position;
}

export interface MergeCoinPayload {
  pos: Position;
  from: Position[];
  value: CoinValue;
  score: number;
}

export interface SetNextCoinPayLoad {
  value?: CoinValue;
}

export interface AddBonusPayload {
  bonuses?: Bonus[];
}

export type GameActions = Omit<typeof GameActions, 'Type'>;
