import * as React from 'react';
import * as style from './styles.css';

import { CoinValue } from 'app/models';
import { CONST } from 'app/utils';
import { AnimationLoop } from 'app/utils/animation';
import { IMAGES, getCoinImage } from 'app/constants/images';

// 색상 폴백
const COIN_COLORS: { [key: number]: string } = {
  1: '#F9D923',
  5: '#36AE7C',
  10: '#EB5353',
  50: '#187498',
  100: '#7952B3',
  500: '#FF6B6B',
  1000: '#6A67CE',
  0: '#CCCCCC' // 기본값 추가
};

export namespace NextCoins {
  export interface Props {
    coins: CoinValue[];
    savedCoin: CoinValue;
    image: string;
    onSaveClick: () => void;
    onImageClick: () => void;
  }

  export interface State {
    moveMarginLeft: number;
    holdNextMarginLeft: number;
    holdSavedMarginLeft: number;
    scale: number;
  }
}

export class NextCoins extends React.Component<NextCoins.Props, NextCoins.State> {
  static defaultProps: Partial<NextCoins.Props> = {};

  private isInitHoldAnimation: boolean = false;

  constructor(props: NextCoins.Props, context?: any) {
    super(props, context);

    this.state = {
      moveMarginLeft: 0,
      holdNextMarginLeft: 0,
      holdSavedMarginLeft: 0,
      scale: 1,
    };
  }

  render(): JSX.Element {
    console.log('NextCoins render - coins:', this.props.coins);
    
    return (
      <div style={styles.container}>
        <div
          style={{
            ...styles.hold,
            backgroundImage: `url(${IMAGES.GAME_BOX_HOLD})`,
            backgroundColor: '#58B19F',
          }}
          onClick={() => { this.props.onSaveClick(); }}
        >
          {
            CoinValue.VALUES.map((value) => {
              return (
                <img
                  key={`saved-coin-${value}`}
                  style={{
                    ...styles.holdCoin,
                    visibility: this.props.savedCoin === value ? 'visible' : 'hidden',
                    marginLeft: -this.state.holdSavedMarginLeft,
                  }}
                  src={getCoinImage(value)}
                  onError={(e: any) => {
                    // 이미지 로드 실패 시 대체 텍스트 보이기
                    e.target.style.backgroundColor = COIN_COLORS[value] || '#F9D923';
                    e.target.style.display = 'flex';
                    e.target.style.justifyContent = 'center';
                    e.target.style.alignItems = 'center';
                    e.target.style.color = '#fff';
                    e.target.style.fontWeight = 'bold';
                    e.target.style.fontSize = '18px';
                    e.target.innerText = value.toString();
                    e.target.style.borderRadius = '50%';
                  }}
                />
              );
            })
          }
        </div>
        <div style={{
          ...styles.nextCoins,
          backgroundImage: `url(${IMAGES.GAME_BOX_NEXT})`,
          backgroundColor: '#58B19F',
        }}>
          <div style={styles.nextCoinDiv}>
          {
            CoinValue.VALUES.map((value) => {
              return (
                <img
                  key={`next-coin-0-${value}`}
                  className={style.coin_pulse}
                  style={{
                    ...styles.nextCoinImg,
                    visibility: this.props.coins[0] === value ? 'visible' : 'hidden',
                    marginLeft: this.state.moveMarginLeft + this.state.holdNextMarginLeft,
                  }}
                  src={getCoinImage(value)}
                  onError={(e: any) => {
                    // 이미지 로드 실패 시 대체 텍스트 보이기
                    e.target.style.backgroundColor = COIN_COLORS[value] || '#F9D923';
                    e.target.style.display = 'flex';
                    e.target.style.justifyContent = 'center';
                    e.target.style.alignItems = 'center';
                    e.target.style.color = '#fff';
                    e.target.style.fontWeight = 'bold';
                    e.target.style.fontSize = '18px';
                    e.target.innerText = value.toString();
                    e.target.style.borderRadius = '50%';
                  }}
                />
              );
            })
          }
          </div>
          <div style={styles.nextCoinDiv}>
          {
            CoinValue.VALUES.map((value) => {
              return (
                <img
                  key={`next-coin-1-${value}`}
                  style={{
                    ...styles.nextCoinImg,
                    visibility: this.props.coins[1] === value ? 'visible' : 'hidden',
                    marginLeft: this.state.moveMarginLeft,
                  }}
                  src={getCoinImage(value)}
                  onError={(e: any) => {
                    // 이미지 로드 실패 시 대체 텍스트 보이기
                    e.target.style.backgroundColor = COIN_COLORS[value] || '#F9D923';
                    e.target.style.display = 'flex';
                    e.target.style.justifyContent = 'center';
                    e.target.style.alignItems = 'center';
                    e.target.style.color = '#fff';
                    e.target.style.fontWeight = 'bold';
                    e.target.style.fontSize = '18px';
                    e.target.innerText = value.toString();
                    e.target.style.borderRadius = '50%';
                  }}
                />
              );
            })
          }
          </div>
          <div style={styles.nextCoinDiv}>
          {
            CoinValue.VALUES.map((value) => {
              return (
                <img
                  key={`next-coin-2-${value}`}
                  style={{
                    ...styles.nextCoinImg,
                    visibility: this.props.coins[2] === value ? 'visible' : 'hidden',
                    transform: `scale(${this.state.scale})`
                  }}
                  src={getCoinImage(value)}
                  onError={(e: any) => {
                    // 이미지 로드 실패 시 대체 텍스트 보이기
                    e.target.style.backgroundColor = COIN_COLORS[value] || '#F9D923';
                    e.target.style.display = 'flex';
                    e.target.style.justifyContent = 'center';
                    e.target.style.alignItems = 'center';
                    e.target.style.color = '#fff';
                    e.target.style.fontWeight = 'bold';
                    e.target.style.fontSize = '18px';
                    e.target.innerText = value.toString();
                    e.target.style.borderRadius = '50%';
                  }}
                />
              );
            })
          }
          </div>
        </div>
        <div
          style={styles.retry}
          onClick={() => { this.props.onImageClick(); }}
        >
          <img
            style={styles.retryImg}
            src={this.props.image}
            onError={(e: any) => {
              // 이미지 로드 실패 시 대체 텍스트 보이기
              e.target.style.backgroundColor = '#EB5353';
              e.target.style.display = 'flex';
              e.target.style.justifyContent = 'center';
              e.target.style.alignItems = 'center';
              e.target.style.color = '#fff';
              e.target.style.fontWeight = 'bold';
              e.target.style.fontSize = '18px';
              e.target.innerText = 'Retry';
            }}
          />
        </div>
      </div>
    );
  }

  public startMoveAnimation(): void {
    this.setState(
      { moveMarginLeft: 60 },
      async () => {
        const animation = new AnimationLoop(
          (delta) =>  {
            this.setState({
              moveMarginLeft: 60 - 60 * delta / MOVE_ANIM_DURATION,
            });
          },
          MOVE_ANIM_DURATION
        );
        await animation.start();

        this.setState({
          moveMarginLeft: 0,
        });
      });
  }

  public startAppearAnimation(): void {
    this.setState(
      { scale: 0 },
      async () => {
        const animation = new AnimationLoop(
          (delta) => {
            this.setState({
              scale: 1 * delta / SCALE_ANIM_DURATION,
            });
          },
          SCALE_ANIM_DURATION
        );

        await animation.start();
        this.setState({
          scale: 1,
        });
      });
  }

  public startHoldAnimation(isInitHoldAnimation: boolean): void {
    this.isInitHoldAnimation = isInitHoldAnimation;
    if (isInitHoldAnimation) {
      this.startMoveAnimation();
    }
    this.setState(
      {
        holdNextMarginLeft: 0,
        holdSavedMarginLeft: -100,
      },
      async () => {
        const animation = new AnimationLoop(
          (delta) => {
            const margin = -100 + 100 * delta / HOLD_ANIM_DURATION;

            this.setState({
              holdNextMarginLeft: this.isInitHoldAnimation ? 0 : margin,
              holdSavedMarginLeft: margin,
            });
          },
          HOLD_ANIM_DURATION
        );

        await animation.start();
        this.setState({
          holdNextMarginLeft: 0,
          holdSavedMarginLeft: 0,
        });
      });
  }
}

const MOVE_ANIM_DURATION = 100;
const SCALE_ANIM_DURATION = 200;
const HOLD_ANIM_DURATION = 100;

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    position: 'relative',
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    width: `${CONST.WIDTH}px`,
    height: '120px',
    background: '#58d6c0',
    borderTopLeftRadius: '7px',
    borderTopRightRadius: '7px',
  } as React.CSSProperties,
  nextCoins: {
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    width: '212px',
    height: '100px',
  } as React.CSSProperties,
  nextCoinDiv: {
    width: `${CONST.WIDTH}px`,
    height: '52px',
    marginBottom: '25px',
    marginLeft: '14px',
    zIndex: 2,
  } as React.CSSProperties,
  nextCoinImg: {
    position: 'absolute',
  } as React.CSSProperties,
  nextCoinScaleVisible: {
    visibility: 'visible',
    transform: 'scale(1.0)',
    transition: 'transform 100ms linear',
  } as React.CSSProperties,
  nextCoinScaleHidden: {
    visibility: 'hidden',
    transform: 'scale(0.0)',
  } as React.CSSProperties,
  hold: {
    position: 'relative',
    width: '80px',
    height: '100px',
    pointerEvents: 'auto',
    userSelect: 'element',
    cursor: 'pointer',
    touchAction: 'manipulation',
  } as React.CSSProperties,
  holdCoin: {
    position: 'absolute',
    width: '48px',
    height: '52px',
    left: '16px',
    top: '12px',
    zIndex: 2,
  } as React.CSSProperties,
  img: {
    display: 'flex',
    height: '100%',
    justifyContent: 'space-around',
    pointerEvents: 'none',
    userSelect: 'none',
  } as React.CSSProperties,
  retry: {
    pointerEvents: 'auto',
    userSelect: 'element',
    cursor: 'pointer',
    touchAction: 'manipulation',
  } as React.CSSProperties,
  retryImg: {
    width: '50px',
    height: '50px',
  } as React.CSSProperties,
};
