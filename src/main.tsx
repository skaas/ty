import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { configureStore } from 'app/store';
import { App } from './app';
import { createBrowserHistory } from 'history';

// prepare debug options
if (process.env.NODE_ENV !== 'production') {
  (window as any).debugAction = false;
  (window as any).setDebugAction = (value: boolean) => {
    (window as any).debugAction = value;
  };
}

// prepare store and history
const history = createBrowserHistory();
const store = configureStore(history);

// Create a class-based Provider to avoid the warning
class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    );
  }
}

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);
