import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { gameReducer } from 'app/reducers/GameReducer';
import { dialogReducer } from 'app/reducers/DialogReducer';
import { RootState } from './state';

// Create root reducer
export const rootReducer = combineReducers({
  router: routerReducer,
  game: gameReducer,
  dialog: dialogReducer
});
