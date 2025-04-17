import * as React from 'react';

import { Directions } from 'app/models';
import { CONST, S3_HOST } from 'app/utils';

const Img = require('react-image').default;

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
          src={`${S3_HOST}/images/game_coinbox_${props.direction}.png`}
          onClick={() => this.props.onClick()}
        />
      </div>
    );
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
