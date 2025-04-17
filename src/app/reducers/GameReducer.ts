import { handleActions } from 'redux-actions';
import * as _ from 'lodash';

import { GameState } from './state';
import {
  GameActions,
  AddCoinPayload,
  MergeCoinPayload,
  SetNextCoinPayLoad,
  InitGamePayload,
  AddBonusPayload,
} from 'app/actions';
import { Position, CoinValue } from 'app/models';
import { Storage, CONST, NextCoinLogic, GameStepEncoding } from 'app/utils';

const defaultCoin: CoinValue[][] = _.range(CONST.GAME_SIZE)
  .map(() => _.range(CONST.GAME_SIZE)
    .map(() => 0 as CoinValue)
  );
const defaultPos = {
  row: Math.floor(CONST.GAME_SIZE / 2) + (CONST.GAME_SIZE % 2 - 1),
  col: Math.floor(CONST.GAME_SIZE / 2) + (CONST.GAME_SIZE % 2 - 1),
};

const defaultCandidates: CoinValue[] = [0, 0, 0];
const defaultSavedCoin: CoinValue = 0;

const defaultState: GameState = {
  coins: defaultCoin,
  candidates: defaultCandidates,
  savedCoin: defaultSavedCoin,
  lastPos: defaultPos,
  available: getAvailablePos(defaultCoin, defaultPos),
  score: 0,
  log: '',
  isReplay: false,
  totalMove: 0,
  gameOver: false,
};

type GameActionPlayload = AddCoinPayload
  | MergeCoinPayload
  | SetNextCoinPayLoad
  | InitGamePayload
  | AddBonusPayload;

export const gameReducer = handleActions<GameState, GameActionPlayload>(
  {
    [GameActions.Type.ADD_COIN]: (state, action) => {
      const payload = action.payload as AddCoinPayload;
      if (action.payload) {
        const coins = _.map(state.coins, _.clone);
        const candidates = _.clone(state.candidates);
        const row = payload.pos.row;
        const col = payload.pos.col;

        // Check out of bound
        if (row < 0 || row >= CONST.GAME_SIZE) { return state; }
        if (col < 0 || col >= CONST.GAME_SIZE) { return state; }

        // Check empty position
        if (coins[row][col] !== 0) { return state; }

        // Add Coin
        coins[payload.pos.row][payload.pos.col] = candidates[0];

        const score = state.score + candidates[0];

        candidates.splice(0, 1);
        candidates.push(0);

        const postState: GameState = Object.assign({}, {
          ...state,
          coins,
          candidates,
          score,
          lastPos: payload.pos,
          available: getAvailablePos(coins, payload.pos),
          totalMove: state.totalMove + 1,
        });

        if (!state.isReplay) {
          postState.log = postState.log + GameStepEncoding.encodeAddCoin(state, postState);
          console.log(postState);
          Storage.saveGame(postState);
        }

        return postState;
      }

      return state;
    },
    [GameActions.Type.MERGE_COIN]: (state, action) => {
      const payload = action.payload as MergeCoinPayload;
      const coins = _.map(state.coins, _.clone);

      for (const target of payload.from) {
        coins[target.row][target.col] = 0;
      }

      coins[payload.pos.row][payload.pos.col] = payload.value;

      const score = state.score + payload.score;

      const postState: GameState = Object.assign({}, {
        ...state,
        coins,
        score,
        available: getAvailablePos(coins, payload.pos),
      });

      if (!state.isReplay) {
        Storage.saveGame(postState);
      }

      return postState;
    },
    [GameActions.Type.SET_NEXT_COIN]: (state, action) => {
      const payload = action.payload as SetNextCoinPayLoad;
      const candidates = state.candidates.map(value => value);
      if (payload.value) {
        candidates[2] = payload.value;
      } else {
        candidates[2] = NextCoinLogic.getNextCoin(state.coins, state.lastPos);
      }

      const postState: GameState = Object.assign({}, {
        ...state,
        candidates,
      });

      if (!state.isReplay) {
        postState.log = postState.log + GameStepEncoding.encodeSetNextCoin(state, postState);
        Storage.saveGame(postState);
      }

      return postState;
    },
    [GameActions.Type.SAVE_COIN]: (state, action) => {
      const candidates = _.clone(state.candidates);
      let savedCoin: CoinValue = 0;

      if (state.savedCoin === 0) {
        if (state.isReplay) {
          savedCoin = candidates[0];
          candidates.splice(0, 1);
        } else {
          savedCoin = candidates[0];
          const newCandidate = NextCoinLogic.getNextCoin(state.coins, state.lastPos);
          candidates.splice(0, 1);
          candidates.push(newCandidate);
        }
      } else {
        const saved = state.savedCoin;
        savedCoin = candidates[0];
        candidates[0] = saved;
      }

      const postState: GameState = Object.assign({}, {
        ...state,
        savedCoin,
        candidates,
      });

      if (!state.isReplay) {
        postState.log = postState.log + GameStepEncoding.encodeSaveCoin(state, postState);
        if (state.savedCoin === 0) {
          postState.log = postState.log + GameStepEncoding.encodeSetNextCoin(state, postState);
        }
        Storage.saveGame(postState);
      }

      return postState;
    },
    [GameActions.Type.INIT_GAME]: (state, action) => {
      const payload = action.payload as InitGamePayload;
      const saved = Storage.getSavedGame();
      if (saved != null && !payload.isReplay) {
        if (saved.coins.length === CONST.GAME_SIZE) {
          return saved;
        }
      }

      let coins: CoinValue[][] = [[]];

      if (CONST.GAME_PRESET == null) {
        coins = _.range(CONST.GAME_SIZE)
        .map(() => _.range(CONST.GAME_SIZE)
          .map(() => 0 as CoinValue)
        );
      } else {
        coins = CONST.GAME_PRESET;
      }

      let lastPos: Position = {
        row: Math.floor(CONST.GAME_SIZE / 2) + (CONST.GAME_SIZE % 2 - 1),
        col: Math.floor(CONST.GAME_SIZE / 2) + (CONST.GAME_SIZE % 2 - 1),
      };

      if (CONST.GAME_POS != null) {
        lastPos = CONST.GAME_POS;
      }

      coins[lastPos.row][lastPos.col] = CoinValue.VALUES[0];

      const candidates: CoinValue[] = defaultCandidates.map(value => CoinValue.VALUES[0]);

      const score = CoinValue.VALUES[0];

      const postState = Object.assign({}, {
        coins,
        candidates,
        lastPos,
        score,
        savedCoin: 0 as CoinValue,
        available: getAvailablePos(coins, lastPos),
        log: '',
        isReplay: payload.isReplay,
        totalMove: 0,
        gameOver: false,
      }) as GameState;

      if (!state.isReplay) {
        Storage.saveGame(postState);
      }

      return postState;
    },
    [GameActions.Type.RESET_GAME]: (state) => {
      Storage.setBestScore(state.score);
      Storage.resetSavedGame();
      return Object.assign({}, defaultState);
    },
    [GameActions.Type.GAME_OVER]: (state, action) => {
      const postState = Object.assign({}, {
        ...state,
        gameOver: true,
      }) as GameState;

      if (!state.isReplay) {
        Storage.saveGame(postState);
      }
      return postState;
    },
    [GameActions.Type.ADD_BONUS]: (state, action) => {
      const payload = action.payload as AddBonusPayload;
      let bonusScore = 0;
      if (payload.bonuses != null) {
        payload.bonuses.forEach((bonus) => {
          bonusScore += bonus.value * bonus.count;
        });
      }

      const postState = Object.assign({}, {
        ...state,
        score: state.score + bonusScore
      }) as GameState;

      if (!state.isReplay) {
        Storage.saveGame(postState);
      }

      return postState;
    },
  },
  defaultState
);

function getAvailablePos(coins: CoinValue[][], curPos: Position): Position[] {
  const row = curPos.row;
  const col = curPos.col;
  const availablePos: Position[] = [];

  // up
  if (row > 0 && coins[row - 1][col] === 0) {
    availablePos.push({
      col,
      row: row - 1,
    });
  }

  // down
  if (row < CONST.GAME_SIZE - 1 && coins[row + 1][col] === 0) {
    availablePos.push({
      col,
      row: row + 1,
    });
  }

  // left
  if (col > 0 && coins[row][col - 1] === 0) {
    availablePos.push({
      row,
      col: col - 1,
    });
  }

  if (col < CONST.GAME_SIZE - 1 && coins[row][col + 1] === 0) {
    availablePos.push({
      row,
      col: col + 1,
    });
  }

  return availablePos;
}
