import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './components/Home';
import Room from './components/Room';

import './styles/index.css';

const App = (props) => {
  return (
    <Switch>
      <Route path='/room/:id' component={Room} />
      <Route exact path='/' component={Home} />
    </Switch>
  );
}

export default App;