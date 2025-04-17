import * as React from 'react';
import * as _ from 'lodash';
import * as BezierEasing from 'bezier-easing';

import { Coin, GameCoinBox } from './';
import { GameState } from 'app/reducers/state';
import {
  getDirection,
  CONST,
} from 'app/utils';
import { Position, CoinValue, Directions } from 'app/models';
import { AnimationLoop } from 'app/utils/animation';

export namespace GameBoard {
  export interface Props {
    game: GameState;
    addCoin: (pos: Position) => void;
  }
}

export class GameBoard extends React.Component<GameBoard.Props> {
  static defaultProps: Partial<GameBoard.Props> = {};

  private ref: HTMLDivElement | null = null;
  private initialized: boolean = false;

  private coinPool: { [key: number]: { size: number, refs: Coin[] } } = {};

  private coinBoxPool: { [key: string]: GameCoinBox } = {};

  constructor(props: GameBoard.Props, context?: any) {
    super(props, context);
  }

  componentDidMount(): void {
    if (this.shouldInit(this.props)) {
      this.init(this.props);
    }
  }

  shouldComponentUpdate(nextProps: GameBoard.Props, nextState: {}): boolean {
    if (!this.initialized) {
      if (this.shouldInit(nextProps)) {
        this.init(nextProps);
        return true;
      }
    } else {
      this.updateCoinPositions(nextProps);

      // 오브젝트 풀이 부족 한지 체크
      let needMoreCoin = false;
      const coins = this.countCoins(nextProps.game.coins);
      CoinValue.VALUES.forEach((value) => {
        const poolLength = this.coinPool[value].size;
        const coinLength = coins[value].length;

        if (coinLength - poolLength > CONST.CACHE_SPACE) {
          this.coinPool[value].size = coinLength + CONST.CACHE_SPACE;
          needMoreCoin = true;
        }

        if (poolLength < coinLength + CONST.CACHE_SPACE) {
          this.coinPool[value].size = this.coinPool[value].size + CONST.CACHE_SPACE;
          needMoreCoin = true;
        }
      });

      return needMoreCoin;
    }

    return false;
  }

  componentDidUpdate(): void {
    this.updateCoinPositions(this.props);
  }

  render(): JSX.Element {
    if (!this.initialized) {
      return <div style={styles.gameBoard()} />;
    }

    return (
      <div
        ref={(ref) => {
          if (ref != null && this.ref == null) {
            this.ref = ref;
          }
        }}
        style={styles.gameBoard()}
      >
        {
          CoinValue.VALUES.map((value) => {
            return Array(this.coinPool[value].size).fill(0).map((__, index) => {
              return (<Coin
                key={`coin-${value}-${index}`}
                ref={(ref) => {
                  if (ref != null) {
                    if (this.coinPool[value].refs.indexOf(ref) === -1) {
                      this.coinPool[value].refs.push(ref);
                    }
                  }
                }}
                style={{
                  left: CONST.CACHE_POS,
                  top: CONST.CACHE_POS,
                }}
                value={value}
              />);
            });
          })
        }
        {
          [Directions.LEFT, Directions.RIGHT, Directions.UP, Directions.DOWN]
            .map((direction) => {
              return (
                <GameCoinBox
                  key={`coin-box-${direction}`}
                  ref={(ref) => {
                    if (ref != null) {
                      this.coinBoxPool[direction] = ref;
                    }
                  }}
                  style={{
                    left: CONST.CACHE_POS,
                    top: CONST.CACHE_POS,
                  }}
                  direction={direction as Directions}
                  onClick={() => {
                    const offset = Directions.asOffset(direction as Directions);
                    this.props.addCoin({
                      row: this.props.game.lastPos.row + offset.row,
                      col: this.props.game.lastPos.col + offset.col
                    });
                  }}
                />
              );
            })
        }
      </div>
    );
  }

  private updateCoinPositions(nextProps: GameBoard.Props): void {
    const coins = this.countCoins(nextProps.game.coins);

    CoinValue.VALUES.forEach((value) => {
      this.coinPool[value].refs.forEach((ref, index) => {
        if (index < coins[value].length) {
          const { row, col } = coins[value][index];
          ref.setStyle({
            left: col * CONST.WIDTH / CONST.GAME_SIZE,
            top: row * CONST.WIDTH / CONST.GAME_SIZE,
          });
        } else {
          ref.setStyle({
            left: CONST.CACHE_POS,
            top: CONST.CACHE_POS,
          });
        }
      });
    });

    const directions = Directions.VALUES.map(value => value);

    nextProps.game.available.forEach((pos) => {
      const direction = getDirection(nextProps.game.lastPos, pos);
      directions.splice(directions.indexOf(direction), 1);
      this.coinBoxPool[direction].setStyle({
        left: pos.col * CONST.WIDTH / CONST.GAME_SIZE,
        top: pos.row * CONST.WIDTH / CONST.GAME_SIZE,
      });
    });

    directions.forEach((direction) => {
      this.coinBoxPool[direction].setStyle({
        left: CONST.CACHE_POS,
        top: CONST.CACHE_POS,
      });
    });
  }

  private countCoins(coins: CoinValue[][]): { [key: number]: { row: number, col: number}[] } {
    const coinCounts: { [key: number]: { row: number, col: number}[] } = {};
    CoinValue.VALUES.forEach((value) => { coinCounts[value] = []; });

    coins.forEach((row, i) => {
      row.forEach((coin, j) => {
        if (coin !== 0) {
          coinCounts[coin as number].push({ row: i, col: j });
        }
      });
    });

    return coinCounts;
  }

  private shouldInit(props: GameBoard.Props): boolean {
    for (const row of props.game.coins) {
      for (const coin of row) {
        if (coin !== 0) {
          return true;
        }
      }
    }
    return false;
  }

  private init(props: GameBoard.Props): void {
    CoinValue.VALUES.forEach((value) => {
      this.coinPool[value] = { size: 0, refs: [] };
    });

    const coins = this.countCoins(props.game.coins);

    CoinValue.VALUES.forEach((value) => {
      this.coinPool[value].size = coins[value].length + CONST.CACHE_SPACE;
    });

    this.initialized = true;
  }

  public async startMergeAnimation(to: Position, from: Position[]): Promise<void> {
    const coins = this.countCoins(this.props.game.coins);

    const targets: {
      ref: Coin,
      origin: { left: number, top: number },
      diff: { left: number, top: number },
    }[] = [];

    for (const pos of from) {
      CoinValue.VALUES.forEach((value) => {
        this.coinPool[value].refs.forEach((ref, index) => {
          if (index < coins[value].length) {
            const { row, col } = coins[value][index];

            if (row === pos.row && col === pos.col) {
              if (to.row === pos.row && to.col === pos.col) {
              } else {
                const style = ref.getStyle();
                targets.push({
                  ref,
                  origin: {
                    left: (style.left as number),
                    top: (style.top as number),
                  },
                  diff: {
                    left: (to.col - pos.col) * CONST.WIDTH / CONST.GAME_SIZE,
                    top: (to.row - pos.row) * CONST.WIDTH / CONST.GAME_SIZE,
                  }
                });
              }
            }
          }
        });
      });
    }

    const curve = BezierEasing(0.6, -0.28, 0.735, 0.045);
    const anim = new AnimationLoop(
      (delta) => {
        for (const target of targets) {
          const left = target.origin.left + target.diff.left * curve(delta / MERGE_ANIM_DURATION);
          const top = target.origin.top + target.diff.top * curve(delta / MERGE_ANIM_DURATION);
          target.ref.setStyle({
            left,
            top,
          });
        }
      },
      MERGE_ANIM_DURATION
    );

    await anim.start();
  }

  public startMoveAnimation(): void {
    const anim = new AnimationLoop(
      (delta) => {
        const coins = this.countCoins(this.props.game.coins);
        CoinValue.VALUES.forEach((value) => {
          this.coinPool[value].refs.forEach((ref, index) => {
            if (index < coins[value].length) {
              const pos = coins[value][index];
              if (_.isEqual(this.props.game.lastPos, pos)) {
                const leftFrom = 158;
                const topFrom = -100;
                const leftTo = pos.col * CONST.WIDTH / CONST.GAME_SIZE;
                const topTo = pos.row * CONST.WIDTH / CONST.GAME_SIZE;

                const left = leftFrom + (leftTo - leftFrom) * delta / MOVE_ANIM_DURATION;
                const top = topFrom + (topTo - topFrom) * delta / MOVE_ANIM_DURATION;
                ref.setStyle({
                  left,
                  top,
                });
              }
            }
          });
        });
      },
      MOVE_ANIM_DURATION
    );
    anim.start();
  }
}

const MOVE_ANIM_DURATION = 100;
const MERGE_ANIM_DURATION = 500;

const styles = {
  gameBoard(): React.CSSProperties {
    return {
      position: 'relative',
      width: '480px',
      height: '480px',
      background: '#f0edde',
      backgroundImage: `
        linear-gradient(transparent calc(100% - 1px), #ffffff 100%),
        linear-gradient(90deg, transparent calc(100% - 1px), #ffffff 100%)`,
      backgroundSize: `${CONST.COIN_WIDTH}px ${CONST.COIN_HEIGHT}px`,
    } as React.CSSProperties;
  },
};
