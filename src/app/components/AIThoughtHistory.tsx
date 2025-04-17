import * as React from 'react';
import { AIThoughtEntry, CoinValue } from 'app/models';
import { IMAGES } from 'app/constants/images';
import { CONST } from 'app/utils';

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
                  {this.getFormattedReason(thought)}
                </div>
              </div>
            ))
          )
        }
      </div>
    );
  }

  private getFormattedReason(thought: AIThoughtEntry): JSX.Element {
    const selectedCoin = thought.coinValue;
    
    // 병합 가능성 케이스
    if (thought.reason.includes("병합 가능성")) {
      const count = parseInt(thought.reason.split('개')[0]);
      let upgradeValue = this.getUpgradeValue(selectedCoin, count);
      
      return (
        <div>
          <div style={styles.reasonMainText}>
            <span style={styles.reasonIcon}>🔄</span> 
            인접한 {selectedCoin} 동전 {count}개 발견!
          </div>
          <div style={styles.reasonSubText}>
            이대로 병합하면 {upgradeValue} 동전이 생성됩니다
          </div>
        </div>
      );
    }
    
    // 전략적 위치 케이스
    if (thought.reason === "전략적 위치 확보") {
      return (
        <div>
          <div style={styles.reasonMainText}>
            <span style={styles.reasonIcon}>🎯</span> 
            전략적 위치에 {selectedCoin} 동전 배치
          </div>
          <div style={styles.reasonSubText}>
            중앙 근처에서 더 많은 병합 기회를 만들 수 있어요
          </div>
        </div>
      );
    }
    
    // 균형 유지 케이스
    if (thought.reason === "균형잡힌 분포 유지") {
      return (
        <div>
          <div style={styles.reasonMainText}>
            <span style={styles.reasonIcon}>⚖️</span> 
            게임판 균형을 위해 {selectedCoin} 동전 선택
          </div>
          <div style={styles.reasonSubText}>
            {this.getBalanceReason(selectedCoin)}
          </div>
        </div>
      );
    }
    
    // 차선책 선택 케이스
    if (thought.reason === "차선책 선택") {
      return (
        <div>
          <div style={styles.reasonMainText}>
            <span style={styles.reasonIcon}>↩️</span> 
            다른 선택지가 없어 {selectedCoin} 동전 선택
          </div>
          <div style={styles.reasonSubText}>
            새로운 패턴을 만들기 위한 최선의 선택입니다
          </div>
        </div>
      );
    }
    
    // 기본 케이스
    return (
      <div>
        <div style={styles.reasonMainText}>{thought.reason}</div>
      </div>
    );
  }
  
  // 병합 후 업그레이드될 동전 값 계산
  private getUpgradeValue(coin: CoinValue, count: number): CoinValue {
    const mergedValue = coin * count;
    const coinValues = [1, 5, 10, 50, 100, 500] as CoinValue[];
    
    for (const value of coinValues.slice().reverse()) {
      if (value > coin && mergedValue >= value) {
        return value;
      }
    }
    return coin;
  }
  
  // 균형 관련 이유 생성
  private getBalanceReason(coin: CoinValue): string {
    if (coin <= 5) {
      return "낮은 가치 동전이 부족해 보여서 추가합니다";
    } else if (coin <= 10) {
      return "중간 가치 동전의 균형을 맞추기 위한 선택입니다";
    } else {
      return "높은 가치 동전으로 점수를 높일 기회를 만듭니다";
    }
  }
}

const styles = {
  container: {
    position: 'absolute',
    right: '20px',
    top: '240px',
    width: '280px',
    maxHeight: '400px',
    overflowY: 'auto',
    background: 'rgba(255, 255, 255, 0.95)',
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
    padding: '10px',
    borderBottom: '1px solid #eee',
  } as React.CSSProperties,
  turnInfo: {
    width: '50px',
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#666',
    paddingTop: '8px',
  } as React.CSSProperties,
  coinContainer: {
    width: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } as React.CSSProperties,
  coinImage: {
    width: '36px',
    height: '36px',
  } as React.CSSProperties,
  reasonContainer: {
    flex: 1,
    marginLeft: '8px',
  } as React.CSSProperties,
  reasonMainText: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
  } as React.CSSProperties,
  reasonSubText: {
    fontSize: '12px',
    color: '#666',
    marginTop: '3px',
  } as React.CSSProperties,
  reasonIcon: {
    fontSize: '16px',
    marginRight: '4px',
  } as React.CSSProperties,
}; 