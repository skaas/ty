import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { gameReducer } from 'app/reducers/GameReducer';
import { dialogReducer } from 'app/reducers/DialogReducer';
import { RootState } from './state';

// Re-export RootState for use in components
export { RootState };

// Create root reducer
export const rootReducer = (history: any) => combineReducers({
  router: connectRouter(history) as any,
  game: gameReducer as any,
  dialog: dialogReducer as any
});
