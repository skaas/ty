import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import { configureStore } from 'app/store';
import { App } from './app';
import { initGA } from 'app/utils/ga';

// prepare debug options
if (process.env.NODE_ENV !== 'production') {
  (window as any).debugAction = false;
  (window as any).setDebugAction = (value: boolean) => {
    (window as any).debugAction = value;
  };
}

// prepare store
const history = createBrowserHistory();
const store = configureStore(history);

initGA();

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
