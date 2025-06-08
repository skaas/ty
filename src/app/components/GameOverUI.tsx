import * as React from 'react';

const Clipboard = require('react-clipboard.js').default;

import { CONST } from 'app/utils';

export namespace GameOverUI {
  export interface Props {
    show: boolean;
    score: number;
    bestScore: number;
    getShareLink: () => string;
    onRetryClick: () => void;
  }

  export interface State {}
}

export class GameOverUI extends React.Component<GameOverUI.Props, GameOverUI.State> {
  static defaultProps: Partial<GameOverUI.Props> = {};
  private firstRender: boolean = true;

  constructor(props: GameOverUI.Props, context?: any) {
    super(props, context);
  }

  componentDidMount(): void {
    this.firstRender = false;
  }

  render(): JSX.Element {
    let visibleStyle = {};
    if (!this.firstRender) {
      visibleStyle = this.props.show ? styles.containerVisible : styles.containerHidden;
    }
    return (
      <div
        style={{
          ...styles.container,
          ...visibleStyle
        }}
      >
        <div style={styles.title}>GAME OVER</div>

        <div style={styles.scoreContainer}>
          <div style={styles.currentScore}>
            <div>SCORE</div>
            <div>{this.props.score}</div>
            {
              this.isNewRecord() && <img
                style={styles.newRecord}
                src={require('../../assets/images/game_result_new.png')}
              />
            }
          </div>
          <Clipboard
            style={{
              ...styles.imageContainer,
              visibility: 'hidden'
            }}
            component="div"
            data-clipboard-text={this.props.getShareLink()}
            onSuccess={() => {
              alert('Copied the link to clipboard');
            }}
            onError={() => {
              alert('This function is not allow on this browser');
            }}
          >
              <img
                style={styles.image}
                src={require('../../assets/images/main_btn_twitter.png')}
              />
          </Clipboard>
        </div>

        <div style={styles.scoreContainer}>
          <div style={styles.bestScore}>
            <div>BEST</div>
            <div>{this.props.bestScore}</div>
          </div>
          <div
            style={styles.imageContainer}
            onClick={() => { this.props.onRetryClick(); }}
          >
            <img
              style={styles.image}
              src={require('../../assets/images/pause_btn_retry.png')}
            />
          </div>
        </div>
      </div>
    );
  }

  private isNewRecord(): boolean {
    return this.props.score > this.props.bestScore;
  }
}

const styles = {
  container: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '240px',
    top: '0px',
    width: `${CONST.WIDTH}px`,
    background: '#3f9cba',
    zIndex: 100,
  } as React.CSSProperties,
  containerVisible: {
    visibility: 'visible',
    opacity: 1,
    transition: 'opacity 300ms linear',
  } as React.CSSProperties,
  containerHidden: {
    visibility: 'hidden',
    opacity: 0,
    transition: 'visibility 0s 300ms, opacity 300ms linear',
  } as React.CSSProperties,
  title: {
    fontSize: '30px',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: '10px',
    userSelect: 'none',
  } as React.CSSProperties,
  scoreContainer: {
    position: 'relative',
    display: 'flex',
    width: `${CONST.WIDTH}px`,
    flexDirection: 'row',
    justifyContent: 'space-around',
  } as React.CSSProperties,
  bestScore: {
    width: `${CONST.WIDTH * 0.5}px`,
    fontSize: '24px',
    background: '#58d6c0',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '20px',
    paddingRight: '20px',
    userSelect: 'none',
    borderRadius: '10px',
  } as React.CSSProperties,
  currentScore: {
    width: `${CONST.WIDTH * 0.5}px`,
    fontSize: '24px',
    background: '#eb6397',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '15px',
    paddingBottom: '15px',
    paddingLeft: '20px',
    paddingRight: '20px',
    userSelect: 'none',
    borderRadius: '10px',
  } as React.CSSProperties,
  imageContainer: {
    pointerEvents: 'auto',
    userSelect: 'element',
    cursor: 'pointer',
    touchAction: 'manipulation',
  } as React.CSSProperties,
  image: {
    width: '50px',
    height: '50px',
  } as React.CSSProperties,
  newRecord: {
    position: 'absolute',
    left: `10px`,
    top: `-15px`
  } as React.CSSProperties,
};
