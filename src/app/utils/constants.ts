import { Storage } from 'app/utils/storage';
import { CoinValue, Position, NextCoinType } from 'app/models';

export const S3_HOST: string = '';

export class CONST {
  public static WIDTH: number = 480;
  public static GAME_SIZE: number = Storage.getGameSize();
  public static COIN_WIDTH: number = CONST.WIDTH / CONST.GAME_SIZE;
  public static COIN_HEIGHT: number = CONST.WIDTH / CONST.GAME_SIZE;
  public static COIN_IMG_WIDTH: number = (CONST.WIDTH / CONST.GAME_SIZE) * 48 / 60;
  public static COIN_IMG_HEIGHT: number = (CONST.WIDTH / CONST.GAME_SIZE) * 52 / 60;
  public static CACHE_SPACE: number = 2;
  public static CACHE_POS: number = -10000;

  public static GAME_PRESET: CoinValue[][] | null = Storage.getGamePreset();
  public static GAME_POS: Position | null = Storage.getGamePos();

  public static NEXT_COIN_TYPE: 1 | 2 = Storage.getNextCoinType();

  public static setGameSize(value: number): void {
    CONST.GAME_SIZE = value;
    Storage.setGameSize(value);

    CONST.COIN_WIDTH = CONST.WIDTH / CONST.GAME_SIZE;
    CONST.COIN_HEIGHT = CONST.WIDTH / CONST.GAME_SIZE;
    CONST.COIN_IMG_WIDTH = (CONST.WIDTH / CONST.GAME_SIZE) * 48 / 60;
    CONST.COIN_IMG_HEIGHT = (CONST.WIDTH / CONST.GAME_SIZE) * 52 / 60;
  }

  public static setGamePreset(value: CoinValue[][], pos: number[]): void {
    CONST.GAME_PRESET = value;
    Storage.setGamePreset(value);

    CONST.GAME_POS = { row: pos[0], col: pos[1] };
    Storage.setGamePos(CONST.GAME_POS);
  }

  public static setNextCoinType(type: NextCoinType): void {
    CONST.NEXT_COIN_TYPE = type;
    Storage.setNextCoinType(type);
  }
}
