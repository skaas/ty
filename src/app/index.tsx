import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { App as MainApp } from 'app/containers/App';
import { App as Replay } from 'app/containers/Replay';
import { hot } from 'react-hot-loader';

// Create the App component with hot reloading
const App = hot(module)(() => (
  <Switch>
    <Route exact={true} path="/replay/:log" component={Replay} />
    <Route exact={true} path="/" component={MainApp} />
    <Redirect to="/" />
  </Switch>
));

export { App };
