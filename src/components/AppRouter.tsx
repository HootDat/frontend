import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        {/* /?pin=1234 for join room with id */}
        {/* /packs for managing question packs */}

        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;
