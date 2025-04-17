import * as React from 'react';

import { CoinValue } from 'app/models';
import { CONST } from 'app/utils';
import { getCoinImage } from 'app/constants/images';

export namespace Coin {
  export interface Props {
    style: React.CSSProperties;
    value: CoinValue;
  }

  export interface State {
    style: React.CSSProperties;
  }
}

export class Coin extends React.Component<Coin.Props, Coin.State> {
  static defaultProps: Partial<Coin.Props> = {};

  constructor(props: Coin.Props, context?: any) {
    super(props, context);

    this.state = {
      style: {},
    };
  }

  render(): JSX.Element {
    const props = this.props;
    return (
      <div
        style={{
          ...styles.coin(),
          ...props.style,
          ...this.state.style,
        }}
      >
        {
          props.value !== 0 &&
            <img
              style={styles.coinImg()}
              src={getCoinImage(props.value)}
            />
        }
      </div>
    );
  }

  public setStyle(value: React.CSSProperties): void {
    this.setState({
      style: value,
    });
  }

  public getStyle(): React.CSSProperties {
    return this.state.style;
  }
}

const styles = {
  coin(): React.CSSProperties {
    return {
      position: 'absolute',
      width: `${CONST.COIN_WIDTH}px`,
      height: `${CONST.COIN_HEIGHT}px`,
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    } as React.CSSProperties;
  },
  coinImg(): React.CSSProperties {
    return {
      width: `${CONST.COIN_IMG_WIDTH}px`,
      height: `${CONST.COIN_IMG_HEIGHT}px`,
      display: 'block',
      margin: 'auto',
      zIndex: 10,
      pointerEvents: 'none',
      userSelect: 'none',
    } as React.CSSProperties;
  },
};
