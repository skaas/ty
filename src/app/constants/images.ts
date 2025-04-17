// 이미지 경로를 중앙에서 관리
const IMAGES_PATH = '/assets/images';

export const IMAGES = {
  GAME_BOX_HOLD: `${IMAGES_PATH}/game_box_hold.png`,
  GAME_BOX_NEXT: `${IMAGES_PATH}/game_box_next.png`,
  MOUSE_BTN_RETRY: `${IMAGES_PATH}/pause_btn_retry.png`,
  GAME_COIN_1: `${IMAGES_PATH}/game_coin_1.png`,
  GAME_COIN_5: `${IMAGES_PATH}/game_coin_5.png`,
  GAME_COIN_10: `${IMAGES_PATH}/game_coin_10.png`,
  GAME_COIN_50: `${IMAGES_PATH}/game_coin_50.png`,
  GAME_COIN_100: `${IMAGES_PATH}/game_coin_100.png`,
  GAME_COIN_500: `${IMAGES_PATH}/game_coin_500.png`,
  GAME_COIN_1000: `${IMAGES_PATH}/game_coin_1000.png`,
  GAME_COINBOX_DOWN: `${IMAGES_PATH}/game_coinbox_down.png`,
  GAME_COINBOX_LEFT: `${IMAGES_PATH}/game_coinbox_left.png`,
  GAME_COINBOX_RIGHT: `${IMAGES_PATH}/game_coinbox_right.png`,
  GAME_COINBOX_UP: `${IMAGES_PATH}/game_coinbox_up.png`,
  GAME_RESULT_NEW: `${IMAGES_PATH}/game_result_new.png`,
  GAME_BTN_PLAY: `${IMAGES_PATH}/game_btn_play.png`,
  GAME_BTN_PAUSE: `${IMAGES_PATH}/game_btn_pause.png`,
  MAIN_BTN_TWITTER: `${IMAGES_PATH}/main_btn_twitter.png`,
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