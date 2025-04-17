import * as React from 'react';
import { AIThoughtEntry, CoinValue } from 'app/models';
import { IMAGES } from 'app/constants/images';

export namespace AIThoughtHistory {
  export interface Props {
    thoughts: AIThoughtEntry[];
    visible: boolean;
  }
}

export class AIThoughtHistory extends React.Component<AIThoughtHistory.Props> {
  static defaultProps: Partial<AIThoughtHistory.Props> = {
    visible: true
  };

  render(): JSX.Element | null {
    if (!this.props.visible) {
      return null;
    }

    return (
      <div style={styles.container}>
        <div style={styles.title}>AI의 생각 히스토리</div>
        {
          this.props.thoughts.length === 0 ? (
            <div style={styles.emptyMessage}>아직 기록이 없습니다</div>
          ) : (
            this.props.thoughts.slice().reverse().map((thought, index) => (
              <div key={`thought-${index}`} style={styles.entryContainer}>
                <div style={styles.turnInfo}>턴 {thought.turn}</div>
                <div style={styles.coinContainer}>
                  <img
                    style={styles.coinImage}
                    src={IMAGES.GAME_COIN_1.replace('1', thought.coinValue.toString())}
                    alt={`Coin ${thought.coinValue}`}
                  />
                </div>
                <div style={styles.reasonContainer}>
                  <div style={styles.reasonText}>{thought.reason}</div>
                  <div style={styles.weightsContainer}>
                    {this.renderWeights(thought)}
                  </div>
                </div>
              </div>
            ))
          )
        }
      </div>
    );
  }

  renderWeights(thought: AIThoughtEntry) {
    const result = [];
    for (const coin in thought.weights) {
      if (thought.weights.hasOwnProperty(coin)) {
        const weight = thought.weights[Number(coin) as CoinValue];
        if (weight !== undefined) {
          result.push(
            <div key={`weight-${coin}`} style={styles.weightItem}>
              {coin}: {weight.toFixed(1)}
            </div>
          );
        }
      }
    }
    return result;
  }
}

const styles = {
  container: {
    position: 'absolute',
    right: '20px',
    top: '240px',
    width: '250px',
    maxHeight: '400px',
    overflowY: 'auto',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    padding: '10px',
    zIndex: 50,
  } as React.CSSProperties,
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#3f9cba',
    marginBottom: '10px',
    textAlign: 'center',
  } as React.CSSProperties,
  emptyMessage: {
    padding: '20px',
    textAlign: 'center',
    color: '#999',
  } as React.CSSProperties,
  entryContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #eee',
  } as React.CSSProperties,
  turnInfo: {
    width: '40px',
    fontSize: '14px',
    color: '#666',
  } as React.CSSProperties,
  coinContainer: {
    width: '40px',
    display: 'flex',
    justifyContent: 'center',
  } as React.CSSProperties,
  coinImage: {
    width: '30px',
    height: '30px',
  } as React.CSSProperties,
  reasonContainer: {
    flex: 1,
    marginLeft: '10px',
  } as React.CSSProperties,
  reasonText: {
    fontSize: '14px',
    color: '#333',
  } as React.CSSProperties,
  weightsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '5px',
  } as React.CSSProperties,
  weightItem: {
    fontSize: '12px',
    color: '#666',
    marginRight: '5px',
  } as React.CSSProperties,
}; 