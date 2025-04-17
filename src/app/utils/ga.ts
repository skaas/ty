import * as ReactGA from 'react-ga';
import { Storage } from 'app/utils/storage';
import { GameState } from 'app/reducers/state';
import { CONST } from 'app/utils/constants';

function skipGA(): boolean {
  return process.env.NODE_ENV !== 'production';
}

export function initGA(): void {
  if (skipGA()) {
    return;
  }

  ReactGA.initialize('UA-124494422-1', {
    gaOptions: {
      clientId: Storage.getUUID()
    }
  });
}

export function onGameStart(): void {
  if (skipGA()) {
    return;
  }

  ReactGA.set({
    dimension1: CONST.GAME_SIZE,
    dimension2: 1,
  });
  ReactGA.pageview('/gameplay');
}

export function onGameEnd(game: GameState): void {
  if (skipGA()) {
    return;
  }

  ReactGA.set({
    dimension1: CONST.GAME_SIZE,
    dimension2: 1,
    metric1: game.totalMove,
    metric2: game.score,
  });
  ReactGA.pageview('/gameend');

  ReactGA.set({
    eventLabel: game.log,
    page: '/gameend'
  });
  ReactGA.event({
    category: 'endinfo',
    action: '/gameend',
  });
}

export function onRetry(game: GameState): void {
  if (skipGA()) {
    return;
  }

  ReactGA.set({
    eventLabel: game.log,
    page: '/gameplay'
  });
  ReactGA.event({
    category: 'restart',
    action: '/gameplay',
  });
}

export function onRestart(game: GameState): void {
  if (skipGA()) {
    return;
  }

  ReactGA.set({
    eventLabel: game.log,
    page: '/gameend'
  });
  ReactGA.event({
    category: 'restart',
    action: '/gameend',
  });
}
