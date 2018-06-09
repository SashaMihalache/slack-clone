import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';

import Home from './Home';
import Register from './Register';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route path='/' exact component={Home} />
      <Route path='/register' exact component={Register} />
    </Switch>
  </BrowserRouter>
)

export default Router;