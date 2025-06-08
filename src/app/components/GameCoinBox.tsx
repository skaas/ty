import * as React from 'react';

import { Directions } from 'app/models';
import { CONST } from 'app/utils';
import { IMAGES } from 'app/constants/images';

import Img from 'react-image';

export namespace GameCoinBox {
  export interface Props {
    style: {
      left: number,
      top: number,
    };
    direction: Directions;
    onClick: () => void;
  }

  export interface State {
    style: React.CSSProperties;
  }
}

export class GameCoinBox extends React.Component<GameCoinBox.Props, GameCoinBox.State> {
  static defaultProps: Partial<GameCoinBox.Props> = {};

  constructor(props: GameCoinBox.Props, context?: any) {
    super(props, context);

    this.state = {
      style: {}
    };
  }

  componentDidMount(): void {
    this.forceUpdate();
  }

  render(): JSX.Element {
    const props = this.props;
    const imagePath = this.getImagePath(props.direction);
    
    return (
      <div
        style={{
          ...styles.coinBox(),
          ...props.style,
          ...this.state.style,
        }}
      >
        <Img
          style={styles.boxImg()}
          src={imagePath}
          onClick={() => this.props.onClick()}
        />
      </div>
    );
  }

  private getImagePath(direction: Directions): string {
    switch (direction) {
      case 'up': return IMAGES.GAME_COINBOX_UP;
      case 'down': return IMAGES.GAME_COINBOX_DOWN;
      case 'left': return IMAGES.GAME_COINBOX_LEFT;
      case 'right': return IMAGES.GAME_COINBOX_RIGHT;
      default: return '';
    }
  }

  public setStyle(value: React.CSSProperties): void {
    this.setState({
      style: value,
    });
  }
}

const styles = {
  coinBox(): React.CSSProperties {
    return {
      position: 'absolute',
      width: `${CONST.COIN_WIDTH}px`,
      height: `${CONST.COIN_HEIGHT}px`,
      zIndex: 5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    } as React.CSSProperties;
  },
  boxImg(): React.CSSProperties {
    return {
      display: 'block',
      pointerEvents: 'auto',
      userSelect: 'element',
      cursor: 'pointer',
      width: `${CONST.COIN_WIDTH}px`,
      height: `${CONST.COIN_HEIGHT}px`,
      touchAction: 'manipulation',
    } as React.CSSProperties;
  },
};
