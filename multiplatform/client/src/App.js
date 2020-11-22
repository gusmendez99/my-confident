import React, {useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { connect } from 'react-redux';
import * as selectors from './reducers/index';

import './App.css';

import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import StartChat from './screens/StartChat';
import Chats from './screens/Chats';
import Chat from './screens/Chat'
import tachyons from 'tachyons';

function App({isAuthenticated}) {
  return (
    <div className="vh-100 flex flex-column justify-center">
      <Router>
      <div>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
                return (
                  isAuthenticated ?
                  <Redirect to="/my-chats" /> :
                  <Redirect to="/signin" /> 
                )
            }}
          />
          <Route path="/signin">
            <SignIn />
          </Route>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route path="/start-chat">
            <StartChat />
          </Route>
          <Route path="/my-chats">
            <Chats />
          </Route>
        </Switch>
      </div>
    </Router>
    </div>
  );
}


export default connect(
  (state) => ({
    isAuthenticated: selectors.isAuthenticated(state),
  }),
  undefined
)(App);
