import { combineReducers } from 'redux';
import { RootState } from './state';
import { routerReducer, RouterState } from 'react-router-redux';
import { gameReducer } from 'app/reducers/GameReducer';
import { dialogReducer } from 'app/reducers/DialogReducer';

export { RootState, RouterState };

export const rootReducer = combineReducers<RootState>({
  router: routerReducer as any,
  game: gameReducer as any,
  dialog: dialogReducer as any,
});
