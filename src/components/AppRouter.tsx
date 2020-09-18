import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import GameShell from './game';
import NotFound from './NotFound';
import Login from './login';
import Packs from './packs';
import CreatePack from './packs/CreatePack';
import localStorage from './utils/localStorage';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={GameShell} />
        <Route exact path="/login" component={Login} />

        <Route exact path="/packs" component={Packs} />
        {localStorage.isAvailable() ? (
          <Route exact path="/packs/create" component={CreatePack} />
        ) : undefined}

        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;
