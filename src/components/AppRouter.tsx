import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import GameShell from './game';
import NotFound from './NotFound';
import Login from './login';
import Packs from './packs';
import PackNew from './packs/PackNew';
import store from '../utils/store';
import PackEdit from './packs/PackEdit';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={GameShell} />
        <Route exact path="/login" component={Login} />

        <Route exact path="/packs" component={Packs} />
        <Route
          exact
          path="/packs/new"
          component={store.isAvailable() ? PackNew : NotFound}
        />
        <Route
          exact
          path="/packs/:id/edit"
          component={store.isAvailable() ? PackEdit : NotFound}
        />

        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;
