import { Store, createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { History } from 'history';
import { routerMiddleware } from 'react-router-redux';

import { rootReducer } from 'app/reducers';
import { storageMiddleware } from 'app/middleware';

export function configureStore(history: History): Store<any> {
  // Create middlewares
  const middlewares: any[] = [
    storageMiddleware
  ];

  // Add router middleware (if available)
  try {
    const routerMid = routerMiddleware(history);
    if (routerMid) {
      middlewares.push(routerMid);
    }
  } catch (error) {
    console.warn('Could not add router middleware:', error);
  }

  // Add logger in development
  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger({
      predicate: () => (window as any).debugAction
    }));
  }

  // Create store
  const store = createStore(
    rootReducer,
    applyMiddleware(...middlewares)
  );

  // Enable Webpack hot module replacement for reducers
  if (module.hot) {
    module.hot.accept('app/reducers', () => {
      const nextReducer = require('app/reducers').rootReducer;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
