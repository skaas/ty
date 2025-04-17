import * as React from 'react';
// 이미지 경로 수정
import gameBoxHold from '../../assets/images/game_box_hold.png';
import gameBoxNext from '../../assets/images/game_box_next.png';
import mouseBtnRetry from '../../assets/images/pause_btn_retry.png';
import gameCoin from '../../assets/images/game_coin_1.png';

// JSX에서 사용
<img src={gameBoxHold} alt="Box Hold" />

// 방법 2: require 사용
<img src={require('../../assets/images/game_box_hold.png')} alt="Box Hold" />

// GitHub Raw URL 사용
const gameBoxHold = 'https://raw.githubusercontent.com/username/repo/main/images/game_box_hold.png';
const gameBoxNext = 'https://raw.githubusercontent.com/username/repo/main/images/game_box_next.png';

// JSX에서 사용
<img src={gameBoxHold} alt="Box Hold" />

export interface GameProps {
  // 필요한 props 정의
}

export interface GameState {
  // 필요한 state 정의
  score: number;
  bestScore: number;
}

export class Game extends React.Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);
    this.state = {
      score: 1,
      bestScore: 1
      // 기타 초기 상태
    };
  }

  // 게임 로직 메서드들...

  render() {
    return (
      <div className="game-container">
        <h1>Make 5000</h1>
        
        <div className="score-container">
          <div className="score">
            <div>Score</div>
            <div>{this.state.score}</div>
          </div>
          <div className="best">
            <div>Best</div>
            <div>{this.state.bestScore}</div>
          </div>
        </div>
        
        <div className="game-board">
          {/* 상단 영역 (다음 블록 표시) */}
          <div className="next-block-area">
            <img src={gameBoxNext} alt="Next Block" />
            {/* 다음 블록 내용 */}
          </div>
          
          {/* 게임 보드 영역 */}
          <div className="board-grid">
            {/* 게임 보드 그리드 */}
            {/* 여기에 게임 로직에 따라 동적으로 블록 생성 */}
          </div>
          
          {/* 현재 블록 영역 */}
          <div className="current-block">
            <img src={gameBoxHold} alt="Current Block" />
            {/* 현재 블록 내용 */}
          </div>
          
          {/* 재시작 버튼 */}
          <div className="retry-button">
            <img src={mouseBtnRetry} alt="Retry" onClick={this.handleRetry} />
          </div>
        </div>
      </div>
    );
  }
  
  // 이벤트 핸들러
  private handleRetry = () => {
    // 게임 재시작 로직
    console.log('Game restarted');
  }
  
  // 기타 필요한 메서드들...
}

export default Game; 