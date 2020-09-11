import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import GameShell from './game';
import NotFound from './NotFound';
import Login from './login';
import Packs from './packs';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={GameShell} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/packs" component={Packs} />

        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;
