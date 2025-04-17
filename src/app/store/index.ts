import { Store, createStore, AnyAction, Reducer, applyMiddleware, Middleware } from 'redux';
import { createLogger } from 'redux-logger';
import { History } from 'history';

import { RootState, rootReducer } from 'app/reducers';
import { storageMiddleware } from 'app/middleware';

export function configureStore(history: History, initialState?: RootState): Store<RootState> {
  const middlewares: Middleware[] = [];
  middlewares.push(storageMiddleware);

  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger({
      predicate: () => {
        return (window as any).debugAction;
      }
    }));
  }

  const middleware = applyMiddleware(...middlewares);

  const store = createStore(rootReducer as Reducer<RootState, AnyAction>,
                            initialState as RootState,
                            middleware) as Store<RootState>;

  if (module.hot) {
    module.hot.accept('app/reducers', () => {
      const nextReducer = require('app/reducers') as Reducer<RootState, AnyAction>;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
