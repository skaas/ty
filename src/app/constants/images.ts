// 개별 이미지 파일을 불러와 중앙에서 관리
import gameBoxHold from '../assets/images/game_box_hold.png';
import gameBoxNext from '../assets/images/game_box_next.png';
import mouseBtnRetry from '../assets/images/pause_btn_retry.png';
import gameCoin1 from '../assets/images/game_coin_1.png';
import gameCoin5 from '../assets/images/game_coin_5.png';
import gameCoin10 from '../assets/images/game_coin_10.png';
import gameCoin50 from '../assets/images/game_coin_50.png';
import gameCoin100 from '../assets/images/game_coin_100.png';
import gameCoin500 from '../assets/images/game_coin_500.png';
import gameCoin1000 from '../assets/images/game_coin_1000.png';
import gameCoinboxDown from '../assets/images/game_coinbox_down.png';
import gameCoinboxLeft from '../assets/images/game_coinbox_left.png';
import gameCoinboxRight from '../assets/images/game_coinbox_right.png';
import gameCoinboxUp from '../assets/images/game_coinbox_up.png';
import gameResultNew from '../assets/images/game_result_new.png';
import gameBtnPlay from '../assets/images/game_btn_play.png';
import gameBtnPause from '../assets/images/game_btn_pause.png';
import mainBtnTwitter from '../assets/images/main_btn_twitter.png';

export const IMAGES = {
  GAME_BOX_HOLD: gameBoxHold,
  GAME_BOX_NEXT: gameBoxNext,
  MOUSE_BTN_RETRY: mouseBtnRetry,
  GAME_COIN_1: gameCoin1,
  GAME_COIN_5: gameCoin5,
  GAME_COIN_10: gameCoin10,
  GAME_COIN_50: gameCoin50,
  GAME_COIN_100: gameCoin100,
  GAME_COIN_500: gameCoin500,
  GAME_COIN_1000: gameCoin1000,
  GAME_COINBOX_DOWN: gameCoinboxDown,
  GAME_COINBOX_LEFT: gameCoinboxLeft,
  GAME_COINBOX_RIGHT: gameCoinboxRight,
  GAME_COINBOX_UP: gameCoinboxUp,
  GAME_RESULT_NEW: gameResultNew,
  GAME_BTN_PLAY: gameBtnPlay,
  GAME_BTN_PAUSE: gameBtnPause,
  MAIN_BTN_TWITTER: mainBtnTwitter,
  // 기타 이미지들...
};

// 코인 이미지를 숫자 값으로 쉽게 접근할 수 있는 헬퍼 함수
export function getCoinImage(value: number): string {
  switch(value) {
    case 1: return IMAGES.GAME_COIN_1;
    case 5: return IMAGES.GAME_COIN_5;
    case 10: return IMAGES.GAME_COIN_10;
    case 50: return IMAGES.GAME_COIN_50;
    case 100: return IMAGES.GAME_COIN_100;
    case 500: return IMAGES.GAME_COIN_500;
    case 1000: return IMAGES.GAME_COIN_1000;
    default: return '';
  }
} 