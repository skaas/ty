import { Middleware } from 'redux';

export const storageMiddleware: Middleware = store => next => (action) => {
  next(action);
};
