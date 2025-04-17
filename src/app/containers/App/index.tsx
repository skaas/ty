import * as React from 'react';
import * as _ from 'lodash';
import * as qs from 'query-string';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router';
import { RootState } from 'app/reducers';

import { GameBoard, NextCoins, GameUI, Dialog, GameOverUI } from 'app/components';
import { GameState } from 'app/reducers/state';
import { DialogState, Bonus } from 'app/models';
import { GameActions, DialogActions } from 'app/actions';
import {
  omit,
  keyToOffset,
  getSameAdjacentCoins,
  tryMerge,
  CONST,
  Storage,
  mergePoint,
  S3_HOST,
} from 'app/utils';
import * as ga from 'app/utils/ga';
import { BonusBoard } from 'app/components/BonusBoard';

export namespace App {
  export interface Props extends RouteComponentProps<void> {
    game: GameState;
    dialog: DialogState;
    actions: GameActions & DialogActions;
  }
  export interface State {
    gameOver: boolean;
  }
}

@connect(
  (state: RootState): Pick<App.Props, 'game' | 'dialog'> => {
    return {
      game: state.game,
      dialog: state.dialog,
    };
  },
  (dispatch: Dispatch): Pick<App.Props, 'actions'> => ({
    actions: bindActionCreators(
      Object.assign({},
                    omit(GameActions, 'Type'),
                    omit(DialogActions, 'Type')),
      dispatch)
  })
)
export class App extends React.Component<App.Props, App.State> {
  static defaultProps: Partial<App.Props> = {};

  private gameBoard: GameBoard | null = null;
  private nextCoins: NextCoins | null = null;
  private bonusBoard: BonusBoard | null = null;
  private blockKeyEvent: boolean = false;
  private bonusPlayed: boolean = false;

  constructor(props: App.Props, context?: any) {
    super(props, context);

    this.state = {
      gameOver: false
    };
  }

  componentWillMount(): void {
    const params = qs.parse(this.props.location.search);
    if (params.size != null || params.preset != null || params.pos != null || params.type != null) {
      try {
        const size = parseInt(params.size, 10);
        CONST.setGameSize(size);
        this.props.actions.resetGame();
      } catch {}

      try {
        const preset = JSON.parse(params.preset);
        const pos = JSON.parse(params.pos);
        CONST.setGamePreset(preset, pos);
        this.props.actions.resetGame();
      } catch {}

      try {
        const type = JSON.parse(params.type);
        CONST.setNextCoinType(type);
        this.props.actions.resetGame();
      } catch {}

      this.props.history.replace('/');
    }

    document.addEventListener('keydown', this.handleKeyPress.bind(this));
  }

  componentDidMount(): void {
    ga.onGameStart();
    this.props.actions.initGame({ isReplay: false });
  }

  componentWillUnmount(): void {
    this.tryMerge();
    document.removeEventListener('keydown', this.handleKeyPress.bind(this));
  }

  componentDidUpdate(): void {
    this.tryMerge();
  }

  render(): JSX.Element {
    return (
      <div style={styles.container}>
        <GameUI
          score={this.props.game.score}
        />
        <NextCoins
          ref={ref => this.nextCoins = ref}
          coins={this.props.game.candidates}
          savedCoin={this.props.game.savedCoin}
          image={require('../../../assets/images/pause_btn_retry.png')}
          onSaveClick={() => {
            if (this.nextCoins != null) {
              const isInitHoldAnimation = this.props.game.savedCoin === 0;
              this.props.actions.saveCoin(false);
              this.nextCoins.startHoldAnimation(isInitHoldAnimation);
              if (isInitHoldAnimation) {
                this.nextCoins.startAppearAnimation();
              }
            }
          }}
          onImageClick={() => { this.onRetryClick(); }}
        />
        <GameBoard
          ref={ref => this.gameBoard = ref}
          game={this.props.game}
          addCoin={(pos) => {
            if (!this.blockKeyEvent) {
              const nextCoin = this.props.game.candidates[0];
              this.props.actions.addCoin({ pos });
              if (this.nextCoins != null) {
                this.nextCoins.startMoveAnimation();
                this.nextCoins.startAppearAnimation();
              }
              if (this.gameBoard != null) {
                this.gameBoard.startMoveAnimation();
              }
              if (this.bonusBoard != null) {
                this.bonusBoard.bonuseAnimation(pos, `+${nextCoin}`);
              }
            }
          }}
        />
        <BonusBoard ref={ref => this.bonusBoard = ref}/>
        <Dialog
          dialog={this.props.dialog}
        />
        <GameOverUI
          show={this.state.gameOver}
          score={this.props.game.score}
          bestScore={Storage.getBestScore()}
          onRetryClick={() => {
            ga.onRestart(this.props.game);

            this.bonusPlayed = false;
            this.props.actions.resetGame();
            this.props.actions.initGame({ isReplay: false });
            if (this.bonusBoard != null) {
              this.bonusBoard.clearBoard();
            }
            this.setState({
              gameOver: false
            });
            ga.onGameStart();
          }}
          getShareLink={() => { return this.getSharedLink(); }}
        />
      </div>
    );
  }

  private onRetryClick(): void {
    this.props.actions.openDialog({
      title: 'Restart Game?',
      msg: '',
      confirmMsg: 'OK',
      cancelMsg: 'NO',
      onConfirm: () => {
        ga.onRetry(this.props.game);

        this.props.actions.resetGame();
        this.props.actions.closeDialog();
        if (this.bonusBoard != null) {
          this.bonusBoard.clearBoard();
        }
        this.props.actions.initGame({ isReplay: false });
      },
      onCancel: () => { this.props.actions.closeDialog(); },
    });
  }

  private handleKeyPress(event: KeyboardEvent): void {
    if (this.blockKeyEvent) { return; }

    if (event.keyCode === 32) {
      if (this.nextCoins != null) {
        const isInitHoldAnimation = this.props.game.savedCoin === 0;
        this.props.actions.saveCoin(false);
        this.nextCoins.startHoldAnimation(isInitHoldAnimation);
        if (isInitHoldAnimation) {
          this.nextCoins.startAppearAnimation();
        }
      }
      return;
    }

    const offset = keyToOffset(event);
    if (offset == null) { return; }

    const row = this.props.game.lastPos.row + offset.row;
    const col = this.props.game.lastPos.col + offset.col;

    if (row >= CONST.GAME_SIZE || row < 0) { return; }
    if (col >= CONST.GAME_SIZE || col < 0) { return; }
    if (this.props.game.coins[row][col] !== 0) { return; }

    const pos = {
      row: this.props.game.lastPos.row + offset.row,
      col: this.props.game.lastPos.col + offset.col,
    };

    const nextCoin = this.props.game.candidates[0];
    this.props.actions.addCoin({ pos });
    if (this.bonusBoard != null) {
      this.bonusBoard.bonuseAnimation(pos, `+${nextCoin}`);
    }
    if (this.nextCoins != null) {
      this.nextCoins.startMoveAnimation();
      this.nextCoins.startAppearAnimation();
    }
    if (this.gameBoard != null) {
      this.gameBoard.startMoveAnimation();
    }
  }

  private async tryMerge(): Promise<void> {
    if (this.state.gameOver) {
      return;
    }

    const lastPos = this.props.game.lastPos;

    const coinsCopy = _.map(this.props.game.coins, _.clone);
    const sameCoins = getSameAdjacentCoins(lastPos, coinsCopy);

    const lastPosCoin = this.props.game.coins[lastPos.row][lastPos.col];
    const mergedValue = tryMerge(lastPosCoin, sameCoins.length);

    let merge = false;
    if (this.gameBoard && lastPosCoin !== mergedValue) {
      this.blockKeyEvent = true;
      merge = true;
      await this.gameBoard.startMergeAnimation(lastPos, sameCoins);
    } else if (this.isGameOver()) {
      if (!this.props.game.gameOver) {
        if (!this.bonusPlayed) {
          this.bonusPlayed = true;
          const bonuses = await this.startGameEndBonusAnimation();
          this.props.actions.addBonus({ bonuses });
        }
        this.props.actions.gameOver();
        ga.onGameEnd(this.props.game);
      }
      this.setState({
        gameOver: true,
      });
      return;
    }

    this.blockKeyEvent = false;

    if (merge) {
      const mergedPoint = mergePoint(lastPosCoin, sameCoins.length);
      this.props.actions.mergeCoin({
        pos: lastPos,
        from: sameCoins,
        value: mergedValue,
        score: mergedPoint.value,
      });
      if (this.bonusBoard != null) {
        if (mergedPoint.bonus) {
          this.bonusBoard.bonuseAnimation(lastPos, `+${mergedPoint.value}`);
        } else {
          this.bonusBoard.bonuseAnimation(lastPos, `+${mergedValue}`);
        }
      }
    } else {
      if (this.props.game.candidates[2] === 0) {
        this.props.actions.setNextCoin({});
        if (this.nextCoins != null) {
          this.nextCoins.startAppearAnimation();
        }
      }
    }
  }

  private async startGameEndBonusAnimation(): Promise<Bonus[]> {

    const coins = _.map(this.props.game.coins, _.clone);
    const marks: boolean[][] = _.range(this.props.game.coins.length).map(
      () => _.range(this.props.game.coins.length).map(
        () => false));

    const bonuses: Bonus[] = [];

    for (let row = 0; row < coins.length; row += 1) {
      for (let col = 0; col < coins.length; col += 1) {
        const mark = marks[row][col];
        if (mark) { continue; }

        const coin = coins[row][col];
        const adjacents = getSameAdjacentCoins({ row, col }, coins);
        for (const pos of adjacents) {
          marks[pos.row][pos.col] = true;
        }

        if (adjacents.length > 1) {
          const weights = adjacents.map((pos) => {
            const weight = adjacents.map((target) => {
              return Math.pow(target.row - pos.row, 2) + Math.pow(target.col - pos.col, 2);
            }).reduce((val1, val2) => {
              return val1 + val2;
            });

            return {
              weight,
              pos,
            };
          });

          const bonusPos = weights.reduce((min, pos) => {
            return min.weight < pos.weight ? min : pos;
          }).pos;

          bonuses.push({
            pos: bonusPos,
            value: coin,
            count: adjacents.length,
          });
        }
      }
    }

    for (const bonus of bonuses) {
      if (this.bonusBoard != null) {
        this.bonusBoard.bonuseAnimation(bonus.pos, `+${bonus.value} x${bonus.count}`, -1);
      }
      const timer = new Promise((resolve, reject) => setTimeout(resolve, 150));
      await timer;
    }

    return bonuses;
  }

  private getSharedLink(): string {
    return `${window.location.href}replay/${this.props.game.log}`;
  }

  private isGameOver(): boolean {
    return this.props.game.available.length === 0;
  }
}

const styles = {
  container: {
    width: `${CONST.WIDTH}px`,
    margin: '0 auto',
    padding: '20px',
  } as React.CSSProperties,
  coinRow: {
    display: 'block',
    height: '60px',
  } as React.CSSProperties,
  inputForm: {
    marginTop: '50px',
  } as React.CSSProperties,
  inputLabel: {
    width: '120px',
  } as React.CSSProperties
};
