import * as React from 'react';
import { AIThoughtEntry, CoinValue } from 'app/models';
import { IMAGES } from 'app/constants/images';
import { CONST } from 'app/utils';

export namespace AIThoughtPanel {
  export interface Props {
    currentThought: AIThoughtEntry | null;
  }
}

export class AIThoughtPanel extends React.Component<AIThoughtPanel.Props> {
  static defaultProps: Partial<AIThoughtPanel.Props> = {
    currentThought: null
  };

  render(): JSX.Element {
    const { currentThought } = this.props;
    
    return (
      <div style={styles.container}>
        <div style={styles.title}>AI의 생각</div>
        {
          !currentThought ? (
            <div style={styles.emptyMessage}>아직 생각이 없습니다</div>
          ) : (
            <div style={styles.thoughtContainer}>
              <div style={styles.coinContainer}>
                <img
                  style={styles.coinImage}
                  src={IMAGES.GAME_COIN_1.replace('1', currentThought.coinValue.toString())}
                  alt={`Coin ${currentThought.coinValue}`}
                />
              </div>
              <div style={styles.reasonContainer}>
                {this.getFormattedReason(currentThought)}
              </div>
            </div>
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
    position: 'relative',
    width: '100%',
    height: '100px',
    background: 'rgba(173, 216, 230, 0.6)',
    border: '1px solid rgba(63, 156, 186, 0.5)',
    borderTop: '2px solid #3f9cba',
    borderRadius: '0 0 10px 10px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 20px 15px 20px',
    marginTop: '-2px',
    marginBottom: '15px',
    zIndex: 10,
  } as React.CSSProperties,
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#3f9cba',
    padding: '10px 0 5px 0',
    borderBottom: '1px solid #3f9cba',
  } as React.CSSProperties,
  emptyMessage: {
    padding: '20px 0',
    textAlign: 'center',
    color: '#999',
    fontSize: '14px',
  } as React.CSSProperties,
  thoughtContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 0',
    height: '100%',
  } as React.CSSProperties,
  coinContainer: {
    width: '45px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '15px',
  } as React.CSSProperties,
  coinImage: {
    width: '40px',
    height: '40px',
  } as React.CSSProperties,
  reasonContainer: {
    flex: 1,
  } as React.CSSProperties,
  reasonMainText: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  } as React.CSSProperties,
  reasonSubText: {
    fontSize: '14px',
    color: '#666',
    marginTop: '5px',
  } as React.CSSProperties,
  reasonIcon: {
    fontSize: '20px',
    marginRight: '5px',
  } as React.CSSProperties,
}; 