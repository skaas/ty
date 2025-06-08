import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router';
import { RootState } from 'app/reducers';

import { GameBoard, NextCoins, GameUI, Dialog } from 'app/components';
import { GameState } from 'app/reducers/state';
import { DialogState, Directions } from 'app/models';
import { GameActions, DialogActions } from 'app/actions';
import {
  omit,
  getSameAdjacentCoins,
  tryMerge,
  CONST,
  GameStepEncoding,
  mergePoint,
  S3_HOST,
} from 'app/utils';
import { IMAGES } from 'app/constants/images';

export namespace App {
  interface RouteParam {
    log: string;
  }

  export interface Props extends RouteComponentProps<RouteParam> {
    game: GameState;
    dialog: DialogState;
    actions: GameActions & DialogActions;
  }
  export interface State {
    autoPlay: boolean;
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
  private gameLog: string = '';
  private gameLogIndex: number = 0;
  private blockKeyEvent: boolean = false;

  constructor(props: App.Props, context?: any) {
    super(props, context);

    this.state = {
      autoPlay: false
    };
  }

  componentWillMount(): void {
    document.addEventListener('keydown', this.handleKeyPress.bind(this));
  }

  componentDidMount(): void {
    this.gameLog = this.props.match.params.log;

    setTimeout(() => { this.props.actions.initGame({ isReplay: true }); }, 1000);
  }

  componentWillUnmount(): void {
    document.removeEventListener('keydown', this.handleKeyPress.bind(this));
  }

  render(): JSX.Element {
    return (
      <div style={styles.container}>
        <GameUI
          score={0}
        />
        <NextCoins
          ref={ref => this.nextCoins = ref}
          coins={this.props.game.candidates}
          savedCoin={this.props.game.savedCoin}
          image={this.state.autoPlay ?
            IMAGES.GAME_BTN_PAUSE :
            IMAGES.GAME_BTN_PLAY}
          onSaveClick={() => {}}
          onImageClick={() => { this.toggleAutoPlay(); }}
        />
        <GameBoard
          ref={ref => this.gameBoard = ref}
          game={this.props.game}
          addCoin={(pos) => {}}
        />
        <Dialog
          dialog={this.props.dialog}
        />
      </div>
    );
  }

  private async replayOneStep(): Promise<void> {
    if (this.gameLogIndex >= this.gameLog.length || this.blockKeyEvent) {
      return;
    }

    this.blockKeyEvent = true;

    let step = GameStepEncoding.decode(this.gameLog[this.gameLogIndex]);

    if (step.action === GameActions.Type.ADD_COIN && step.direction != null) {
      const offset = Directions.asOffset(step.direction);
      const curPos = this.props.game.lastPos;

      const pos = {
        row: curPos.row + offset.row,
        col: curPos.col + offset.col,
      };

      this.props.actions.addCoin({ pos });

      if (this.nextCoins != null) {
        this.nextCoins.startMoveAnimation();
        this.nextCoins.startAppearAnimation();
      }
      if (this.gameBoard != null) {
        this.gameBoard.startMoveAnimation();
      }

      await new Promise((resolve) => {
        setTimeout(() => { resolve(); }, 150);
      });

      if (this.gameLog.length >= 1) {
        this.gameLogIndex += 1;
        step = GameStepEncoding.decode(this.gameLog[this.gameLogIndex]);
      }
    }

    if (step.action === GameActions.Type.SAVE_COIN) {

      const isInitHoldAnimation = this.props.game.savedCoin === 0;
      this.props.actions.saveCoin(true);

      if (this.nextCoins != null) {
        this.nextCoins.startHoldAnimation(isInitHoldAnimation);
        if (isInitHoldAnimation) {
          this.nextCoins.startAppearAnimation();
        }
      }

      await new Promise((resolve) => {
        setTimeout(() => { resolve(); }, 150);
      });

      if (this.gameLog.length >= 1) {
        this.gameLogIndex += 1;
        step = GameStepEncoding.decode(this.gameLog[this.gameLogIndex]);
      }
    }

    if (step.action === GameActions.Type.SET_NEXT_COIN && step.coinValue != null) {

      this.props.actions.setNextCoin({ value: step.coinValue });

      if (this.gameLog.length >= 1) {
        this.gameLogIndex += 1;
      }
    }

    await new Promise((resolve) => {
      setTimeout(() => { resolve(); }, 100);
    });

    let merged = true;
    while (merged) {
      merged = await this.tryMerge();
    }

    await new Promise((resolve) => {
      setTimeout(() => { resolve(); }, 200);
    });

    this.blockKeyEvent = false;

    if (this.state.autoPlay) {
      this.replayOneStep();
    }
  }

  private async tryMerge(): Promise<boolean> {
    const lastPos = this.props.game.lastPos;

    const coinsCopy = _.map(this.props.game.coins, _.clone);
    const sameCoins = getSameAdjacentCoins(lastPos, coinsCopy);

    const lastPosCoin = this.props.game.coins[lastPos.row][lastPos.col];
    const mergedValue = tryMerge(lastPosCoin, sameCoins.length);

    let merge = false;
    if (this.gameBoard && lastPosCoin !== mergedValue) {
      merge = true;
      await this.gameBoard.startMergeAnimation(lastPos, sameCoins);
    }

    if (merge) {
      this.props.actions.mergeCoin({
        pos: lastPos,
        from: sameCoins,
        value: mergedValue,
        score: mergePoint(lastPosCoin, sameCoins.length).value,
      });
    }

    return merge;
  }

  private handleKeyPress(event: KeyboardEvent): void {
    switch (event.keyCode) {
    case 39: // right
      if (!this.state.autoPlay && !this.blockKeyEvent) {
        this.replayOneStep();
      }
      break;
    case 32: // space
      this.toggleAutoPlay();
      break;
    default:
      break;
    }
  }

  private toggleAutoPlay(): void {
    if (!this.state.autoPlay) {
      this.replayOneStep();
    }
    this.setState({
      autoPlay: !this.state.autoPlay
    });
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
